import { NextRequest } from "next/server";
import { get } from "../../../../backend/config/database";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const entries = parseInt(searchParams.get("entries") || "50");
    const offset = (page - 1) * entries;

    let images = await get([
      "SELECT * FROM images ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [entries, offset],
    ]);

    if (!(Array.isArray(images) && images.length > 0)) {
      return Response.json({
        totalPage: 0,
        images: [],
      });
    }

    images = images.map((i) => {
      i.id = null;
      i.prompt = null;
      i.sub = null;
      return i;
    });

    const totalImages = await get("SELECT COUNT(*) AS count FROM images");
    const totalCount = Array.isArray(totalImages) ? totalImages[0].count : 0;
    const totalPage = Math.ceil(totalCount / entries);

    return Response.json({
      totalPage,
      images,
    });
  } catch (error) {
    const err = error as Error;
    return Response.json(
      { message: `Failed to get images`, error: err.message },
      {
        status: 500,
      }
    );
  }
}
