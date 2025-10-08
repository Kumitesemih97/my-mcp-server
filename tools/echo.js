// This file defines echo tools.
// Simple echo and reverse echo functionality.

import { z } from "zod";

export const name = 'echo';

export const definition = {
  title: "Echo Tool",
  description: "Echoes the message back to the client.",
  
  inputSchema: {
    message: z.string().describe("The message to echo back"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'echo' tool executed with args:`, args);
    const { message } = args;
    
    return {
      content: [
        {
          type: "text",
          text: `Hello from Node.js: ${message}`,
        },
      ],
    };
  },
};