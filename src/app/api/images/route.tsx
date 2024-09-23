import fs from "fs";
import path from "path";
import { Gallery } from "@/utils/interface";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "data", "images.json");

    let data: Gallery[] = [];
    if (fs.existsSync(dataPath)) {
      if (fs.readFileSync(dataPath, "utf8").length > 0) {
        data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      } else {
        data = [];
      }
    }

    return Response.json({
      statusCode: 200,
      message: "Images retrieved successfully",
      data: { images: data },
    });
  } catch (error) {
    return Response.json({ error: `Failed to get images: ${error}` });
  }
}
