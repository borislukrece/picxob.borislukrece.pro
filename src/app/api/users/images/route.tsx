import { NextRequest } from "next/server";
import { get } from "../../../../../backend/config/database";

import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    let images = await get([
      "SELECT * FROM images WHERE sub = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [user.sub, entries, offset],
    ]);

    if (!(Array.isArray(images) && images.length > 0)) {
      return Response.json({
        totalPage: 0,
        images: [],
      });
    }

    images = images.map((i) => {
      i.id = null;
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
