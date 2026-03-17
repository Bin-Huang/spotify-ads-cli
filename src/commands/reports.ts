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
    .option("--entity-type <type>", "Entity type: CAMPAIGN, AD_SET, AD")
    .option("--granularity <granularity>", "Time granularity: DAY, WEEK, MONTH")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--adset-ids <ids>", "Filter by ad set IDs (comma-separated)")
    .option("--continuation-token <token>", "Continuation token for pagination")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          report_start: opts.start,
          report_end: opts.end,
        };
        if (opts.entityType) params.entity_type = opts.entityType;
        if (opts.granularity) params.granularity = opts.granularity;
        if (opts.campaignIds) params.campaign_ids = opts.campaignIds;
        if (opts.adsetIds) params.ad_set_ids = opts.adsetIds;
        if (opts.continuationToken) params.continuation_token = opts.continuationToken;
        const data = await callApi({ creds, path: `ad_accounts/${adAccountId}/reports/aggregate`, params });
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
    .option("--entity-type <type>", "Entity type: CAMPAIGN, AD_SET, AD")
    .option("--insight-dimension <dimension>", "Insight dimension: AGE, GENDER, PLATFORM, GENRE, etc.")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--continuation-token <token>", "Continuation token for pagination")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          report_start: opts.start,
          report_end: opts.end,
        };
        if (opts.entityType) params.entity_type = opts.entityType;
        if (opts.insightDimension) params.insight_dimension = opts.insightDimension;
        if (opts.campaignIds) params.campaign_ids = opts.campaignIds;
        if (opts.continuationToken) params.continuation_token = opts.continuationToken;
        const data = await callApi({ creds, path: `ad_accounts/${adAccountId}/insight_reports`, params });
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
    .option("--entity-type <type>", "Entity type: CAMPAIGN, AD_SET, AD")
    .option("--granularity <granularity>", "Time granularity: DAY, WEEK, MONTH")
    .action(async (adAccountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const body: Record<string, string> = {
          report_start: opts.start,
          report_end: opts.end,
        };
        if (opts.entityType) body.entity_type = opts.entityType;
        if (opts.granularity) body.granularity = opts.granularity;
        const data = await callApi({ creds, path: `ad_accounts/${adAccountId}/reports/csv`, method: "POST", body });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("csv-report-status <ad-account-id> <report-id>")
    .description("Get CSV report generation status")
    .action(async (accountId: string, reportId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `ad_accounts/${accountId}/reports/csv/${reportId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
