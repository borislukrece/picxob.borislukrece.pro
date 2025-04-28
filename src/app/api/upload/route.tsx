import cloudinary from "@/libs/cloudinary-client";

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

    return Response.json({
      statusCode: 200,
      message: "Image saved",
      data: { uri },
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
