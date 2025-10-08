// This file defines process information tool.

import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const name = 'get_process_info';

export const definition = {
  title: "Get Process Info",
  description: "Gets detailed information about a specific process by ID.",
  
  inputSchema: {
    processId: z.number().describe("The process ID to get information about"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'get_process_info' tool executed with args:`, args);
    const { processId } = args;
    
    try {
      let command;
      if (process.platform === 'darwin' || process.platform === 'linux') {
        // macOS and Linux
        command = `ps -p ${processId} -o pid,comm,pmem,rss,time,etime`;
      } else if (process.platform === 'win32') {
        // Windows
        command = `tasklist /fi "PID eq ${processId}" /fo csv`;
      } else {
        throw new Error("Unsupported platform");
      }
      
      const { stdout } = await execAsync(command);
      
      if (!stdout.trim()) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Process not found", processId }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ 
              processId,
              platform: process.platform,
              processInfo: stdout.trim()
            }, null, 2),
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] Get process info error:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message, processId }, null, 2),
          },
        ],
      };
    }
  },
};