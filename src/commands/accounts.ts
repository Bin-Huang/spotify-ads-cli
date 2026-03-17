import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAccountCommands(program: Command): void {
  program
    .command("businesses")
    .description("List businesses for the current user")
    .action(async () => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: "businesses" });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("business <business-id>")
    .description("Get a specific business")
    .action(async (businessId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `businesses/${businessId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad-accounts <business-id>")
    .description("List ad accounts for a business")
    .option("--offset <n>", "Start index (default 0)", "0")
    .option("--limit <n>", "Results per page (default 50, max 50)", "50")
    .action(async (businessId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          offset: opts.offset,
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: `businesses/${businessId}/adAccounts`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad-account <ad-account-id>")
    .description("Get a specific ad account")
    .action(async (adAccountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
