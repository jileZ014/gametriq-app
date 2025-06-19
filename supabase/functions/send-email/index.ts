export const handler = async (_req: Request): Promise<Response> => {
  return new Response("✅ Supabase function is working!", {
    headers: { "Content-Type": "text/plain" },
  });
};

export default handler;
