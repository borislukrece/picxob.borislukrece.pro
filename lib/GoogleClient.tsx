import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function getUser(token: string) {
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

  return user;
}
