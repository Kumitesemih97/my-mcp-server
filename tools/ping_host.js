// This file defines network ping tool.

import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const name = 'ping_host';

export const definition = {
  title: "Ping Host",
  description: "Pings a host and returns response time and status.",
  
  inputSchema: {
    hostname: z.string().describe("The hostname or IP address to ping"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'ping_host' tool executed with args:`, args);
    const { hostname } = args;
    
    try {
      let command;
      if (process.platform === 'win32') {
        command = `ping -n 4 ${hostname}`;
      } else {
        command = `ping -c 4 ${hostname}`;
      }
      
      const { stdout } = await execAsync(command);
      
      // Extract basic info from ping output
      const lines = stdout.split('\n');
      const successful = !stdout.toLowerCase().includes('unreachable') && 
                        !stdout.toLowerCase().includes('request timeout') &&
                        !stdout.toLowerCase().includes('unknown host');
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ 
              hostname,
              success: successful,
              output: stdout.trim()
            }, null, 2),
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] Ping host error:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ 
              hostname,
              success: false,
              error: error.message 
            }, null, 2),
          },
        ],
      };
    }
  },
};