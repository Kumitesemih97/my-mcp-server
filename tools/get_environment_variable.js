// This file defines environment variable tools.

import { z } from "zod";

export const name = 'get_environment_variable';

export const definition = {
  title: "Get Environment Variable",
  description: "Gets environment variable value.",
  
  inputSchema: {
    variableName: z.string().describe("The name of the environment variable to retrieve"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'get_environment_variable' tool executed with args:`, args);
    const { variableName } = args;
    
    try {
      const value = process.env[variableName];
      
      const result = {
        variable: variableName,
        value: value || "Not found",
        exists: value !== undefined
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
      console.error("[MCP] Get environment variable error:", error);
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