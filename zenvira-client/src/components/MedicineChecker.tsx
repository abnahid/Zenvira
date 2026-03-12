"use client";

import { apiUrl } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { FiArrowUp, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

export default function MedicineChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello! I'm ZenVira Assistant.\nI can help with medicine uses, dosage, side effects, and interactions.\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));

      const response = await fetch(apiUrl("/api/medicine-checker"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "model",
            text: data.data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "model",
            text: "Sorry, I couldn't process your question. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "Something went wrong. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-100 h-[min(540px,calc(100vh-8rem))] flex flex-col overflow-hidden"
          style={{
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #E6F2ED",
            background: "#FFFFFF",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3.5 text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #0E9F6E, #10B981)",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <path d="M12 11v5" />
                  <path d="M10 14h4" />
                  <rect x="4" y="4" width="16" height="18" rx="2" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[15px] leading-tight">
                  ZenVira Assistant
                </p>
                <p className="text-[12px] text-white/80 leading-tight mt-0.5">
                  Medicine &amp; Safety Guide
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ background: "#F9FEFB" }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="text-[14px] leading-relaxed"
                    style={{
                      maxWidth: "80%",
                      padding: "14px 16px",
                      ...(msg.role === "user"
                        ? {
                            background: "#10B981",
                            color: "#FFFFFF",
                            borderRadius: "16px 16px 6px 16px",
                            whiteSpace: "pre-wrap" as const,
                          }
                        : {
                            background: "#F1F8F5",
                            color: "#1F2937",
                            borderRadius: "16px 16px 16px 6px",
                          }),
                    }}
                  >
                    {msg.role === "user" ? (
                      msg.text
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-4 mb-2 last:mb-0 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-4 mb-2 last:mb-0 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          h3: ({ children }) => (
                            <h3 className="font-bold text-[15px] mb-1">
                              {children}
                            </h3>
                          ),
                          code: ({ children }) => (
                            <code
                              className="text-[13px] px-1 py-0.5 rounded"
                              style={{ background: "#E6F2ED" }}
                            >
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
                {/* Disclaimer under welcome message */}
                {msg.id === "welcome" && (
                  <p
                    className="mt-2 ml-1"
                    style={{ fontSize: "12px", color: "#6B7280" }}
                  >
                    Medical information only &bull; Not a substitute for a
                    doctor
                  </p>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 px-4 py-3"
                  style={{
                    background: "#F1F8F5",
                    borderRadius: "16px 16px 16px 6px",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "#10B981",
                      animationDelay: "0ms",
                    }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "#10B981",
                      animationDelay: "150ms",
                    }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "#10B981",
                      animationDelay: "300ms",
                    }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="px-4 py-3 shrink-0"
            style={{
              borderTop: "1px solid #E6F2ED",
              background: "#FFFFFF",
            }}
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any medicine..."
                disabled={loading}
                className="flex-1 text-[14px] outline-none disabled:opacity-50"
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  background: "#F9FEFB",
                  border: "1px solid #D1FAE5",
                  color: "#1F2937",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="shrink-0 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#10B981",
                  color: "#FFFFFF",
                }}
              >
                <FiArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0E9F6E, #10B981)",
          color: "#FFFFFF",
          boxShadow: "0 6px 20px rgba(16,185,129,0.35)",
        }}
      >
        {isOpen ? (
          <FiX size={24} />
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <path d="M12 11v5" />
            <path d="M10 14h4" />
            <rect x="4" y="4" width="16" height="18" rx="2" />
          </svg>
        )}
      </button>
    </>
  );
}
