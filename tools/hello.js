// This file defines the 'hello' tool.
// We export the tool's name and its full definition object.

import { z } from "zod";

export const name = 'hello';

export const definition = {
  title: "Hello Tool",
  description: "Use this tool to greet a person or entity.",
  
  // The arguments the tool accepts, defined as a schema object (not JSON Schema)
  inputSchema: {
    name: z.string().describe("The name of the person or entity to greet."),
  },
  
  // The function that gets executed when the tool is called
  handler: async (args) => {
    console.log(`[MCP] 'hello' tool executed with args:`, args);
    // Return the official MCP content structure
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${args.name}! You have successfully used the hello tool.`,
        },
      ],
    };
  },
};