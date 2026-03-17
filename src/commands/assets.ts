import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAssetCommands(program: Command): void {
  program
    .command("assets <ad-account-id>")
    .description("List assets (audio, images, etc.) for an ad account")
    .option("--offset <n>", "Start index (default 0)", "0")
    .option("--limit <n>", "Results per page (default 50)", "50")
    .option("--asset-ids <ids>", "Filter by asset IDs (comma-separated)")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          offset: opts.offset,
          limit: opts.limit,
        };
        if (opts.assetIds) params.asset_ids = opts.assetIds;
        const data = await callApi({ creds, path: `ad_accounts/${adAccountId}/assets`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("pixels <business-id>")
    .description("List Meta Pixels for a business")
    .action(async (businessId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `businesses/${businessId}/pixels` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("pixel <business-id> <pixel-id>")
    .description("Get a specific pixel")
    .action(async (businessId: string, pixelId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `businesses/${businessId}/pixels/${pixelId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("datasets <business-id>")
    .description("List measurement datasets for a business")
    .action(async (businessId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `businesses/${businessId}/datasets` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("dataset <dataset-id>")
    .description("Get a specific measurement dataset")
    .action(async (datasetId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `datasets/${datasetId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("dataset-diagnostics <dataset-id>")
    .description("Get diagnostics for a measurement dataset")
    .action(async (datasetId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `datasets/${datasetId}/diagnostics` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
