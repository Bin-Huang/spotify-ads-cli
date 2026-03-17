# spotify-ads-cli

Spotify Ads CLI for AI agents (and humans). Pull aggregate and demographic insight reports, estimate audience and bid ranges, manage audio creatives, track measurement pixels, and more.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g spotify-ads-cli
```

Or run directly with npx:

```bash
npx spotify-ads-cli --help
```

## How it works

Built on the official [Spotify Ads API](https://developer.spotify.com/documentation/ads-api) (v3). Authenticates via OAuth2 access token from a Spotify Developer App with Ads API access.

Core endpoints covered:

- **Businesses & Ad Accounts** -- list and inspect businesses and ad accounts
- **Campaigns** -- list and get campaigns with status filtering
- **Ad Sets** -- list and get ad sets (targeting, budget, schedule)
- **Ads** -- list and get individual ads (creatives)
- **Reporting** -- aggregate reports, insight reports (demographics, platform, genre), and async CSV reports
- **Targeting** -- audience size estimation, bid estimation, geo targets, and interest targets
- **Audiences** -- custom and lookalike audiences
- **Assets** -- audio, image, and other creative assets
- **Measurement** -- pixels, datasets, and dataset diagnostics

## Setup

### Option 1: Environment variable

```bash
export SPOTIFY_ADS_ACCESS_TOKEN="your_access_token"
```

### Option 2: Credentials file

Create `~/.config/spotify-ads-cli/credentials.json`:

```json
{
  "access_token": "your_access_token"
}
```

### Option 3: Per-command credentials

```bash
spotify-ads-cli businesses --credentials /path/to/creds.json
```

### Getting an access token

You need a [Spotify Developer App](https://developer.spotify.com/) with Ads API access. Contact ads-api-support@spotify.com for API access.

## Entity hierarchy

Spotify Ads uses this hierarchy:

```
Business
 └── Ad Account
      ├── Campaign
      │    └── Ad Set (targeting, budget, schedule)
      │         └── Ad (creative)
      ├── Asset (audio, images)
      ├── Audience (custom, lookalike)
      └── Pixel / Dataset (measurement)
