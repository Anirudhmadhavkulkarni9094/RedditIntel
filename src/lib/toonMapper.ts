export function mapTOONtoReport(toon: string) {
  // naive but effective parser (you can improve later)
  const lines = toon.split("\n").map(l => l.trim());

  const pain_points: string[] = [];
  const scam_signals: string[] = [];
  const market_opportunities: string[] = [];

  let section = "";

  for (const line of lines) {
    if (line.startsWith("PAIN_POINTS")) section = "pain";
    if (line.startsWith("SCAM_SIGNALS")) section = "scam";
    if (line.startsWith("OPPORTUNITIES")) section = "opp";

    if (line.startsWith("label:") && section === "pain") {
      pain_points.push(line.replace("label:", "").trim());
    }

    if (line.startsWith("pattern:") && section === "scam") {
      scam_signals.push(line.replace("pattern:", "").trim());
    }

    if (line.startsWith("market_type:") && section === "opp") {
      market_opportunities.push(
        line.replace("market_type:", "").trim()
      );
    }
  }

  return {
    pain_points,
    scam_signals,
    market_opportunities,
  };
}
