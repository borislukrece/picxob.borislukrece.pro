import { NextRequest } from "next/server";
import { getUser } from "../../../../lib/GoogleClient";
import { TokenPayload } from "google-auth-library";
import { generateUUID } from "@/utils/helpers";
import { post } from "../../../../backend/config/database";
import { Buffer } from "buffer";
import cloudinary from "../../../../lib/Cloudinary";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json({ error: "No prompt provided" });
    }

    const authorization = request.headers.get("Authorization");
    const token = authorization?.split(" ")[1] || "";

    const user: TokenPayload | null = await getUser(token);

    const sub = user ? user.sub : null;
    const uuid = generateUUID();
    const cleanedPrompt = prompt.trim().substring(0, 880);

    const IAResponse = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!IAResponse.ok) {
      const errorText = await IAResponse.text();
      throw new Error(
        `HTTP error! status: ${IAResponse.status}, message: ${errorText}`
      );
    }

    const BlobResponse = await IAResponse.blob();

    const base64data: string = await new Promise((resolve, reject) => {
      const reader = new Response(BlobResponse).arrayBuffer();

      reader
        .then((buffer) => {
          const base64data = Buffer.from(buffer).toString("base64");
          resolve(base64data);
        })
        .catch(() => {
          reject(new Error("Error reading the file."));
        });
    });

    const uploadToCloudinary = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64data}`,
      {
        resource_type: "auto",
        upload_preset: "ml_default",
      }
    );

    const uri = uploadToCloudinary.secure_url;

    const data = {
      sub: sub,
      token: uuid,
      uri: uri,
      prompt: cleanedPrompt,
    };

    const image = await post(
      [
        "INSERT INTO images (sub, uri, prompt, token) VALUES (?, ?, ?, ?)",
        [data.sub, data.uri, data.prompt, data.token],
      ],
      "images"
    );

    if (image) {
      return Response.json({ image }, { status: 201 });
    } else {
      throw new Error("An unexpected error occurred while saving the image");
    }
  } catch (error) {
    const err = error as Error;
    return Response.json(
      { message: `Failed to send message`, error: err.message },
      {
        status: 500,
      }
    );
  }
}
