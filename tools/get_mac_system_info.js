// This file defines macOS-specific system information tool.

import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export const name = 'get_mac_system_info';

export const definition = {
  title: "macOS System Info",
  description: "Returns detailed macOS system info including CPU, RAM, OS version, architecture, and uptime.",
  
  inputSchema: {
    // No input required
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'get_mac_system_info' tool executed with args:`, args);
    
    if (os.platform() !== 'darwin') {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "This tool is intended for macOS only." }, null, 2),
          },
        ],
      };
    }
    
    try {
      // Get macOS version
      const { stdout: osVersion } = await execAsync("sw_vers -productVersion");
      
      // Get CPU info
      const { stdout: cpuBrand } = await execAsync("sysctl -n machdep.cpu.brand_string");
      const { stdout: cpuCores } = await execAsync("sysctl -n hw.ncpu");
      
      // Get RAM info
      const { stdout: memBytesStr } = await execAsync("sysctl -n hw.memsize");
      const memGB = Math.round(parseInt(memBytesStr.trim()) / (1024 * 1024 * 1024) * 100) / 100;
      
      // Get architecture
      const { stdout: arch } = await execAsync("uname -m");
      
      // Get uptime
      const { stdout: uptimeStr } = await execAsync("uptime");
      
      const macInfo = {
        OS: `macOS ${osVersion.trim()}`,
        CPU: cpuBrand.trim(),
        CPU_Cores: cpuCores.trim(),
        Architecture: arch.trim(),
        RAM_GB: memGB,
        Uptime: uptimeStr.trim()
      };
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(macInfo, null, 2),
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] Mac system info error:", error);
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