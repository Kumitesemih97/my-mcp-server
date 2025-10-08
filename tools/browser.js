// This file defines the 'open_website' tool.
// Opens a website in the default browser.

import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const name = 'open_website';

export const definition = {
  title: "Browser Tool",
  description: "Opens a website in the default browser. Accepts URLs like 'chatgpt.com' or 'www.chatgpt.com'.",
  
  // The arguments the tool accepts, defined as a Zod schema
  inputSchema: {
    url: z.string().describe("The website URL to open (e.g., 'chatgpt.com', 'www.google.com', or 'https://example.com')"),
  },
  
  // The function that gets executed when the tool is called
  handler: async (args) => {
    console.log(`[MCP] 'open_website' tool executed with args:`, args);
    
    const { url } = args;
    
    if (!url || url.trim() === '') {
      return {
        content: [
          {
            type: "text",
            text: "Error: URL cannot be empty",
          },
        ],
      };
    }
    
    let processedUrl = url.trim();
    
    // Add https:// if no protocol is specified
    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }
    
    try {
      // Detect the operating system and use the appropriate command
      let command;
      if (process.platform === 'darwin') { // macOS
        command = `open "${processedUrl}"`;
      } else if (process.platform === 'win32') { // Windows
        command = `start "" "${processedUrl}"`;
      } else { // Linux and others
        command = `xdg-open "${processedUrl}"`;
      }
      
      await execAsync(command);
      
      return {
        content: [
          {
            type: "text",
            text: `Website launched: ${processedUrl}`,
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] Browser tool error:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error launching website: ${error.message}`,
          },
        ],
      };
    }
  },
};