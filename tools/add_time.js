// This file defines the time addition tool.

import { z } from "zod";

export const name = 'add_time';

export const definition = {
  title: "Add Time",
  description: "Adds hours and minutes to current time. Format: '2h 30m'.",
  
  inputSchema: {
    offset: z.string().describe("Time offset to add (e.g., '2h 30m', '1h', '45m')"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'add_time' tool executed with args:`, args);
    const { offset } = args;
    
    const now = new Date();
    let hours = 0;
    let minutes = 0;
    
    // Parse hours
    const hoursMatch = offset.match(/(\d+)h/);
    if (hoursMatch) {
      hours = parseInt(hoursMatch[1], 10);
    }
    
    // Parse minutes
    const minutesMatch = offset.match(/(\d+)m/);
    if (minutesMatch) {
      minutes = parseInt(minutesMatch[1], 10);
    }
    
    const newTime = new Date(now.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000));
    
    return {
      content: [
        {
          type: "text",
          text: newTime.toISOString(),
        },
      ],
    };
  },
};