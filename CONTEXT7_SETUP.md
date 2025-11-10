# Context7 MCP Setup for Claude Code

## Overview
Context7 is an MCP (Model Context Protocol) server that provides Claude Code with up-to-date, version-specific documentation for libraries and frameworks. This eliminates issues with outdated training data and ensures you get current, accurate code examples.

## What Context7 Provides
- Real-time library documentation
- Version-specific API references
- Current code examples
- Helps avoid deprecated APIs and breaking changes

## Installation Status
✅ Context7 MCP server is installed and working
✅ Configuration file created: `claude-mcp-config.json`

## Setup Instructions

### Step 1: Locate Your Claude Code Configuration

Claude Code stores MCP server configurations in one of these locations depending on your setup:

**Windows:**
- `%APPDATA%\Claude\mcp.json`
- `%LOCALAPPDATA%\Claude\mcp.json`
- `%USERPROFILE%\.config\claude-code\mcp.json`

**To find it manually:**
1. Open Claude Code
2. Go to Settings (gear icon or `Ctrl+,`)
3. Search for "MCP" or "Model Context Protocol"
4. Look for "MCP Servers Configuration" - it should show the file path

### Step 2: Add Context7 Configuration

If the MCP configuration file exists, add the Context7 server to it.

**If the file already has content:**
```json
{
  "mcpServers": {
    "existing-server": {
      ...existing config...
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-4e49e83f-747a-4141-a60b-5cdd58cdad70"
      }
    }
  }
}
```

**If the file doesn't exist or is empty:**
Use the configuration file I created at:
`C:\Users\andyw\OneDrive\Desktop\product-description-builder\claude-mcp-config.json`

Copy its contents to your Claude Code MCP configuration file.

### Step 3: Restart Claude Code

After adding the configuration:
1. Save the configuration file
2. Completely quit Claude Code (not just close the window)
3. Restart Claude Code

### Step 4: Verify Context7 is Working

After restart, Context7 should be active. Test it by asking Claude Code:

**Example prompts to try:**
- "What's the latest syntax for Express v5 middleware?"
- "Show me how to use React Router v6"
- "How do I use Mongoose schema validation in the latest version?"

Claude Code will now fetch current documentation from Context7 to answer these questions accurately.

## How It Works

When you ask about a library:
1. Claude Code recognizes the library mention
2. Calls Context7 MCP server via your API key
3. Context7 fetches current documentation from the library's source
4. Claude Code uses this up-to-date info to generate accurate code

## Benefits for Your Project

This integration would have helped us avoid issues like:
- ✅ Express v5 wildcard route breaking change (`app.get('*')` → `app.use()`)
- ✅ Node.js version compatibility with Vite v7
- ✅ Package dependency conflicts

## API Key Information

Your Context7 API Key: `ctx7sk-4e49e83f-747a-4141-a60b-5cdd58cdad70`

This key provides:
- Higher rate limits than free tier
- Access to private repository documentation (if configured)
- Priority API access

## Troubleshooting

**Context7 not appearing in Claude Code:**
1. Check that the config file path is correct
2. Verify JSON syntax is valid (no trailing commas, proper brackets)
3. Ensure Claude Code was fully restarted
4. Check Claude Code logs for MCP server errors

**"Command not found" errors:**
- Ensure Node.js and npx are installed and in your PATH
- Try running `npx -y @upstash/context7-mcp` manually to test

**API key issues:**
- Verify the API key in the configuration matches: `ctx7sk-4e49e83f-747a-4141-a60b-5cdd58cdad70`
- Check https://context7.com for API key status

## Testing Context7

Once set up, you can test by asking me questions about current library versions:

**Try asking:**
> "Claude, using Context7, show me the latest Express v5 routing best practices"

> "What's the current syntax for Next.js 14 App Router?"

I'll fetch real-time documentation and provide accurate, current answers!

## Resources

- Context7 GitHub: https://github.com/upstash/context7
- Context7 Website: https://context7.com
- MCP Protocol: https://modelcontextprotocol.io

## Next Steps

1. Find your Claude Code MCP configuration file location
2. Add the Context7 configuration from `claude-mcp-config.json`
3. Restart Claude Code
4. Test with library-specific questions

Let me know if you encounter any issues during setup!
