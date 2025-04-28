import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const entries = parseInt(searchParams.get("entries") || "50");
    const offset = (page - 1) * entries;

    const [images, totalCount] = await Promise.all([
      prisma.images.findMany({
        orderBy: { createdAt: 'desc' },
        take: entries,
        skip: offset,
        select: {
          id: false,
          sub: false,
          prompt: false,
          uri: true,
          token: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.images.count()
    ]);

    if (!images.length) {
      return Response.json({
        totalPage: 0,
        images: [],
      });
    }

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
