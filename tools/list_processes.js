// This file defines process listing tool.

import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const name = 'list_processes';

export const definition = {
  title: "List Processes",
  description: "Lists running processes with basic information.",
  
  inputSchema: {
    // No input required
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'list_processes' tool executed with args:`, args);
    
    try {
      let command;
      if (process.platform === 'darwin' || process.platform === 'linux') {
        // macOS and Linux
        command = "ps -eo pid,comm,pmem,rss --sort=-rss | head -21";
      } else if (process.platform === 'win32') {
        // Windows
        command = 'tasklist /fo csv | findstr /v "Image Name" | head -20';
      } else {
        throw new Error("Unsupported platform");
      }
      
      const { stdout } = await execAsync(command);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ 
              platform: process.platform,
              processes: stdout.trim()
            }, null, 2),
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] List processes error:", error);
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