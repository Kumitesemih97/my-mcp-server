// This file defines file writing tool.

import { z } from "zod";
import fs from "fs/promises";
import { statSync } from "fs";

export const name = 'write_file';

export const definition = {
  title: "Write File",
  description: "Writes content to a text file. Creates file if it doesn't exist.",
  
  inputSchema: {
    filePath: z.string().describe("The absolute or relative path to the file to write"),
    content: z.string().describe("The content to write to the file"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'write_file' tool executed with args:`, args);
    const { filePath, content } = args;
    
    try {
      await fs.writeFile(filePath, content, 'utf8');
      const stats = statSync(filePath);
      
      const result = {
        success: true,
        path: filePath,
        message: "File written successfully",
        size: stats.size
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
      console.error("[MCP] Write file error:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message, path: filePath }, null, 2),
          },
        ],
      };
    }
  },
};