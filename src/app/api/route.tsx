export async function GET() {
  return Response.json({
    app_name: process.env.NEXT_PUBLIC_APP_NAME,
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}
