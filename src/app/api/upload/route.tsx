import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import crypto from "crypto";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image || image === undefined) {
      return Response.json(
        {
          statusCode: 400,
          message: "Invalid request. Image data is required.",
        },
        {
          status: 400,
        }
      );
    }

    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${image}`,
      {
        resource_type: "auto",
        upload_preset: "ml_default",
      }
    );

    const uri = uploadResponse.secure_url;

    const token = crypto.randomBytes(16).toString("hex");
    const imageData = { token, name: uri, date: new Date().toISOString() };
    const dataPath = path.join(process.cwd(), "data", "images.json");
    let data = null;
    if (fs.existsSync(dataPath)) {
      if (fs.readFileSync(dataPath, "utf8").length > 0) {
        data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      } else {
        data = [];
      }
      data.push(imageData);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }

    return Response.json({
      statusCode: 200,
      message: "Image saved",
      data: { uri, image: imageData },
    });
  } catch (error) {
    return Response.json(
      { message: `Failed to upload image`, error: error },
      {
        status: 500,
      }
    );
  }
}
