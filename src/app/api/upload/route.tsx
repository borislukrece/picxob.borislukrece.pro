import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { imageBlob } = await request.json();

    const randomName = crypto.randomBytes(16).toString("hex") + ".jpeg";
    const filePath = path.join(process.cwd(), "public", "images", randomName);

    fs.writeFileSync(filePath, Buffer.from(imageBlob, "base64"));

    const uri = `${process.env.NEXT_PUBLIC_APP_URL}/images/${randomName}`;

    return Response.json({
      statusCode: 200,
      message: "Image saved",
      data: { filePath, uri },
    });
  } catch (error) {
    return Response.json({ error: `Failed to save image: ${error}` });
  }
}
