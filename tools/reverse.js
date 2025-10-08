// This file defines the reverse string tool.

import { z } from "zod";

export const name = 'reverse';

export const definition = {
  title: "Reverse String",
  description: "Returns the input string reversed.",
  
  inputSchema: {
    input: z.string().describe("The text to reverse"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'reverse' tool executed with args:`, args);
    const { input } = args;
    
    return {
      content: [
        {
          type: "text",
          text: input.split('').reverse().join(''),
        },
      ],
    };
  },
};