// lib/presets.ts
import type { PortfolioItem } from "@/hooks/usePortfolio";

export const portfolioPresets: Record<string, PortfolioItem[]> = {
  aggressive: [
    { name: "Growth Stocks", value: 35, color: "#3b82f6", description: "High-potential tech and innovation" },
    { name: "Cryptocurrency", value: 15, color: "#f59e0b", description: "Bitcoin, Ethereum, altcoins" },
    { name: "AI & Tech", value: 15, color: "#8b5cf6", description: "Artificial intelligence companies" },
    { name: "ESG Assets", value: 10, color: "#10b981", description: "Sustainable investing" },
    { name: "Emerging Markets", value: 10, color: "#06b6d4", description: "High-growth economies" },
    { name: "Startups/Venture", value: 8, color: "#ec4899", description: "Early-stage equity" },
    { name: "NFTs", value: 5, color: "#a855f7", description: "Digital collectibles" },
    { name: "Cash/Savings", value: 2, color: "#6b7280", description: "Emergency fund" },
  ],

  balanced: [
    { name: "Stocks/ETFs", value: 40, color: "#3b82f6", description: "Diversified equity exposure" },
    { name: "Bonds", value: 25, color: "#10b981", description: "Fixed-income stability" },
    { name: "ESG Assets", value: 15, color: "#8b5cf6", description: "Ethical investing" },
    { name: "Real Estate", value: 10, color: "#ec4899", description: "REITs and property" },
    { name: "Cryptocurrency", value: 5, color: "#f59e0b", description: "Digital assets" },
    { name: "Gold", value: 3, color: "#eab308", description: "Precious metals hedge" },
    { name: "Cash/Savings", value: 2, color: "#6b7280", description: "Liquidity reserve" },
  ],

  sustainable: [
    { name: "Renewable Energy", value: 30, color: "#10b981", description: "Solar, wind, clean tech" },
    { name: "ESG Stocks", value: 25, color: "#8b5cf6", description: "Ethical companies" },
    { name: "Impact Investing", value: 20, color: "#22c55e", description: "Social returns" },
    { name: "Electric Vehicles", value: 15, color: "#3b82f6", description: "EV manufacturers" },
    { name: "Sustainable Bonds", value: 8, color: "#059669", description: "Green bonds" },
    { name: "Cash/Savings", value: 2, color: "#6b7280", description: "Reserve funds" },
  ],

  techFocused: [
    { name: "AI & Machine Learning", value: 25, color: "#a855f7", description: "AI companies" },
    { name: "Technology Sector", value: 20, color: "#8b5cf6", description: "Software and tech" },
    { name: "Cryptocurrency", value: 15, color: "#f59e0b", description: "Digital currencies" },
    { name: "DeFi Assets", value: 10, color: "#fbbf24", description: "Decentralized finance" },
    { name: "Metaverse Assets", value: 10, color: "#c026d3", description: "Virtual reality" },
    { name: "Cybersecurity", value: 8, color: "#7c3aed", description: "Digital security" },
    { name: "FinTech Stocks", value: 7, color: "#6366f1", description: "Financial tech" },
    { name: "NFTs", value: 5, color: "#ec4899", description: "Digital art" },
  ],

  conservative: [
    { name: "Bonds", value: 40, color: "#10b981", description: "Government and corporate bonds" },
    { name: "Blue Chip Stocks", value: 25, color: "#1e40af", description: "Stable large-cap" },
    { name: "Dividend Stocks", value: 15, color: "#ec4899", description: "Income-generating" },
    { name: "Real Estate", value: 10, color: "#f97316", description: "REITs for stability" },
    { name: "Gold", value: 5, color: "#eab308", description: "Safe haven" },
    { name: "Cash/Savings", value: 5, color: "#6b7280", description: "High-yield savings" },
  ],
};

export const defaultPortfolio: PortfolioItem[] = portfolioPresets.balanced;