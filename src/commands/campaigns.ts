import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCampaignCommands(program: Command): void {
  program
    .command("campaigns <ad-account-id>")
    .description("List campaigns for an ad account")
    .option("--offset <n>", "Start index (default 0)", "0")
    .option("--limit <n>", "Results per page (default 50, max 50)", "50")
    .option("--status <status>", "Filter by status: ACTIVE, PAUSED, COMPLETED, DRAFT")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          offset: opts.offset,
          limit: opts.limit,
        };
        if (opts.status) params.statuses = opts.status;
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}/campaigns`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("campaign <campaign-id>")
    .description("Get a specific campaign")
    .action(async (campaignId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `campaigns/${campaignId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("adsets <ad-account-id>")
    .description("List ad sets for an ad account")
    .option("--offset <n>", "Start index (default 0)", "0")
    .option("--limit <n>", "Results per page (default 50, max 50)", "50")
    .option("--status <status>", "Filter by status: ACTIVE, PAUSED, COMPLETED, DRAFT")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          offset: opts.offset,
          limit: opts.limit,
        };
        if (opts.status) params.statuses = opts.status;
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}/adSets`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("adset <adset-id>")
    .description("Get a specific ad set")
    .action(async (adsetId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `adSets/${adsetId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ads <ad-account-id>")
    .description("List ads for an ad account")
    .option("--offset <n>", "Start index (default 0)", "0")
    .option("--limit <n>", "Results per page (default 50, max 50)", "50")
    .option("--status <status>", "Filter by status: ACTIVE, PAUSED, COMPLETED, DRAFT")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          offset: opts.offset,
          limit: opts.limit,
        };
        if (opts.status) params.statuses = opts.status;
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}/ads`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad <ad-id>")
    .description("Get a specific ad")
    .action(async (adId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `ads/${adId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
