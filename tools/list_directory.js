// This file defines directory listing tool.

import { z } from "zod";
import fs from "fs/promises";
import { existsSync, statSync } from "fs";
import path from "path";

export const name = 'list_directory';

export const definition = {
  title: "List Directory",
  description: "Lists files and directories in the specified path.",
  
  inputSchema: {
    directoryPath: z.string().describe("The path to the directory to list"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'list_directory' tool executed with args:`, args);
    const { directoryPath } = args;
    
    try {
      if (!existsSync(directoryPath)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Directory not found", path: directoryPath }, null, 2),
            },
          ],
        };
      }
      
      const items = await fs.readdir(directoryPath);
      const itemDetails = items.map(item => {
        const fullPath = path.join(directoryPath, item);
        const stats = statSync(fullPath);
        
        return {
          name: item,
          type: stats.isDirectory() ? "directory" : "file",
          size: stats.isFile() ? stats.size : 0,
          modified: stats.mtime.toISOString()
        };
      });
      
      const result = {
        path: directoryPath,
        items: itemDetails
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
      console.error("[MCP] List directory error:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message, path: directoryPath }, null, 2),
          },
        ],
      };
    }
  },
};