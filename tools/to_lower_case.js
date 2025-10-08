// This file defines the lowercase conversion tool.

import { z } from "zod";

export const name = 'to_lower_case';

export const definition = {
  title: "To Lower Case",
  description: "Returns the input string in lowercase.",
  
  inputSchema: {
    input: z.string().describe("The text to convert to lowercase"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'to_lower_case' tool executed with args:`, args);
    const { input } = args;
    
    return {
      content: [
        {
          type: "text",
          text: input.toLowerCase(),
        },
      ],
    };
  },
};