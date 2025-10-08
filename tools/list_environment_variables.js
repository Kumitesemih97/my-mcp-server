// This file defines environment variables listing tool.

import { z } from "zod";

export const name = 'list_environment_variables';

export const definition = {
  title: "List Environment Variables",
  description: "Lists all environment variables (keys only for security).",
  
  inputSchema: {
    // No input required
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'list_environment_variables' tool executed with args:`, args);
    
    try {
      const keys = Object.keys(process.env).sort();
      
      const result = {
        count: keys.length,
        variables: keys
      };
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] List environment variables error:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message }, null, 2),
          },
        ],
      };
    }
  },
};