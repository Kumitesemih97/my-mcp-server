// This file defines basic system information tool.

import { z } from "zod";
import os from "os";

export const name = 'system_info';

export const definition = {
  title: "System Information",
  description: "Returns basic system information (CPU count, OS, uptime).",
  
  inputSchema: {
    // No input required
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'system_info' tool executed with args:`, args);
    
    const uptimeSeconds = os.uptime();
    const uptimeDays = Math.floor(uptimeSeconds / (24 * 60 * 60));
    const uptimeHours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
    const uptimeMinutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
    
    const systemInfo = {
      OS: `${os.type()} ${os.release()}`,
      CPU_Cores: os.cpus().length,
      Architecture: os.arch(),
      Platform: os.platform(),
      Uptime: `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`,
      Total_Memory_GB: Math.round(os.totalmem() / (1024 * 1024 * 1024) * 100) / 100,
      Free_Memory_GB: Math.round(os.freemem() / (1024 * 1024 * 1024) * 100) / 100
    };
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(systemInfo, null, 2),
        },
      ],
    };
  },
};