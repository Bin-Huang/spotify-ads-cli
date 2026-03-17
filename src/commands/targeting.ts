import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerTargetingCommands(program: Command): void {
  program
    .command("estimate-audience")
    .description("Estimate audience size for targeting criteria")
    .requiredOption("--targeting <json>", "Targeting spec as JSON string")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        // Pass targeting as query params
        const targeting = JSON.parse(opts.targeting);
        for (const [k, v] of Object.entries(targeting)) {
          params[k] = typeof v === "string" ? v : JSON.stringify(v);
        }
        const data = await callApi({ creds, path: "targeting/estimateAudience", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("estimate-bid")
    .description("Estimate bid for targeting criteria")
    .requiredOption("--targeting <json>", "Targeting spec as JSON string")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        const targeting = JSON.parse(opts.targeting);
        for (const [k, v] of Object.entries(targeting)) {
          params[k] = typeof v === "string" ? v : JSON.stringify(v);
        }
        const data = await callApi({ creds, path: "targeting/estimateBid", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("geo-targets")
    .description("List available geographic targeting options")
    .option("--query <q>", "Search by location name")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.query) params.query = opts.query;
        const data = await callApi({ creds, path: "targeting/geoTargets", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("interest-targets")
    .description("List available interest targeting options")
    .option("--query <q>", "Search by interest name")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { limit: opts.limit };
        if (opts.query) params.query = opts.query;
        const data = await callApi({ creds, path: "targeting/interestTargets", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("audiences <ad-account-id>")
    .description("List custom/lookalike audiences for an ad account")
    .option("--offset <n>", "Start index (default 0)", "0")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          offset: opts.offset,
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}/audiences`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("audience <audience-id>")
    .description("Get a specific audience")
    .action(async (audienceId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `audiences/${audienceId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
