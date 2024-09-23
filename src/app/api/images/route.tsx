import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public/images");
    const files = fs.readdirSync(imagesDir);

    const images = files.map((file) => {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        date: stats.mtime.toISOString(),
      };
    });

    images.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return Response.json({
      statusCode: 200,
      message: "Images retrieved successfully",
      data: {
        images,
      },
    });
  } catch (error) {
    return Response.json({ error: `Failed to get images: ${error}` });
  }
}
