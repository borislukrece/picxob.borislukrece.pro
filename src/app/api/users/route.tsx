import { NextRequest } from "next/server";
import { getUser } from "../../../libs/google-client";
import { TokenPayload } from "google-auth-library";

export async function GET(request: NextRequest) {
  try {
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

    const user: TokenPayload | null = await getUser(token);

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

    return Response.json(user);
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
