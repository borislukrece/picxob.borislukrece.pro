import { NextRequest } from "next/server";
import { client } from "@/libs/google-client";
import { TokenPayload } from "google-auth-library";
import prisma from "@/libs/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const authorization = request.headers.get("Authorization");
    const token = authorization?.split(" ")[1];

    if (!token) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user: TokenPayload | null = await new Promise(async (resolve) => {
      try {
        const ticket = await client.verifyIdToken({
          idToken: token || "",
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const user = ticket.getPayload();

        if (user && user !== undefined) {
          resolve(user);
        } else {
          resolve(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        resolve(null);
      }
    });

    if (!user) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const page = parseInt(searchParams.get("page") || "1");
    const entries = parseInt(searchParams.get("entries") || "50");
    const offset = (page - 1) * entries;

    const [images, totalCount] = await Promise.all([
      prisma.images.findMany({
        where: { sub: user.sub },
        orderBy: { createdAt: 'desc' },
        take: entries,
        skip: offset,
        select: {
          id: false,
          sub: true,
          uri: true,
          prompt: true,
          token: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.images.count({
        where: { sub: user.sub }
      })
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
