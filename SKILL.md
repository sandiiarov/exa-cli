---
name: exa-cli
description: CLI tool for Exa AI search API. Search the web semantically, extract content from URLs, get AI answers with citations, and conduct automated research. Use when the user wants to search the web, find information, extract content from websites, get AI answers with sources, or perform automated research tasks.
---

# Exa CLI Skill

This skill provides command-line access to Exa AI search API for semantic web search, content extraction, AI-powered Q&A, and automated research.

## Capabilities

- **Semantic Web Search**: Search by meaning, not just keywords
- **Content Extraction**: Pull full text, highlights, and summaries from URLs
- **AI-Powered Answers**: Get answers with source citations
- **Similar Page Discovery**: Find pages similar to a given URL
- **Automated Research**: Deep research tasks with polling and status tracking

## Setup

### 1. Installation

```bash
# Option A: Install globally
npm install -g @ai-bubble/exa-cli

# Option B: Use with npx (no installation)
npx @ai-bubble/exa-cli <command>

# Option C: Install with Bun
bun install @ai-bubble/exa-cli
```

### 2. Configuration

Set the Exa API key:

```bash
export EXA_API_KEY="your-api-key-here"
```

Or pass with each command:

```bash
exa search "query" --api-key "your-key"
```

Get an API key at: https://dashboard.exa.ai/api-keys

## Core Skills

### Skill: Semantic Search

Search the web using semantic understanding.

**When to use:**
- User asks to search for information
- User wants to find articles, papers, or websites
- User needs to research a topic

**Command:**
```bash
exa search "<query>" [options]
```

**Key Options:**
- `--num-results <n>`: Results count (default: 10, max: 10 on basic plans)
- `--type <mode>`: Search mode - auto, fast, deep, instant
- `--text`: Include full text content
- `--highlights`: Include relevant text highlights
- `--summary`: Include AI-generated summary
- `--category <type>`: Filter by category (company, research paper, news, pdf, tweet, personal site, financial report, people)
- `--include-domains <list>`: Comma-separated domains to include
- `--exclude-domains <list>`: Comma-separated domains to exclude
- `--start-date <date>`: Start date (YYYY-MM-DD)
- `--end-date <date>`: End date (YYYY-MM-DD)
- `--autoprompt`: Enhance query with autoprompt

**Examples:**

```bash
# Basic semantic search
exa search "latest AI developments"

# Deep search with content extraction
exa search "transformer architecture explained" --type deep --text --highlights

# Filter by category and date
exa search "startup funding" --category news --start-date 2024-01-01

# Domain-specific search
exa search "machine learning" --include-domains "arxiv.org,openai.com"
```

### Skill: Content Extraction

Retrieve content from specific URLs.

**When to use:**
- User provides a URL and wants to extract content
- User wants to analyze a specific article or page
- User needs text from academic papers or documentation

**Command:**
```bash
exa contents <url1> [<url2> ...] [options]
```

**Key Options:**
- `--text`: Extract full text content
- `--highlights`: Extract relevant highlights
- `--summary`: Generate AI summary
- `--max-age-hours <n>`: Maximum cached content age (0 = always fetch fresh)

**Examples:**

```bash
# Extract text from single URL
exa contents "https://arxiv.org/abs/2304.15004" --text

# Extract from multiple URLs
exa contents "https://example.com/1" "https://example.com/2" --text --highlights

# Force fresh content fetch
exa contents "https://example.com/article" --text --max-age-hours 0
```

### Skill: Find Similar Pages

Discover pages similar to a given URL.

**When to use:**
- User wants to find similar articles or resources
- User wants related content to a specific page
- User is researching a topic and found one good source

**Command:**
```bash
exa similar <url> [options]
```

**Key Options:**
- `--num-results <n>`: Number of similar pages (default: 10)
- `--exclude-source-domain`: Don't return pages from same domain
- `--text`, `--highlights`, `--summary`: Include content
- `--category <type>`: Filter by category

**Examples:**

```bash
# Find similar pages
exa similar "https://openai.com/research/gpt-4"

# Exclude same domain, get content
exa similar "https://techcrunch.com/article" --exclude-source-domain --text
```

### Skill: AI-Powered Answers

Get AI-generated answers with source citations.

**When to use:**
- User asks a factual question
- User wants an explanation with sources
- User needs a quick answer with references

**Command:**
```bash
exa answer "<question>" [options]
```

**Key Options:**
- `--text`: Include source text in citations
- `--model <model>`: Model to use (exa, exa-pro)
- `--stream`: Stream response in real-time
- `--system-prompt <prompt>`: Custom system prompt

**Examples:**

```bash
# Basic question
exa answer "What is quantum computing?"

# Streaming response
exa answer "Explain neural networks" --stream

# Pro model for complex queries
exa answer "Compare transformer vs RNN architectures" --model exa-pro

# Custom explanation style
exa answer "Explain blockchain" --system-prompt "Explain to a 10-year-old"
```

### Skill: Automated Research

Create and manage deep research tasks.

**When to use:**
- User needs comprehensive research on a topic
- User wants automated information gathering
- User needs structured research output

**Command:**
```bash
exa research "<instructions>" [options]
```

**Key Options:**
- `--model <model>`: Research model (fast, regular, pro)
- `--poll`: Wait for completion and show results
- `--poll-interval <ms>`: Check interval in ms (default: 1000)
- `--timeout <ms>`: Max wait time (default: 600000 = 10 min)

**Examples:**

```bash
# Create research task
exa research "Latest SpaceX valuation and funding rounds"

# Create and wait for results
exa research "CRISPR applications in medicine" --poll

# Pro model with custom polling
exa research "Fusion energy progress 2024" --model pro --poll --timeout 300000
```

### Skill: Research Task Management

