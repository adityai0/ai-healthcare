import { ImageAnnotatorClient } from "@google-cloud/vision";

const CONFIG = {
  credentials: {
    client_email: process.env.VISION_CLIENT_EMAIL,
    private_key: process.env.VISION_PRIVATE_KEY.split(String.raw`\n`).join(
      "\n"
    ),
  },
};

const client = new ImageAnnotatorClient(CONFIG);

export async function getImageLabels(imageBuffer: Buffer) {
  try {
    const [result] = await client.labelDetection(imageBuffer);
    const labels = result.labelAnnotations;
    return labels?.map((label) => label.description) || [];
  } catch (error) {
    console.error("Error in getImageLabels:", error);
    throw new Error("Failed to detect labels");
  }
}

export async function getImageText(imageBuffer: Buffer) {
  try {
    const [result] = await client.textDetection(imageBuffer);
    const detections = result.textAnnotations;
    return detections?.[0]?.description || "";
  } catch (error) {
    console.error("Error in getImageText:", error);
    throw new Error("Failed to detect text");
  }
}
