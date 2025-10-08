// This file defines network interfaces tool.

import { z } from "zod";
import os from "os";

export const name = 'get_network_interfaces';

export const definition = {
  title: "Get Network Interfaces",
  description: "Gets network interface information.",
  
  inputSchema: {
    // No input required
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'get_network_interfaces' tool executed with args:`, args);
    
    try {
      const interfaces = os.networkInterfaces();
      const result = [];
      
      for (const [name, details] of Object.entries(interfaces)) {
        if (details) {
          const addresses = details
            .filter(detail => !detail.internal) // Filter out internal interfaces
            .map(detail => ({
              address: detail.address,
              family: detail.family,
              netmask: detail.netmask,
              mac: detail.mac
            }));
          
          if (addresses.length > 0) {
            result.push({
              name,
              addresses
            });
          }
        }
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ interfaces: result }, null, 2),
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] Get network interfaces error:", error);
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