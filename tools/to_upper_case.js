// This file defines text manipulation tools.
// Various string operations like uppercase, lowercase, reverse, leet speak.

import { z } from "zod";

export const name = 'to_upper_case';

export const definition = {
  title: "To Upper Case",
  description: "Returns the input string in uppercase.",
  
  inputSchema: {
    input: z.string().describe("The text to convert to uppercase"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'to_upper_case' tool executed with args:`, args);
    const { input } = args;
    
    return {
      content: [
        {
          type: "text",
          text: input.toUpperCase(),
        },
      ],
    };
  },
};