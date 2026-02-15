# @ai-bubble/exa-cli

A powerful CLI tool for the [Exa AI](https://exa.ai) search API. Query the web with semantic search, extract content, get AI-powered answers, and conduct automated research - all from your terminal.

## Features

- 🔍 **Semantic Search** - Find relevant content using meaning, not just keywords
- 📝 **Content Extraction** - Retrieve full text, highlights, and summaries from URLs
- 🤖 **AI Answers** - Get AI-generated answers with source citations
- 🔗 **Similar Pages** - Find pages similar to any URL
- 🔬 **Research Tasks** - Automated deep research with configurable models
- 📊 **Multiple Output Formats** - Beautiful markdown or raw JSON
- 🚀 **Zero Dependencies** - Uses the official `exa-js` SDK, everything else is built-in

## Installation

```bash
# Install globally via npm
npm install -g @ai-bubble/exa-cli

# Or use with npx (no installation)
npx @ai-bubble/exa-cli search "AI startups"

# Or install with Bun
bun install @ai-bubble/exa-cli

# Or compile to standalone binary
bun run build
./exa search "test query"
```

## Configuration

### API Key

Set your Exa API key as an environment variable:

```bash
export EXA_API_KEY="your-api-key-here"
```

Or pass it with each command:

```bash
exa search "AI startups" --api-key "your-api-key-here"
```

Get your API key at [https://dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys)

### Output Format

By default, output is formatted as markdown. Use `--json` for raw API responses:

```bash
# Markdown output (default)
exa search "AI news"

# JSON output for scripting
exa search "AI news" --json
```

## Commands

### `search <query>`

Search the web using Exa's semantic search.

**Usage:**
```bash
exa search "latest developments in quantum computing"
```

**Arguments:**
- `query` (required) - Your search query string

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--num-results <n>` | Number of results to return (max: 10 on basic plans) | 10 |
| `--type <auto\|fast\|deep\|instant>` | Search type: auto (default), fast, deep, or instant | auto |
| `--category <category>` | Filter by category: company, research paper, news, pdf, tweet, personal site, financial report, people | - |
| `--text` | Include full text content of each result | false |
| `--highlights` | Include relevant text highlights | false |
| `--summary` | Include AI-generated summary | false |
| `--include-domains <list>` | Comma-separated list of domains to include (e.g., "example.com,test.com") | - |
| `--exclude-domains <list>` | Comma-separated list of domains to exclude | - |
| `--start-date <date>` | Start date for published content (ISO 8601 format) | - |
| `--end-date <date>` | End date for published content (ISO 8601 format) | - |
| `--autoprompt` | Use autoprompt to enhance your query | false |

**Examples:**

```bash
# Basic search
exa search "AI startups"

# Search with content extraction
exa search "hottest AI startups 2024" --num-results 5 --text

# Deep search with highlights
exa search "latest machine learning papers" --type deep --highlights --summary

# Filter by category and date
exa search "AI acquisitions" --category news --start-date 2024-01-01

# Include/exclude domains
exa search "AI research" --include-domains "arxiv.org,openai.com" --exclude-domains "reddit.com"

# Use autoprompt for better results
exa search "find companies building autonomous vehicles" --autoprompt
```

---

### `contents <url...>`

Retrieve contents (text, highlights, summaries) from specific URLs.

**Usage:**
```bash
exa contents "https://example.com/article"
```

**Arguments:**
- `url...` (required) - One or more URLs to retrieve content from

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--text` | Include full text content | false |
| `--highlights` | Include text highlights | false |
| `--summary` | Include AI-generated summary | false |
| `--max-age-hours <n>` | Maximum age of cached content in hours | - |

**Examples:**

```bash
# Get text from single URL
exa contents "https://arxiv.org/abs/2304.15004" --text

# Get highlights and summary from multiple URLs
exa contents "https://example.com/1" "https://example.com/2" --highlights --summary

# Force fresh content fetch
exa contents "https://example.com/article" --text --max-age-hours 0
```

---

### `similar <url>`

Find web pages similar to a given URL.

**Usage:**
```bash
exa similar "https://example.com/article"
```

**Arguments:**
- `url` (required) - The URL to find similar pages for

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--num-results <n>` | Number of similar results to return | 10 |
| `--exclude-source-domain` | Exclude pages from the same domain as the source | false |
| `--category <category>` | Filter by category (same as search) | - |
| `--text` | Include full text content | false |
| `--highlights` | Include text highlights | false |
| `--summary` | Include AI-generated summary | false |

**Examples:**

```bash
# Find similar pages
exa similar "https://openai.com/research/gpt-4"

# Exclude source domain
exa similar "https://techcrunch.com/article" --exclude-source-domain

# Get similar content with text
exa similar "https://example.com/blog-post" --num-results 5 --text
```

---

### `answer <query>`

Get AI-powered answers with source citations.

**Usage:**
```bash
exa answer "What is quantum computing?"
```

**Arguments:**
- `query` (required) - Your question or query

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--text` | Include source text in citations | false |
| `--model <exa\|exa-pro>` | Model to use for answer generation | exa |
| `--stream` | Stream the response in real-time | false |
| `--system-prompt <text>` | Custom system prompt to guide answer generation | - |

**Examples:**

```bash
# Basic answer
exa answer "What is quantum computing?"

# Stream the answer
exa answer "Explain neural networks" --stream

# Use pro model for complex queries
exa answer "Compare different transformer architectures" --model exa-pro

# Custom system prompt
exa answer "Explain recursion" --system-prompt "You are explaining to a 5-year-old"
```

---

### `research <instructions>`

Create an automated research task that performs deep research on a topic.

**Usage:**
```bash
exa research "Research the latest developments in fusion energy"
```

**Arguments:**
- `instructions` (required) - Research instructions or question

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--model <fast\|regular\|pro>` | Research model: fast (exa-research-fast), regular (exa-research), pro (exa-research-pro) | exa-research |
| `--poll` | Poll until research is complete | false |
| `--poll-interval <ms>` | Polling interval in milliseconds | 1000 |
| `--timeout <ms>` | Timeout for polling in milliseconds | 600000 (10 min) |

**Examples:**

```bash
# Create research task
exa research "Find the latest SpaceX valuation and recent funding rounds"

# Create and poll for results
exa research "Analyze the impact of LLMs on software engineering" --poll

# Use pro model with custom polling
exa research "Comprehensive analysis of CRISPR applications" --model pro --poll --poll-interval 2000
```

---

### `research-status <task-id>`

Check the status and results of a research task.

**Usage:**
```bash
exa research-status "abc123-def456"
```

**Arguments:**
- `task-id` (required) - The research task ID

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--json` | Output raw JSON | false |

**Examples:**

```bash
# Check task status
exa research-status "task-123-abc"

# Get raw JSON output
exa research-status "task-123-abc" --json
```

---

### `research-list`

List all research tasks.

**Usage:**
```bash
exa research-list
```

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--limit <n>` | Number of tasks to list | - |
| `--cursor <token>` | Pagination cursor for next page | - |
| `--json` | Output raw JSON | false |

**Examples:**

```bash
# List all tasks
exa research-list

# List with pagination
exa research-list --limit 10

# Get next page
exa research-list --limit 10 --cursor "eyJ..."
```

---

## Global Options

These options work with any command:

| Flag | Description |
|------|-------------|
| `--api-key <key>` | Exa API key (alternative to EXA_API_KEY env var) |
| `--json` | Output raw JSON instead of formatted markdown |
| `-h, --help` | Show help message |

---

## Categories

When using `--category`, choose from:

| Category | Description |
|----------|-------------|
| `company` | Company websites and profiles |
| `research paper` | Academic papers and research |
| `news` | News articles and journalism |
| `pdf` | PDF documents |
| `tweet` | Twitter/X posts |
| `personal site` | Personal blogs and websites |
| `financial report` | Financial documents and reports |
| `people` | People profiles and information |

---

## Search Types

| Type | Description | Use Case |
|------|-------------|----------|
| `auto` | Automatically choose best search type | General queries |
| `fast` | Quick search with good results | Speed-critical applications |
| `deep` | Thorough search with better quality | Research and analysis |
| `instant` | Lowest latency, optimized for real-time | Live applications |

---

## Research Models

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| `fast` | Fastest | Good | Quick research, fact-checking |
| `regular` | Medium | Better | General research tasks |
| `pro` | Slower | Best | Deep analysis, complex topics |

---

## Practical Examples

### Research Workflow

```bash
# Start a research task
exa research "Latest developments in autonomous vehicles 2024" --poll

# Get task ID from output and check status later
exa research-status "task-id-from-previous-command"

# List all your research tasks
exa research-list
```

### Content Analysis

```bash
# Find relevant articles
exa search "machine learning interpretability" --category "research paper" --num-results 5 --text

# Get detailed content from a specific paper
exa contents "https://arxiv.org/abs/2305.09800" --text --highlights

# Find similar papers
exa similar "https://arxiv.org/abs/2305.09800" --category "research paper"
```

### News Monitoring

```bash
# Search recent news
exa search "artificial intelligence" --category news --start-date $(date -d '7 days ago' +%Y-%m-%d)

# Get full articles with summaries
exa search "startup funding" --category news --text --summary --num-results 10
```

### Q&A with Citations

```bash
# Quick answer
exa answer "What are the main types of neural networks?"

# Detailed answer with sources
exa answer "Explain the transformer architecture" --model exa-pro --text

# Streaming for long responses
exa answer "Write a comprehensive guide to prompt engineering" --stream
```

---

## Development

### Setup

```bash
# Clone and install dependencies
git clone https://github.com/ai-tools/exa-cli.git
cd exa-cli
bun install
```

### Running Locally

```bash
# Run in development mode
bun run src/index.ts search "test query"

# Or use the start script
bun start search "test query"
```

### Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test test/validation.test.ts
```

### Building

```bash
# Build standalone executable
bun run build

# The compiled binary will be at ./exa
./exa search "test query"
```

### Project Structure

```
@ai/exa-cli/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── client.ts             # Exa SDK wrapper
│   ├── commands/             # Command implementations
│   │   ├── search.ts
│   │   ├── contents.ts
│   │   ├── similar.ts
│   │   ├── answer.ts
│   │   └── research.ts
│   ├── formatters/           # Output formatters
│   │   └── markdown.ts
│   └── utils/                # Utility functions
│       └── validation.ts
├── test/                     # Test files
│   ├── validation.test.ts
│   ├── formatters.test.ts
│   └── commands.test.ts
└── package.json
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXA_API_KEY` | Your Exa API key | Yes (or use `--api-key`) |

---

## Error Handling

The CLI provides clear error messages for common issues:

```bash
# Missing API key
Error: EXA_API_KEY not set. Use --api-key or set EXA_API_KEY environment variable.

# Missing required arguments
Error: search requires a query argument

# Invalid URLs
Error: Invalid URLs: not-a-url

# API errors
Error: API Error 401: Unauthorized
```

---

## License

MIT

---

## Support

- 📖 [Exa API Documentation](https://exa.ai/docs)
- 🐛 [Report Issues](https://github.com/ai-tools/exa-cli/issues)
- 💡 [Request Features](https://github.com/ai-tools/exa-cli/issues)

---

Built with ❤️ using [Bun](https://bun.sh) and the [Exa API](https://exa.ai)
