import { buildDryRunSummary, buildLineMessage } from "../src/message.js";
import { sendLinePushMessage } from "../src/line.js";
import {
  getCollectionForDate,
  parseDateArg,
  todayInJst,
} from "../src/schedule.js";

function parseArgs(argv: string[]) {
  let dryRun = false;
  let date: Date | null = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--date") {
      const value = argv[i + 1];
      if (!value) {
        throw new Error("--date requires a value (YYYY-MM-DD).");
      }
      date = parseDateArg(value);
      i++;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: npm run notify [-- --dry-run] [--date YYYY-MM-DD]

Options:
  --dry-run       Print message without sending to LINE
  --date          Target date (default: today in JST)
  --help, -h      Show this help
`);
      process.exit(0);
    }
  }

  return { dryRun, date: date ?? todayInJst() };
}

async function main() {
  const { dryRun, date } = parseArgs(process.argv.slice(2));
  const collection = getCollectionForDate(date);

  if (dryRun) {
    console.log(buildDryRunSummary(date));
    return;
  }

  if (!collection) {
    console.log(`No collection on ${date.toISOString().slice(0, 10)}. Skipping LINE notification.`);
    return;
  }

  const message = buildLineMessage(collection);
  await sendLinePushMessage(message);
  console.log(`Sent LINE notification for ${collection.dateKey}.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
