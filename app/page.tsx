"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChatLog((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      setChatLog((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>DeepSeek Chatbot (Ollama)</h1>
      <div style={{ border: "1px solid #ccc", padding: "1rem", height: "300px", overflowY: "scroll", marginBottom: "1rem" }}>
        {chatLog.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "80%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>Send</button>
      </form>
    </div>
  );
}