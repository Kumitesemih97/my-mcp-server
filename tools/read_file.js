// This file defines file reading tool.

import { z } from "zod";
import fs from "fs/promises";
import { existsSync, statSync } from "fs";

export const name = 'read_file';

export const definition = {
  title: "Read File",
  description: "Reads content from a text file. Returns file content or error message.",
  
  inputSchema: {
    filePath: z.string().describe("The absolute or relative path to the file to read"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'read_file' tool executed with args:`, args);
    const { filePath } = args;
    
    try {
      if (!existsSync(filePath)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "File not found", path: filePath }, null, 2),
            },
          ],
        };
      }
      
      const content = await fs.readFile(filePath, 'utf8');
      const stats = statSync(filePath);
      
      const result = {
        success: true,
        path: filePath,
        content: content,
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
      console.error("[MCP] Read file error:", error);
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