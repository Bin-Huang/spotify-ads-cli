import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerReportCommands(program: Command): void {
  program
    .command("aggregate-report <ad-account-id>")
    .description("Get aggregate performance report")
    .requiredOption("--start <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end <date>", "End date (YYYY-MM-DD)")
    .option("--group-by <fields>", "Group by fields (comma-separated): CAMPAIGN, AD_SET, AD, DAY, WEEK, MONTH")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--adset-ids <ids>", "Filter by ad set IDs (comma-separated)")
    .option("--continuation-token <token>", "Continuation token for pagination")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          start_date: opts.start,
          end_date: opts.end,
        };
        if (opts.groupBy) params.group_by = opts.groupBy;
        if (opts.campaignIds) params.campaign_ids = opts.campaignIds;
        if (opts.adsetIds) params.ad_set_ids = opts.adsetIds;
        if (opts.continuationToken) params.continuation_token = opts.continuationToken;
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}/reports/aggregate`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("insight-report <ad-account-id>")
    .description("Get insight report (audience demographics, platform, etc.)")
    .requiredOption("--start <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end <date>", "End date (YYYY-MM-DD)")
    .option("--group-by <fields>", "Group by fields: AGE, GENDER, PLATFORM, GENRE, etc.")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--continuation-token <token>", "Continuation token for pagination")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          start_date: opts.start,
          end_date: opts.end,
        };
        if (opts.groupBy) params.group_by = opts.groupBy;
        if (opts.campaignIds) params.campaign_ids = opts.campaignIds;
        if (opts.continuationToken) params.continuation_token = opts.continuationToken;
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}/reports/insight`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("csv-report <ad-account-id>")
    .description("Create an async CSV report")
    .requiredOption("--start <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end <date>", "End date (YYYY-MM-DD)")
    .option("--group-by <fields>", "Group by fields (comma-separated)")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          start_date: opts.start,
          end_date: opts.end,
        };
        if (opts.groupBy) params.group_by = opts.groupBy;
        const data = await callApi({ creds, path: `adAccounts/${adAccountId}/reports/csv`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("csv-report-status <report-id>")
    .description("Get CSV report generation status")
    .action(async (reportId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `reports/csv/${reportId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
