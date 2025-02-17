import { NextRequest, NextResponse } from "next/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";

// Initialize the Google Cloud Vision client
let visionClient: ImageAnnotatorClient | null = null;

try {
  visionClient = new ImageAnnotatorClient({
    credentials: {
      client_email: process.env.VISION_CLIENT_EMAIL,
      private_key: process.env.VISION_PRIVATE_KEY
        ? process.env.VISION_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    },
  });
} catch (error) {
  console.error("Failed to initialize Vision client:", error);
}

export async function POST(req: NextRequest) {
  try {
    if (!visionClient) {
      throw new Error("Vision client is not initialized");
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Analyze image with Google Cloud Vision API
    const [result] = await visionClient.annotateImage({
      image: { content: buffer },
      features: [
        { type: "LABEL_DETECTION" },
        { type: "TEXT_DETECTION" },
        { type: "FACE_DETECTION" },
        { type: "OBJECT_LOCALIZATION" },
      ],
    });

    const labels =
      result.labelAnnotations?.map((label) => label.description).join(", ") ||
      "";
    const text = result.textAnnotations?.[0]?.description || "";
    const faces = result.faceAnnotations?.length || 0;
    const objects =
      result.localizedObjectAnnotations?.map((obj) => obj.name).join(", ") ||
      "";

    // Prepare context for Gemini
    const imageContext = `Image analysis:
    Labels: ${labels}
    Text detected: ${text}
    Faces detected: ${faces}
    Objects detected: ${objects}`;

    return NextResponse.json({ imageContext });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}