// This file defines the 'get_flight_info' tool.
// Gets real-time flight info from OpenSky by callsign or icao24.

import { z } from "zod";

export const name = 'get_flight_info';

export const definition = {
  title: "Flight Info Tool",
  description: "Gets real-time flight info from OpenSky by callsign or icao24. Returns JSON.",
  
  // The arguments the tool accepts, defined as a Zod schema
  inputSchema: {
    idOrCallsign: z.string().describe("The flight callsign or ICAO24 identifier (e.g., 'UAL123' or '4b1234')"),
  },
  
  // The function that gets executed when the tool is called
  handler: async (args) => {
    console.log(`[MCP] 'get_flight_info' tool executed with args:`, args);
    
    const { idOrCallsign } = args;
    
    if (!idOrCallsign || idOrCallsign.trim() === '') {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "idOrCallsign cannot be empty" }, null, 2),
          },
        ],
      };
    }
    
    try {
      const response = await fetch("https://opensky-network.org/api/states/all", {
        headers: {
          "User-Agent": "MCP-FlightTool/1.0"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.states || !Array.isArray(data.states)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "No flight data available" }, null, 2),
            },
          ],
        };
      }
      
      // Search for the flight by ICAO24 or callsign
      for (const state of data.states) {
        const icao24 = state[0];
        const callsign = state[1]?.trim();
        
        const normalizedInput = idOrCallsign.replace(/\s+/g, '').toLowerCase();
        const normalizedCallsign = callsign?.replace(/\s+/g, '').toLowerCase();
        const normalizedIcao24 = icao24?.toLowerCase();
        
        if (normalizedIcao24 === normalizedInput || 
            (normalizedCallsign && normalizedCallsign === normalizedInput)) {
          
          const result = {
            source: "opensky",
            icao24: icao24,
            callsign: callsign,
            origin_country: state[2],
            longitude: state[5],
            latitude: state[6],
            altitude: state[7],
            on_ground: state[8],
            velocity: state[9],
            fetchedAt: new Date().toISOString()
          };
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
      }
      
      // Flight not found
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ 
              error: "flight not found", 
              queried: idOrCallsign 
            }, null, 2),
          },
        ],
      };
      
    } catch (error) {
      console.error("[MCP] Flight info error:", error);
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