// lib/portfolioCommands.ts
import type { PortfolioItem } from "@/hooks/usePortfolio";

type CommandResult = {
  success: boolean;
  message: string;
  updatedPortfolio?: PortfolioItem[];
};

const assetKeywords: Record<string, { name: string; color: string; description?: string }> = {
  stocks: { name: "Stocks/ETFs", color: "#3b82f6" },
  growth: { name: "Growth Stocks", color: "#3b82f6" },
  tech: { name: "Technology Sector", color: "#8b5cf6" },
  ai: { name: "AI & Machine Learning", color: "#a855f7" },
  crypto: { name: "Cryptocurrency", color: "#f59e0b" },
  nft: { name: "NFTs", color: "#a855f7" },
  defi: { name: "DeFi Assets", color: "#fbbf24" },
  esg: { name: "ESG Assets", color: "#10b981" },
  renewable: { name: "Renewable Energy", color: "#10b981" },
  ev: { name: "Electric Vehicles", color: "#3b82f6" },
  reit: { name: "Real Estate", color: "#ec4899" },
  gold: { name: "Gold", color: "#eab308" },
  bonds: { name: "Bonds", color: "#10b981" },
  // ... you can add many more
};

export function processPortfolioCommand(
  command: string,
  currentPortfolio: PortfolioItem[]
): CommandResult {
  const lower = command.toLowerCase().trim();

  // --------------------
  // UNDO
  // --------------------
  if (lower.includes("undo") || lower.includes("revert")) {
    return { success: true, message: "Undo requested (handled in hook)" };
  }

  // --------------------
  // REMOVE / DELETE
  // --------------------
  if (lower.includes("remove") || lower.includes("delete")) {
    for (const [key, asset] of Object.entries(assetKeywords)) {
      if (lower.includes(key)) {
        if (!currentPortfolio.some(p => p.name === asset.name)) {
          return { success: false, message: `${asset.name} is not in your portfolio.` };
        }
        return {
          success: true,
          message: `Removing ${asset.name}...`,
          updatedPortfolio: currentPortfolio.filter(p => p.name !== asset.name),
        };
      }
    }
    return { success: false, message: "Couldn't identify which asset to remove." };
  }

  // --------------------
  // ADD
  // --------------------
  if (lower.includes("add")) {
    const percentMatch = lower.match(/(\d+(?:\.\d+)?)%?/);
    const percentage = percentMatch ? parseFloat(percentMatch[1]) : 5;

    for (const [key, asset] of Object.entries(assetKeywords)) {
      if (lower.includes(key)) {
        if (currentPortfolio.some(p => p.name === asset.name)) {
          return { success: false, message: `${asset.name} is already in your portfolio.` };
        }

        const newAsset = { ...asset, value: percentage, description: asset.description || "" };
        const reduction = (100 - percentage) / 100;

        const updated = currentPortfolio.map(p => ({
          ...p,
          value: Math.round(p.value * reduction * 10) / 10,
        }));

        return {
          success: true,
          message: `Added ${asset.name} at ${percentage}%`,
          updatedPortfolio: [...updated, newAsset],
        };
      }
    }
    return { success: false, message: "Couldn't recognize the asset to add. Try 'add AI 10%' or 'add crypto'" };
  }

  // --------------------
  // INCREASE / TO
  // --------------------
  if (lower.includes("increase") || lower.includes("to")) {
    const percentMatch = lower.match(/(\d+(?:\.\d+)?)%?/);
    if (!percentMatch) return { success: false, message: "Please specify a percentage, e.g. increase crypto to 15%" };

    const targetPct = parseFloat(percentMatch[1]);

    for (const [key, asset] of Object.entries(assetKeywords)) {
      if (lower.includes(key)) {
        const existing = currentPortfolio.find(p => p.name === asset.name);
        if (!existing) {
          return { success: false, message: `${asset.name} is not in your portfolio.` };
        }
        if (targetPct <= existing.value) {
          return { success: false, message: `Already at ${existing.value}%. Did you mean decrease?` };
        }

        const updated = currentPortfolio.map(p =>
          p.name === asset.name ? { ...p, value: targetPct } : p
        );

        return {
          success: true,
          message: `Increased ${asset.name} to ${targetPct}%`,
          updatedPortfolio: updated,
        };
      }
    }
  }

  return {
    success: false,
    message:
      "Sorry, I didn't understand that command.\n\nTry:\n• add AI stocks 10%\n• remove crypto\n• increase ESG to 20%\n• decrease bonds to 15%",
  };
}