```

## Monetary values

Spotify uses **micros**: 1 dollar = 1,000,000 micros. All bid amounts and budgets are in micros. Divide by 1,000,000 for the actual amount.

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for single-line JSON.

Pagination uses `--offset` and `--limit` (max 50). Reporting endpoints use continuation tokens.

### businesses

List businesses for the current user.

```bash
spotify-ads-cli businesses
```

### business

Get a specific business.

```bash
spotify-ads-cli business biz_abc123
```

### ad-accounts

List ad accounts for a business.

```bash
spotify-ads-cli ad-accounts biz_abc123
```

Options:
- `--offset <n>` -- start index (default 0)
- `--limit <n>` -- results per page (default 50, max 50)

### ad-account

Get a specific ad account.

```bash
spotify-ads-cli ad-account acc_abc123
```

### campaigns

List campaigns for an ad account.

```bash
spotify-ads-cli campaigns acc_abc123
spotify-ads-cli campaigns acc_abc123 --status ACTIVE
```

Options:
- `--offset <n>` -- start index (default 0)
- `--limit <n>` -- results per page (default 50, max 50)
- `--status <status>` -- filter by status: ACTIVE, PAUSED, COMPLETED, DRAFT

### campaign

Get a specific campaign.

```bash
spotify-ads-cli campaign camp_abc123
```

### adsets

List ad sets for an ad account.

```bash
spotify-ads-cli adsets acc_abc123
```

Options:
- `--offset <n>` -- start index (default 0)
- `--limit <n>` -- results per page (default 50, max 50)
- `--status <status>` -- filter by status: ACTIVE, PAUSED, COMPLETED, DRAFT

### adset

Get a specific ad set.

```bash
spotify-ads-cli adset adset_abc123
```

### ads

List ads for an ad account.

```bash
spotify-ads-cli ads acc_abc123
```

Options:
- `--offset <n>` -- start index (default 0)
- `--limit <n>` -- results per page (default 50, max 50)
- `--status <status>` -- filter by status: ACTIVE, PAUSED, COMPLETED, DRAFT

### ad

Get a specific ad.

```bash
spotify-ads-cli ad ad_abc123
```

### aggregate-report

Get aggregate performance report.

```bash
spotify-ads-cli aggregate-report acc_abc123 --start 2026-01-01 --end 2026-01-31
spotify-ads-cli aggregate-report acc_abc123 --start 2026-01-01 --end 2026-01-31 --entity-type CAMPAIGN --granularity DAY
```

Options:
- `--start <date>` -- start date (YYYY-MM-DD) **required**
- `--end <date>` -- end date (YYYY-MM-DD) **required**
- `--entity-type <type>` -- entity type: CAMPAIGN, AD_SET, AD
- `--granularity <granularity>` -- time granularity: DAY, WEEK, MONTH
- `--campaign-ids <ids>` -- filter by campaign IDs (comma-separated)
- `--adset-ids <ids>` -- filter by ad set IDs (comma-separated)
- `--continuation-token <token>` -- pagination token from previous response

### insight-report

Get insight report (audience demographics, platform, etc.).

```bash
spotify-ads-cli insight-report acc_abc123 --start 2026-01-01 --end 2026-01-31 --insight-dimension AGE
```

Options:
- `--start <date>` -- start date (YYYY-MM-DD) **required**
- `--end <date>` -- end date (YYYY-MM-DD) **required**
- `--entity-type <type>` -- entity type: CAMPAIGN, AD_SET, AD
- `--insight-dimension <dimension>` -- insight dimension: AGE, GENDER, PLATFORM, GENRE, etc.
- `--campaign-ids <ids>` -- filter by campaign IDs (comma-separated)
- `--continuation-token <token>` -- pagination token

### csv-report

Create an async CSV report.

```bash
spotify-ads-cli csv-report acc_abc123 --start 2026-01-01 --end 2026-01-31
```

Options:
- `--start <date>` -- start date (YYYY-MM-DD) **required**
- `--end <date>` -- end date (YYYY-MM-DD) **required**
- `--entity-type <type>` -- entity type: CAMPAIGN, AD_SET, AD
- `--granularity <granularity>` -- time granularity: DAY, WEEK, MONTH

### csv-report-status

Get CSV report generation status.

```bash
spotify-ads-cli csv-report-status acc_abc123 rpt_abc123
```

### estimate-audience

Estimate audience size for targeting criteria.

```bash
spotify-ads-cli estimate-audience --targeting '{"geo_targets":["US"],"age_range":{"min":18,"max":35}}'
```

Options:
- `--targeting <json>` -- targeting spec as JSON string **required**

### estimate-bid

Estimate bid for targeting criteria.

```bash
spotify-ads-cli estimate-bid --targeting '{"geo_targets":["US"]}'
```

Options:
- `--targeting <json>` -- targeting spec as JSON string **required**

### geo-targets

List available geographic targeting options.

```bash
spotify-ads-cli geo-targets
spotify-ads-cli geo-targets --query "United States"
```

Options:
- `--query <q>` -- search by location name
- `--limit <n>` -- results per page (default 50)

### interest-targets

List available interest targeting options.

```bash
spotify-ads-cli interest-targets
spotify-ads-cli interest-targets --query "music"
```

Options:
- `--query <q>` -- search by interest name
- `--limit <n>` -- results per page (default 50)

### audiences

List custom/lookalike audiences for an ad account.

```bash
spotify-ads-cli audiences acc_abc123
```

Options:
- `--offset <n>` -- start index (default 0)
- `--limit <n>` -- results per page (default 50)

### audience

Get a specific audience.

```bash
spotify-ads-cli audience aud_abc123
```

### assets

List assets (audio, images, etc.) for an ad account.

```bash
spotify-ads-cli assets acc_abc123
```

Options:
- `--offset <n>` -- start index (default 0)
- `--limit <n>` -- results per page (default 50)
- `--asset-ids <ids>` -- filter by asset IDs (comma-separated)

### pixels

List Spotify Pixels for a business.

```bash
spotify-ads-cli pixels biz_abc123
```

### pixel

Get a specific pixel.

```bash
spotify-ads-cli pixel biz_abc123 pix_abc123
```

### datasets

List measurement datasets for a business.

```bash
spotify-ads-cli datasets biz_abc123
```

### dataset

Get a specific measurement dataset.

```bash
spotify-ads-cli dataset ds_abc123
```

### dataset-diagnostics

Get diagnostics for a measurement dataset.

```bash
spotify-ads-cli dataset-diagnostics ds_abc123
```

## Error output

All errors are JSON to stderr:

```json
{"error": "No credentials found. Set SPOTIFY_ADS_ACCESS_TOKEN env var..."}
```

## API Reference

- [Spotify Ads API Documentation](https://developer.spotify.com/documentation/ads-api)

## Related

- [google-ads-open-cli](https://github.com/Bin-Huang/google-ads-open-cli) -- Google Ads CLI
- [meta-ads-open-cli](https://github.com/Bin-Huang/meta-ads-open-cli) -- Meta Ads CLI
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI
- [linkedin-ads-cli](https://github.com/Bin-Huang/linkedin-ads-cli) -- LinkedIn Ads CLI
- [snapchat-ads-cli](https://github.com/Bin-Huang/snapchat-ads-cli) -- Snapchat Ads CLI
- [pinterest-ads-cli](https://github.com/Bin-Huang/pinterest-ads-cli) -- Pinterest Ads CLI
- [reddit-ads-cli](https://github.com/Bin-Huang/reddit-ads-cli) -- Reddit Ads CLI

## License

Apache-2.0
