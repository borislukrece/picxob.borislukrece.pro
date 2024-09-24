import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { image, prompt } = await request.json();

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

    const data = {
      name: uri,
      prompt: prompt && prompt !== undefined ? prompt : null,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_ENDPOINT}/images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_DB_ACCESS_TOKEN,
          },
          body: JSON.stringify(data),
        }
      );

      const { image } = await response.json();

      return Response.json({
        statusCode: 200,
        message: "Image saved",
        data: { uri, image },
      });
    } catch (error) {
      return Response.json(
        { message: `Failed to save uri`, error: error },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    return Response.json(
      { message: `Failed to upload image`, error: error },
      {
        status: 500,
      }
    );
  }
}
