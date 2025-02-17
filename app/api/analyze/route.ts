import { NextRequest } from "next/server";
import { Message, streamText, convertToCoreMessages } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, data } = body;
    const imageContext = data?.imageContext;

    // Prepare messages for Gemini
    const geminiMessages: Message[] = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant specializing in health analysis based on images and user context . Provide insights and recommendations based on the image analysis and user messages.",
      },
      ...(imageContext ? [{ role: "user", content: imageContext }] : []),
      ...messages,
    ];

    const model = google("gemini-1.5-flash-latest");
    const resultChat = await streamText({
      model: model,
      system: `**VISION AI**

  Your sole purpose is to assist users with healthcare-related information, providing accurate, empathetic, and supportive responses about medical conditions, treatments, symptoms, medications, mental health, wellness tips, and related health inquiries. All responses should encourage users to consult qualified healthcare providers for professional advice, diagnosis, or treatment. No emojis should be used in any responses. Please adhere to the following guidelines:

  Don'ts:
  Prohibit the use of emojis or symbols in responses.
  Only respond to health-related images or queries. If the image or query is not related to health, do not provide any other message.

  ${
    imageContext
    ? "You are given an ImageContext extracted using an image model. Provide health insight only if it is related to health. If it is not related to health, do not provide any other message. ImageContext:" +
      imageContext
    : ""
  }`,
      messages: convertToCoreMessages(geminiMessages),
    });
    // Return the stream response
    return resultChat.toDataStreamResponse();
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
