// hooks/usePortfolio.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { portfolioPresets, defaultPortfolio } from "@/lib/presets";

export type PortfolioItem = {
  name: string;
  value: number;
  color: string;
  description?: string;
};

const PORTFOLIO_STORAGE_KEY = "portfolio_state";

function isValidPortfolio(items: unknown): items is PortfolioItem[] {
  return Array.isArray(items) && items.every(item =>
    item &&
    typeof item === "object" &&
    typeof (item as PortfolioItem).name === "string" &&
    typeof (item as PortfolioItem).value === "number" &&
    typeof (item as PortfolioItem).color === "string"
  );
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(defaultPortfolio);
  const [history, setHistory] = useState<PortfolioItem[][]>([]);
  const [chartView, setChartView] = useState<"pie" | "bar">("pie");
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const totalAllocation = portfolio.reduce((sum, item) => sum + item.value, 0);

  const pushToHistory = useCallback((newPortfolio: PortfolioItem[]) => {
    setHistory(prev => [...prev, portfolio]);
    setPortfolio(newPortfolio);
  }, [portfolio]);

  const undo = useCallback(() => {
    if (history.length === 0) return false;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setPortfolio(previous);
    return true;
  }, [history]);

  const switchPreset = useCallback((presetName: keyof typeof portfolioPresets) => {
    const preset = portfolioPresets[presetName];
    if (preset) {
      pushToHistory(preset);
      return true;
    }
    return false;
  }, [pushToHistory]);

  const updatePortfolio = useCallback((updater: (prev: PortfolioItem[]) => PortfolioItem[]) => {
    setPortfolio(prev => {
      const next = updater(prev);
      // Optional: auto-normalize to 100%
      const sum = next.reduce((s, i) => s + i.value, 0);
      if (Math.abs(sum - 100) > 0.01) {
        const factor = 100 / sum;
        return next.map(item => ({
          ...item,
          value: Math.round(item.value * factor * 10) / 10,
        }));
      }
      return next;
    });
  }, []);

  const applyPortfolio = useCallback((next: PortfolioItem[], pushHistory = true) => {
    if (pushHistory) {
      setHistory(prev => [...prev, portfolio]);
    }
    setPortfolio(next);
  }, [portfolio]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidPortfolio(parsed)) {
          setPortfolio(parsed);
        }
      }
    } catch {
      // Ignore storage failures in restricted browser modes.
    } finally {
      setHasLoadedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    } catch {
      // Ignore storage failures in restricted browser modes.
    }
  }, [portfolio, hasLoadedStorage]);

  return {
    portfolio,
    totalAllocation,
    isBalanced: Math.abs(totalAllocation - 100) < 0.5,

    chartView,
    setChartView,

    historyLength: history.length,
    undo,

    switchPreset,

    // For chat commands / quick actions
    addAsset: (newAsset: Omit<PortfolioItem, "value"> & { value?: number }) => {
      const percentage = newAsset.value ?? 5;
      updatePortfolio(prev => {
        const reductionFactor = (100 - percentage) / 100;
        const scaled = prev.map(item => ({
          ...item,
          value: Math.round(item.value * reductionFactor * 10) / 10,
        }));
        return [...scaled, { ...newAsset, value: percentage }];
      });
    },

    removeAsset: (name: string) => {
      updatePortfolio(prev => {
        const without = prev.filter(item => item.name !== name);
        if (without.length === prev.length) return prev;
        const currentSum = without.reduce((s, i) => s + i.value, 0);
        const factor = currentSum > 0 ? 100 / currentSum : 1;
        return without.map(item => ({
          ...item,
          value: Math.round(item.value * factor * 10) / 10,
        }));
      });
    },

    updateAssetValue: (name: string, newValue: number) => {
      updatePortfolio(prev => {
        const target = prev.find(item => item.name === name);
        if (!target) return prev;
        const diff = newValue - target.value;
        if (diff === 0) return prev;

        const others = prev.filter(item => item.name !== name);
        const othersSum = others.reduce((s, i) => s + i.value, 0);
        if (othersSum === 0) return prev;

        const factor = (100 - newValue) / othersSum;

        return prev.map(item =>
          item.name === name
            ? { ...item, value: newValue }
            : { ...item, value: Math.round(item.value * factor * 10) / 10 }
        );
      });
    },

    applyPortfolio,
  };
}
