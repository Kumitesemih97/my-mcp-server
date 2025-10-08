// This file defines the reverse echo tool.
// Echoes the message in reverse.

import { z } from "zod";

export const name = 'reverse_echo';

export const definition = {
  title: "Reverse Echo Tool",
  description: "Echoes in reverse the message sent.",
  
  inputSchema: {
    message: z.string().describe("The message to echo in reverse"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'reverse_echo' tool executed with args:`, args);
    const { message } = args;
    
    const reversedMessage = message.split('').reverse().join('');
    
    return {
      content: [
        {
          type: "text",
          text: reversedMessage,
        },
      ],
    };
  },
};