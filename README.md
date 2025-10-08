# 🤖 My MCP Server: Your Personal AI Assistant

Welcome to your own personal AI assistant, running right on your machine! This project gives you a powerful, chat-based interface to an AI that can:

- **Control your computer** with simple commands.
- **Fetch real-time data** like weather and flight information.
- **Run 100% locally** using Ollama and Llama 3.2, so your data stays private.

Ready to give it a try? Let's get you set up!

---

## 🚀 Setup in 3 Easy Steps

Follow these steps to get your AI assistant up and running in minutes.

### Step 1: Install Ollama & Your AI Model

First, you need to install Ollama and download the AI model that will be the "brain" of your assistant.

- **On macOS or Linux:**
  Open your terminal and run this command to install Ollama:
  
  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```

- **On Windows:**
  Download and run the installer from the [**Ollama website**](https://ollama.com).

After installing, run this command in your terminal to download the Llama 3.2 model:

```bash
ollama pull llama3.2:3b
```

### Step 2: Download & Install the Project

Now, let's get the server code.

```bash
# Clone the project repository
git clone https://github.com/your-username/my-mcp-server.git

# Navigate into the project directory
cd my-mcp-server

# Install all the necessary dependencies
npm install
```
> **Note:** If you don't have Git, you can download the project as a ZIP file and unzip it.

### Step 3: Start Your AI Assistant

You're all set! Start the server with this command:

```bash
npm start
```

Now, open your web browser and go to **[http://localhost:3000](http://localhost:3000)** to start chatting with your new AI assistant!

---

## (Optional) Add API Keys for More Power

Some tools use external services and require an API key.

- **Weather Tool**: To get real-time weather data, you'll need a free API key from [OpenWeatherMap](https://openweathermap.org/api).
  Once you have your key, set it as an environment variable before starting the server:

  **On macOS/Linux:**
  
  ```bash
  export OPENWEATHER_API_KEY="your_api_key_here"
  npm start
  ```

  **On Windows (Command Prompt):**
  
  ```cmd
  set OPENWEATHER_API_KEY="your_api_key_here"
  npm start
  ```

Enjoy exploring the superpowers of your new AI assistant!