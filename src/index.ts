#!/usr/bin/env bun

import { readFileSync } from "fs";
import { parseArgs } from "util";
import { createClient } from "./client.ts";
import * as search from "./commands/search.ts";
import * as contents from "./commands/contents.ts";
import * as similar from "./commands/similar.ts";
import * as answer from "./commands/answer.ts";
import * as research from "./commands/research.ts";
import { isValidSearchType, isValidAnswerModel, isValidResearchModel } from "./utils/validation.ts";

let VERSION = "0.1.2";
try {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8"));
  VERSION = packageJson.version;
} catch {
  // Using hardcoded version when running as compiled binary
}

const HELP_TEXT = `
Exa CLI - AI-powered search and content retrieval

Usage: exa <command> [options] [arguments]

Commands:
  search <query>           Search the web
  contents <url...>         Get contents of URLs
  similar <url>             Find similar pages
  answer <query>            Get AI-powered answers
  research <instructions>   Create a research task
  research-status <id>      Check research task status
  research-list             List research tasks

Global Options:
  --api-key <key>          Exa API key (or EXA_API_KEY env var)
  --json                   Output raw JSON instead of markdown
  --version                Show version information
  -h, --help              Show this help message

Search Options:
  --num-results <n>        Number of results (default: 10)
  --type <auto|fast|deep|instant>  Search type
  --text                   Include text content
  --highlights             Include highlights
  --summary                Include summary
  --category <category>    Filter by category
  --include-domains <list> Comma-separated domain list
  --exclude-domains <list> Comma-separated domain list
  --start-date <date>     Start date (ISO format)
  --end-date <date>       End date (ISO format)
  --autoprompt             Use autoprompt

Answer Options:
  --model <ex|exa-pro>      Model to use
  --stream                 Stream the response
  --system-prompt <text>   System prompt

Research Options:
  --model <fast|regular|pro>  Research model
  --poll                   Poll until completion
  --poll-interval <ms>     Polling interval (default: 1000)
  --timeout <ms>           Timeout in ms (default: 600000)
  --limit <n>              Number of tasks to list
  --cursor <token>         Pagination cursor

Examples:
  exa search "AI startups" --num-results 5 --text
  exa contents "https://example.com" --text
  exa answer "What is quantum computing?"
  exa similar "https://example.com" --exclude-source-domain
  exa research "Latest AI developments" --poll
  exa research-status abc-123
`;

async function main() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      "api-key": { type: "string" },
      json: { type: "boolean" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean" },
      "num-results": { type: "string" },
      type: { type: "string" },
      text: { type: "boolean" },
      highlights: { type: "boolean" },
      summary: { type: "boolean" },
      category: { type: "string" },
      "include-domains": { type: "string" },
      "exclude-domains": { type: "string" },
      "start-date": { type: "string" },
      "end-date": { type: "string" },
      autoprompt: { type: "boolean" },
      model: { type: "string" },
      stream: { type: "boolean" },
      "system-prompt": { type: "string" },
      poll: { type: "boolean" },
      "poll-interval": { type: "string" },
      timeout: { type: "string" },
      limit: { type: "string" },
      cursor: { type: "string" },
      "exclude-source-domain": { type: "boolean" },
      "max-age-hours": { type: "string" },
    },
    strict: false,
    allowPositionals: true,
  });

  if (values.version) {
    console.log(`exa v${VERSION}`);
    process.exit(0);
  }

  if (values.help || positionals.length === 0) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  const apiKey = values["api-key"] || process.env.EXA_API_KEY;
  if (!apiKey || typeof apiKey !== "string") {
    console.error("Error: EXA_API_KEY not set. Use --api-key or set EXA_API_KEY environment variable.");
    process.exit(1);
  }

  const client = createClient(apiKey);
  const command = positionals[0];
  const args = positionals.slice(1);

  // Convert values to command args
  const commandArgs: Record<string, unknown> = { ...values };

  switch (command) {
    case "search": {
      if (args.length === 0) {
        console.error("Error: search requires a query argument");
        process.exit(1);
      }
      if (commandArgs.type && !isValidSearchType(commandArgs.type)) {
        console.error("Error: --type must be one of: auto, fast, deep, instant");
        process.exit(1);
      }
      const query = args.join(" ");
      await search.search(client, query, commandArgs);
      break;
    }

    case "contents": {
      if (args.length === 0) {
        console.error("Error: contents requires at least one URL");
        process.exit(1);
      }
      await contents.contents(client, args, commandArgs);
      break;
    }

    case "similar": {
      const url = args[0];
      if (!url) {
        console.error("Error: similar requires a URL argument");
        process.exit(1);
      }
      await similar.similar(client, url, commandArgs);
      break;
    }

    case "answer": {
      if (args.length === 0) {
        console.error("Error: answer requires a query argument");
        process.exit(1);
      }
      if (commandArgs.model && !isValidAnswerModel(commandArgs.model)) {
        console.error("Error: --model must be one of: ex, exa-pro");
        process.exit(1);
      }
      const query = args.join(" ");
      await answer.answer(client, query, commandArgs);
      break;
    }

    case "research": {
      if (args.length === 0) {
        console.error("Error: research requires instructions argument");
        process.exit(1);
      }
      if (commandArgs.model && !isValidResearchModel(commandArgs.model)) {
        console.error("Error: --model must be one of: fast, regular, pro");
        process.exit(1);
      }
      const instructions = args.join(" ");
      await research.researchCreate(client, instructions, commandArgs);
      break;
    }

    case "research-status": {
      const researchId = args[0];
      if (!researchId) {
        console.error("Error: research-status requires a task ID");
        process.exit(1);
      }
      await research.researchStatus(client, researchId, commandArgs);
      break;
    }

    case "research-list": {
      await research.researchList(client, commandArgs);
      break;
    }

    default: {
      console.error(`Error: Unknown command "${command}"`);
      console.log(HELP_TEXT);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
