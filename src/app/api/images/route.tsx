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
        date:
          stats.mtime.toISOString().split("T")[0] +
          " " +
          stats.mtime.toISOString().split("T")[1].split(".")[0], // YYYY-MM-DD H:i:s
      };
    });

    // eslint-disable-next-line
    images.sort((a, b) => new Date(b.date) - new Date(a.date));

    return Response.json({
      statusCode: 200,
      message: "Image saved",
      data: {
        images,
      },
    });
  } catch (error) {
    return Response.json({ error: `Failed to get images: ${error}` });
  }
}
