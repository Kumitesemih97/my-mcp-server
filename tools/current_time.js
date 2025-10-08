// This file defines time-related tools.

import { z } from "zod";

export const name = 'current_time';

export const definition = {
  title: "Current Time",
  description: "Returns current system time in ISO8601 format.",
  
  inputSchema: {
    // No input required
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'current_time' tool executed with args:`, args);
    
    return {
      content: [
        {
          type: "text",
          text: new Date().toISOString(),
        },
      ],
    };
  },
};