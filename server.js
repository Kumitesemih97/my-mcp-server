import express from "express";
import path from "path";
import fs from "fs/promises"; // Using promises version of fs
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// --- Basic Setup ---
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Add CORS support for external access (needed for Hugging Face Spaces)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "public")));

// --- MCP Server Setup ---
const mcpServer = new McpServer({
  name: "my-pluggable-mcp-server",
  version: "0.0.2",
}, {
  capabilities: {
    tools: {},
  },
});

// Store tools in a Map for easier access
const tools = new Map();

// ***************************************************************
// NEW: Dynamic Tool Registration Function
// ***************************************************************
async function registerTools() {
  const toolsDir = path.join(__dirname, "tools");
  try {
    const files = await fs.readdir(toolsDir);
    const toolModules = files.filter(file => file.endsWith('.js'));

    console.log(`[MCP] Found ${toolModules.length} tool(s) to register...`);

    for (const file of toolModules) {
      const filePath = path.join(toolsDir, file);
      // Use dynamic import() to load the module
      const toolModule = await import(`file://${filePath}`);
      
      if (toolModule.name && toolModule.definition) {
        const { name, definition } = toolModule;
        const { description, inputSchema, handler } = definition;
        
        // Register tool using the official MCP server.tool() method
        mcpServer.tool(name, description, inputSchema, handler);
        
        // Also store in our map for Ollama integration
        tools.set(name, definition);
        console.log(`[MCP] -> Registered tool: '${name}'`);
      } else {
        console.warn(`[MCP] -> WARNING: Could not register tool from ${file}. Missing 'name' or 'definition' export.`);
      }
    }
  } catch (error) {
    console.error("[MCP] Error registering tools:", error);
  }
}

// --- Ollama Integration ---
const OLLAMA_API_URL = "http://localhost:11434/api/chat";

// Helper function to format MCP tools for Ollama
function getOllamaTools() {
  const ollamaTools = [];
  for (const [name, tool] of tools.entries()) {
    // Convert zod schema to JSON schema format for Ollama
    const properties = {};
    const required = [];
    
    if (tool.inputSchema) {
      for (const [key, value] of Object.entries(tool.inputSchema)) {
        if (value && value._def) { // This is a zod schema
          const zodDef = value._def;
          
          // Handle different zod types
          let type = "string";
          let description = "";
          
          if (zodDef.typeName === "ZodString") {
            type = "string";
          } else if (zodDef.typeName === "ZodNumber") {
            type = "number";
          } else if (zodDef.typeName === "ZodBoolean") {
            type = "boolean";
          }
          
          // Get description if available
          if (value.description) {
            description = value.description;
          }
          
          properties[key] = {
            type: type,
            description: description,
          };
          required.push(key);
        }
      }
    }
    
    ollamaTools.push({
      type: "function",
      function: {
        name: name,
        description: tool.description,
        parameters: {
          type: "object",
          properties: properties,
          required: required,
        },
      },
    });
  }
  console.log("[Debug] Generated Ollama tools:", JSON.stringify(ollamaTools, null, 2));
  return ollamaTools;
}

// The main chat endpoint (this logic remains the same)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).send("Messages are required");

  try {
    const ollamaTools = getOllamaTools();
    let currentMessages = messages;

    while (true) {
      const requestBody = {
        model: "llama3.2:3b",
        messages: currentMessages,
        tools: ollamaTools,
        stream: false,
      };

      console.log("[Debug] Sending to Ollama:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(OLLAMA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Debug] Ollama error response:", errorText);
        throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
      }
      
      const responseData = await response.json();
      const responseMessage = responseData.message;
      currentMessages.push(responseMessage);

      if (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0) {
        // Clean up the response to remove thinking process
        let cleanResponse = responseMessage.content;
        if (cleanResponse) {
          // Remove <think>...</think> blocks (including multiline)
          cleanResponse = cleanResponse.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        }
        
        res.json({ message: cleanResponse });
        return;
      }

      console.log("[Ollama] Model wants to call tools:", responseMessage.tool_calls);
      const toolCallResults = [];
      for (const toolCall of responseMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = toolCall.function.arguments;
        const tool = tools.get(toolName);
        if (tool && tool.handler) {
          const result = await tool.handler(toolArgs);
          // Handle MCP response format: { content: [{ type: "text", text: "..." }] }
          let content;
          if (result && result.content && Array.isArray(result.content)) {
            // Extract text from MCP response format
            content = result.content
              .filter(item => item.type === "text")
              .map(item => item.text)
              .join("\n");
          } else if (typeof result === 'string') {
            content = result;
          } else {
            content = JSON.stringify(result);
          }
          
          toolCallResults.push({
            role: "tool",
            content: content,
            tool_call_id: toolCall.id, // Include the original tool_call_id
          });
        }
      }
      currentMessages.push(...toolCallResults);
      console.log("[MCP] Sending tool results back to Ollama.");
    }
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    res.status(500).send("Failed to get response from the model.");
  }
});

// --- Start the Server ---
// We wrap the server start in an async function to load tools first
async function startServer() {
  await registerTools(); // Load and register all tools
  
  app.listen(port, () => {
    console.log(`[Express] Server listening at http://localhost:${port}`);
    console.log(`[Info] Available tools:`, Array.from(tools.keys()));
    console.log("[Info] Open the URL in your browser to start chatting.");
  });
}

startServer();