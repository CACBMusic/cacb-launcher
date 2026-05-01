import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {

  // 👇 IMPORTANTE: solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing data" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      token: data.session.access_token
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