Check status and list research tasks.

**When to use:**
- User wants to check on a research task
- User needs to list all their research tasks
- User wants to see research results

**Commands:**

```bash
# Check specific task
exa research-status <task-id>

# List all tasks
exa research-list

# List with pagination
exa research-list --limit 10 --cursor "next-page-token"
```

## Workflows

### Workflow: Deep Topic Research

Research a topic thoroughly with multiple approaches:

1. **Initial Search**
   ```bash
   exa search "topic keywords" --type deep --num-results 10 --text
   ```

2. **Extract Key Sources**
   ```bash
   exa contents "https://key-source-1.com" "https://key-source-2.com" --text --highlights
   ```

3. **Find Related Content**
   ```bash
   exa similar "https://best-article-found.com" --num-results 5 --text
   ```

4. **Get AI Summary**
   ```bash
   exa answer "Synthesize findings about [topic]" --model exa-pro
   ```

5. **Deep Research (if needed)**
   ```bash
   exa research "Comprehensive analysis of [topic]" --model pro --poll
   ```

### Workflow: News Monitoring

Track recent news on a topic:

1. **Search Recent News**
   ```bash
   exa search "topic" --category news --start-date $(date -d '7 days ago' +%Y-%m-%d) --num-results 10
   ```

2. **Get Full Articles**
   ```bash
   exa contents "https://news-site.com/article-1" "https://news-site.com/article-2" --text --summary
   ```

### Workflow: Academic Research

Research academic papers:

1. **Search Papers**
   ```bash
   exa search "research topic" --category "research paper" --num-results 10
   ```

2. **Extract Paper Content**
   ```bash
   exa contents "https://arxiv.org/abs/xxxxx" --text --highlights
   ```

3. **Find Related Papers**
   ```bash
   exa similar "https://arxiv.org/abs/xxxxx" --category "research paper"
   ```

## Common Patterns

### Pattern: JSON Output for Scripting

Use `--json` flag when integrating with scripts:

```bash
# Get results as JSON
exa search "query" --json | jq '.results[0].title'

# Check task status programmatically
exa research-status "task-id" --json | jq '.status'
```

### Pattern: Content Options

Content flags (`--text`, `--highlights`, `--summary`) work across multiple commands:

```bash
# Search with content
exa search "query" --text --highlights

# Similar with content
exa similar "url" --text --summary

# Contents extraction
exa contents "url" --text --highlights --summary
```

### Pattern: Date Filtering

Filter by publication date:

```bash
# Last 30 days
exa search "topic" --start-date $(date -d '30 days ago' +%Y-%m-%d)

# Specific date range
exa search "topic" --start-date 2024-01-01 --end-date 2024-12-31
```

### Pattern: Domain Control

Include or exclude specific domains:

```bash
# Search only specific domains
exa search "topic" --include-domains "arxiv.org,openai.com,anthropic.com"

# Exclude domains
exa search "topic" --exclude-domains "reddit.com,twitter.com"
```

## Search Categories

Available categories for filtering:

- `company` - Company websites and profiles
- `research paper` - Academic papers and research
- `news` - News articles and journalism
- `pdf` - PDF documents
- `tweet` - Twitter/X posts
- `personal site` - Personal blogs and websites
- `financial report` - Financial documents
- `people` - People profiles

## Search Types

Different search modes for different needs:

- `auto` - Automatically choose best type (default)
- `fast` - Quick search, good for speed-critical apps
- `deep` - Thorough search, best for research
- `instant` - Lowest latency, optimized for real-time

## Research Models

Research task quality levels:

- `fast` / `exa-research-fast` - Fastest, good for quick facts
- `regular` / `exa-research` - Balanced speed and quality
- `pro` / `exa-research-pro` - Highest quality, slower

## Error Handling

Common errors and solutions:

**Missing API Key:**
```
Error: EXA_API_KEY not set. Use --api-key or set EXA_API_KEY environment variable.
```
*Solution: Set EXA_API_KEY environment variable or use --api-key flag*

**Missing Arguments:**
```
Error: search requires a query argument
```
*Solution: Provide the required argument*

**Invalid URLs:**
```
Error: API Error 400: Invalid URL format
```
*Solution: Check URL format and try again*

**Rate Limiting:**
```
Error: API Error 429: Too many requests
```
*Solution: Wait and retry, or upgrade your Exa plan*

## Tips and Best Practices

1. **Use autoprompt for better results**: Add `--autoprompt` to searches when you're not getting relevant results

2. **Combine content options**: Use `--text --highlights --summary` together for comprehensive content extraction

3. **Stream for long answers**: Use `--stream` with the `answer` command for better UX on long responses

4. **Poll for research**: Always use `--poll` with research tasks unless you want to check status manually later

5. **Check costs**: Look for cost information in the output to monitor API usage

6. **Use categories**: Filter by category (especially `research paper` or `news`) for more targeted results

7. **Date filtering**: Use date filters for time-sensitive research

8. **JSON for automation**: Use `--json` flag when integrating with other tools or scripts

## Resources

- **Full Documentation**: https://github.com/ai-tools/exa-cli#readme
- **Exa API Docs**: https://exa.ai/docs
- **Issue Tracker**: https://github.com/ai-tools/exa-cli/issues
- **npm Package**: https://www.npmjs.com/package/@ai-bubble/exa-cli

## Examples Summary

```bash
# Search
exa search "AI startups" --num-results 5 --text --type deep

# Contents
exa contents "https://example.com/article" --text --highlights

# Similar
exa similar "https://openai.com/blog" --exclude-source-domain

# Answer
exa answer "What is LLM?" --model exa-pro --stream

# Research
exa research "SpaceX history" --model pro --poll
exa research-status "task-id"
exa research-list --limit 10
```
