// This file defines the button press tool.
// Handles user requests to press colored buttons.

import { z } from "zod";

export const name = 'press_button';

export const definition = {
  title: "Press Button Tool",
  description: "Handles pressing colored buttons (red, blue, green, yellow, purple, orange) when user asks to press or click them.",
  
  inputSchema: {
    color: z.string().describe("The color of the button to press (red, blue, green, yellow, purple, orange)"),
    action: z.string().optional().describe("The action performed (press, click, push, etc.)"),
  },
  
  handler: async (args) => {
    console.log(`[MCP] 'press_button' tool executed with args:`, args);
    const { color, action = "press" } = args;
    
    const validColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const normalizedColor = color.toLowerCase().trim();
    
    if (!validColors.includes(normalizedColor)) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Invalid button color "${color}". Available colors: ${validColors.join(', ')}`,
          },
        ],
      };
    }
    
    // Different responses for different colors
    const buttonResponses = {
      red: "🔴 RED BUTTON PRESSED! 🚨 Alert mode activated! Something exciting might happen!",
      blue: "🔵 BLUE BUTTON PRESSED! 🌊 Calm and cool vibes activated! All systems normal.",
      green: "🟢 GREEN BUTTON PRESSED! ✅ Go signal activated! Everything is good to go!",
      yellow: "🟡 YELLOW BUTTON PRESSED! ⚠️ Caution mode activated! Please proceed carefully.",
      purple: "🟣 PURPLE BUTTON PRESSED! ✨ Mysterious magical powers activated! Something special is happening!",
      orange: "🟠 ORANGE BUTTON PRESSED! 🔥 Energy boost activated! Feeling energized and ready for action!"
    };
    
    const response = buttonResponses[normalizedColor] || `${normalizedColor.toUpperCase()} BUTTON PRESSED!`;
    
    return {
      content: [
        {
          type: "text",
          text: `${response}\n\n*Button press registered successfully!*`,
        },
      ],
    };
  },
};