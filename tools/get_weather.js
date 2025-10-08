// This file defines weather information tool.

import { z } from "zod";

export const name = 'get_weather';

export const definition = {
  title: "Get Weather",
  description: "Gets weather information for a city (uses OpenWeatherMap - requires API key in env var OPENWEATHER_API_KEY).",
  
  inputSchema: {
    city: z.string().describe("The city name to get weather information for"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'get_weather' tool executed with args:`, args);
    const { city } = args;
    
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ 
                error: "OPENWEATHER_API_KEY environment variable not set" 
              }, null, 2),
            },
          ],
        };
      }
      
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      
      const weather = await response.json();
      
      const result = {
        city: weather.name,
        country: weather.sys.country,
        temperature: weather.main.temp,
        description: weather.weather[0].description,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind?.speed || 0,
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
      
    } catch (error) {
      console.error("[MCP] Get weather error:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message, city }, null, 2),
          },
        ],
      };
    }
  },
};