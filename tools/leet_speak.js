// This file defines the leet speak conversion tool.

import { z } from "zod";

export const name = 'leet_speak';

export const definition = {
  title: "Leet Speak Converter",
  description: "Converts input text into 'leet speak'.",
  
  inputSchema: {
    input: z.string().describe("The text to convert to leet speak"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'leet_speak' tool executed with args:`, args);
    const { input } = args;
    
    const leetText = input
      .replace(/[aA]/g, '4')
      .replace(/[eE]/g, '3')
      .replace(/[iI]/g, '1')
      .replace(/[oO]/g, '0')
      .replace(/[sS]/g, '5');
    
    return {
      content: [
        {
          type: "text",
          text: leetText,
        },
      ],
    };
  },
};