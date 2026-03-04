"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import type { PortfolioItem } from "@/hooks/usePortfolio";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type PortfolioChatbotProps = {
  portfolio: PortfolioItem[];
  applyPortfolio: (next: PortfolioItem[], pushHistory?: boolean) => void;
};

export default function PortfolioChatbot({ portfolio, applyPortfolio }: PortfolioChatbotProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Tell me how to adjust your allocation. Example: “decrease 5 percent stocks”.",
    },
  ]);

  const addMessage = (role: ChatMessage["role"], text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setMessages(prev => [
      ...prev,
      { id, role, text },
    ]);
    return id;
  };

  const updateMessage = (id: string, text: string) => {
    setMessages(prev => prev.map(msg => (msg.id === id ? { ...msg, text } : msg)));
  };

  const summarizeChanges = (
    beforePortfolio: PortfolioItem[],
    afterPortfolio: PortfolioItem[],
    command: string
  ) => {
    const beforeMap = new Map(beforePortfolio.map(item => [item.name, item.value]));
    const normalized = command.toLowerCase();
    const changes = afterPortfolio
      .map(item => {
        const before = beforeMap.get(item.name);
        if (typeof before !== "number") return null;
        const delta = Math.round((item.value - before) * 10) / 10;
        if (Math.abs(delta) < 0.1) return null;
        return {
          name: item.name,
          before,
          after: item.value,
          delta,
          score: normalized.includes(item.name.toLowerCase()) ? 100 : Math.abs(delta),
        };
      })
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .sort((a, b) => b.score - a.score || Math.abs(b.delta) - Math.abs(a.delta));

    if (changes.length === 0) return "";
    const top = changes.slice(0, 3);
    return top
      .map(
        c =>
          `${c.name}: ${c.before.toFixed(1)}% -> ${c.after.toFixed(1)}% (${c.delta > 0 ? "+" : ""}${c.delta.toFixed(1)}%)`
      )
      .join("\n");
  };

  const handleCommand = async (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    setIsSending(true);
    const beforePortfolio = portfolio.map(item => ({ ...item }));
    const pendingId = addMessage("assistant", "Analyzing your request...");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const response = await fetch(`${API_URL}/api/v1/portfolio/chat/route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: rawText,
          current_portfolio: portfolio,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.detail || payload?.error || "Failed to process command.");
      }

      const payload: {
        message: string;
        predicted_portfolio?: typeof portfolio;
        allocation_portfolio?: typeof portfolio;
      } = await response.json();

      const nextPortfolio = payload.predicted_portfolio || payload.allocation_portfolio;
      if (nextPortfolio?.length) {
        applyPortfolio(nextPortfolio, true);
      }
      const deltaSummary = nextPortfolio?.length
        ? summarizeChanges(beforePortfolio, nextPortfolio, rawText)
        : "";
      const finalText = deltaSummary ? `${payload.message}\n${deltaSummary}` : payload.message;
      updateMessage(pendingId, finalText);
    } catch (error: any) {
      const message = String(error?.message || "");
      if (error instanceof TypeError || message.toLowerCase().includes("failed to fetch")) {
        updateMessage(
          pendingId,
          `Cannot reach backend at ${API_URL}. Check backend server and CORS origins.`
        );
      } else {
        updateMessage(pendingId, message || "Sorry, I couldn't process that command.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage("user", trimmed);
    setInput("");
    handleCommand(trimmed);
  };

  return (
    <div id="portfolio-chat" className="bg-white rounded-2xl shadow border overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Chat</h3>
            <p className="text-sm text-gray-500">Automated allocation changes</p>
          </div>
        </div>
        <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
          Natural language
        </span>
      </div>

      <div className="px-6 py-4 h-64 overflow-y-auto space-y-3 bg-gradient-to-b from-white to-indigo-50/30">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm whitespace-pre-line",
              message.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-white text-gray-700 border"
            )}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="p-6 border-t flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder='Try: "decrease 5 percent stocks"'
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow"
          >
            {isSending ? "Working..." : "Send"}
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Ask normally: "make it safer", "why so much in bonds?", "decrease stocks by 5%", "set stocks to 40%".
        </p>
      </form>
    </div>
  );
}
