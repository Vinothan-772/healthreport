"use client";

// ============================================================
// REPORT CHAT COMPONENT
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ReportChat({ reportId }: { reportId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setError(null);
    
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/report-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          question: userMsg,
          history: messages.slice(-4), // Send last 4 messages for context
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        setError(data.error || "Failed to get an answer.");
        // Pop user message on error? Or just show error below. We'll show error below.
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What does this test measure?",
    "Why is a result outside the range?",
    "Explain this in simpler language.",
  ];

  return (
    <section
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "600px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Bot size={20} style={{ color: "var(--color-teal)" }} />
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-navy)" }}>
            Ask About This Report
          </h2>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            AI Assistant is ready to help explain your results.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "15px", color: "var(--color-text-muted)", marginBottom: "16px" }}>
                Have a question about this report?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      padding: "8px 16px",
                      borderRadius: "100px",
                      fontSize: "13px",
                      color: "var(--color-teal)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    className="hover:border-teal-500 hover:bg-teal-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: msg.role === "user" ? "var(--color-navy)" : "var(--color-teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "white",
                }}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                style={{
                  backgroundColor: msg.role === "user" ? "var(--color-bg)" : "var(--color-teal-light)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-lg)",
                  borderTopRightRadius: msg.role === "user" ? "4px" : "var(--radius-lg)",
                  borderTopLeftRadius: msg.role === "assistant" ? "4px" : "var(--radius-lg)",
                  maxWidth: "80%",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "var(--color-navy)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
             <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "white",
                }}
              >
                <Bot size={16} />
              </div>
              <div
                style={{
                  backgroundColor: "var(--color-teal-light)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-lg)",
                  borderTopLeftRadius: "4px",
                }}
              >
                <span className="spinner" style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid var(--color-teal)", borderTopColor: "transparent", borderRadius: "50%" }}></span>
              </div>
          </div>
        )}

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-danger)", fontSize: "13px", padding: "8px", backgroundColor: "var(--color-danger-bg)", borderRadius: "var(--radius-md)" }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--color-border)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            maxLength={2000}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "1px solid var(--color-border)",
              borderRadius: "100px",
              fontSize: "14px",
              outline: "none",
            }}
            className="focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: !input.trim() || isLoading ? "var(--color-border)" : "var(--color-teal)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: !input.trim() || isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <Send size={16} style={{ marginLeft: "2px" }} />
          </button>
        </form>
      </div>
    </section>
  );
}
