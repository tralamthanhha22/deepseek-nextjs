// app/deepseekAction.ts
"use server";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Ensure message is provided
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        prompt: message,
        stream: false, // Change to true for streaming
      }),
    });

    if (!response.ok) {
      console.error("Ollama API Error:", await response.text());
      throw new Error("Failed to fetch response from Ollama");
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response || "No response" });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}