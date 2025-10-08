const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// This will store the conversation history
const messages = [];

// Tool categories and their associated tools
const toolCategories = {
    text: {
        name: "Text Manipulation Tools",
        tools: ["echo", "reverse_echo", "to_upper_case", "to_lower_case", "reverse", "leet_speak"],
        examples: [
            "Convert 'Hello World' to uppercase",
            "Convert 'HELLO' to lowercase", 
            "Reverse the text 'OpenAI'",
            "Convert 'Hello' to leet speak",
            "Echo back 'Testing 123'"
        ]
    },
    time: {
        name: "Time & Date Tools",
        tools: ["current_time", "add_time"],
        examples: [
            "What's the current time?",
            "Add 2 hours and 30 minutes to current time",
            "Show me the current time in ISO format"
        ]
    },
    system: {
        name: "System Information Tools",
        tools: ["system_info", "get_mac_system_info"],
        examples: [
            "Show system information",
            "Get detailed macOS system info",
            "What are my system specs?",
            "How much RAM do I have?"
        ]
    },
    file: {
        name: "File System Tools", 
        tools: ["read_file", "write_file", "list_directory"],
        examples: [
            "Read the file /path/to/file.txt",
            "Write 'Hello World' to /path/to/output.txt",
            "List files in the current directory",
            "Show contents of /Users folder"
        ]
    },
    process: {
        name: "Process Management Tools",
        tools: ["list_processes", "get_process_info"],
        examples: [
            "Show running processes",
            "Get info about process ID 1234",
            "List top processes by memory usage"
        ]
    },
    network: {
        name: "Network Tools",
        tools: ["ping_host", "get_network_interfaces"],
        examples: [
            "Ping google.com",
            "Check if github.com is reachable", 
            "Show network interfaces",
            "Get network configuration"
        ]
    },
    config: {
        name: "Configuration & Environment Tools",
        tools: ["get_environment_variable", "list_environment_variables"],
        examples: [
            "Get the PATH environment variable",
            "List all environment variables",
            "Show the HOME directory path"
        ]
    },
    external: {
        name: "External APIs & Services",
        tools: ["get_flight_info", "open_website", "get_weather", "execute_query"],
        examples: [
            "Get flight info for UAL123",
            "Open google.com in browser",
            "Get weather for New York",
            "Find flight information for ANA204",
            "Launch chatgpt.com"
        ]
    },
    interactive: {
        name: "Interactive Button Tools",
        tools: ["press_button"],
        examples: [
            "Press red button",
            "Click blue button",
            "Press green button",
            "Click yellow button",
            "Press purple button",
            "Click orange button"
        ]
    }
};

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Check for button press commands
    const buttonMatch = userMessage.toLowerCase().match(/(?:press|click)\s+(red|blue|green|yellow|purple|orange)\s+button/);
    if (buttonMatch) {
        const color = buttonMatch[1];
        userInput.value = '';
        handleButtonPress(color);
        return;
    }

    // Add user message to UI and history
    addMessageToUI(userMessage, 'user');
    messages.push({ role: 'user', content: userMessage });
    
    userInput.value = '';

    // Show suggested tools based on user input
    suggestToolsBasedOnInput(userMessage);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botMessage = data.message;
        
        // Add bot response to UI and history
        addMessageToUI(botMessage, 'bot');
        messages.push({ role: 'assistant', content: botMessage });

    } catch (error) {
        console.error('Error:', error);
        addMessageToUI('Sorry, something went wrong.', 'bot');
    }
});

function addMessageToUI(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

function showToolSuggestion(category) {
    const suggestionBox = document.getElementById('suggestion-box');
    const categoryData = toolCategories[category];
    
    if (!categoryData) return;
    
    const html = `
        <h4>🔧 ${categoryData.name}</h4>
        <p><strong>Available Tools:</strong> ${categoryData.tools.join(', ')}</p>
        <p><strong>Example Prompts:</strong></p>
        <ul>
            ${categoryData.examples.map(example => `<li>"${example}"</li>`).join('')}
        </ul>
    `;
    
    suggestionBox.innerHTML = html;
    suggestionBox.classList.add('show');
}

function suggestToolsBasedOnInput(input) {
    const lowerInput = input.toLowerCase();
    const suggestionBox = document.getElementById('suggestion-box');
    
    // Keywords that might indicate which tools to use
    const keywords = {
        text: ['convert', 'uppercase', 'lowercase', 'reverse', 'leet', 'echo'],
        time: ['time', 'date', 'add time', 'current time', 'clock'],
        system: ['system', 'info', 'specs', 'memory', 'cpu', 'mac', 'computer'],
        file: ['file', 'read', 'write', 'directory', 'folder', 'list files'],
        process: ['process', 'running', 'task', 'memory usage', 'pid'],
        network: ['ping', 'network', 'internet', 'connection', 'interface'],
        config: ['environment', 'variable', 'config', 'path', 'env'],
        external: ['flight', 'weather', 'website', 'browser', 'open', 'launch'],
        interactive: ['press', 'click', 'button', 'red', 'blue', 'green', 'yellow', 'purple', 'orange']
    };
    
    // Find matching categories
    const matches = [];
    for (const [category, keywordList] of Object.entries(keywords)) {
        if (keywordList.some(keyword => lowerInput.includes(keyword))) {
            matches.push(category);
        }
    }
    
    if (matches.length > 0) {
        const category = matches[0]; // Take first match
        const categoryData = toolCategories[category];
        
        const html = `
            <h4>💡 Detected: ${categoryData.name}</h4>
            <p><strong>Relevant Tools:</strong> ${categoryData.tools.join(', ')}</p>
            <p><em>The AI will automatically use the appropriate tools for your request.</em></p>
        `;
        
        suggestionBox.innerHTML = html;
        suggestionBox.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            suggestionBox.classList.remove('show');
        }, 5000);
    }
}

function handleButtonPress(color) {
    // Update button status display
    const statusElement = document.getElementById('button-status');
    statusElement.textContent = `${color.toUpperCase()} button pressed!`;
    
    // Add visual feedback
    statusElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
        statusElement.style.transform = 'scale(1)';
    }, 200);
    
    // Add user message to UI
    addMessageToUI(`Press ${color} button`, 'user');
    messages.push({ role: 'user', content: `Press ${color} button` });
    
    // Send request to server with press_button tool
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            messages: [{ role: 'user', content: `Press ${color} button` }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const botMessage = data.message || `${color} button pressed successfully!`;
        addMessageToUI(botMessage, 'bot');
        messages.push({ role: 'assistant', content: botMessage });
    })
    .catch(error => {
        console.error('Error:', error);
        addMessageToUI('Error processing button press', 'bot');
    });
}

// Initialize colored buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up colored button event listeners
    const coloredButtons = document.querySelectorAll('.interactive-btn');
    coloredButtons.forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            handleButtonPress(color);
        });
    });
    
    // Initialize status
    const statusElement = document.getElementById('button-status');
    if (statusElement) {
        statusElement.textContent = 'Click any colored button or type "press [color] button"';
    }
});