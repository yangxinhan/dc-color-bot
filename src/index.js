const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const colorManager = require('./utils/colorManager');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

// Express 路由
app.get('/', (req, res) => {
    res.send('Discord bot is running!');
});

// 啟動 Express 伺服器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ] 
});

// 讀取命令
client.commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// 讀取事件
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, event.execute.bind(null, client));
}

// 讀取設定檔
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')));

client.once('ready', () => {
    console.log(`Bot已登入為 ${client.user.tag}`);
    
    setInterval(async () => {
        // 遍歷所有伺服器
        client.guilds.cache.forEach(async (guild) => {
            const role = guild.roles.cache.find(r => r.name === '七彩霓虹燈'); // 替換為您的身份組名稱
            if (!role) {
                console.log(`在伺服器 ${guild.name} 中找不到指定身份組`);
                return;
            }

            // 檢查 Bot 是否有管理角色權限
            const botMember = guild.members.cache.get(client.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                console.log(`Bot 在 ${guild.name} 中缺少管理角色權限`);
                return;
            }

            // 檢查 Bot 角色位置是否高於目標角色
            const botRole = botMember.roles.highest;
            if (botRole.position <= role.position) {
                console.log(`Bot 角色位置必須高於目標角色 - ${guild.name}`);
                return;
            }

            const newColor = colorManager.getRandomColor();
            try {
                await role.setColor(newColor);
                console.log(`成功更新 ${guild.name} 的角色顏色`);
            } catch (error) {
                console.error(`更新顏色失敗 ${guild.name}:`, error.message);
            }
        });
    }, 30000); // 30秒 30000毫秒
});

// Login to Discord
client.login(config.token).then(() => {
    console.log(`Logged in as ${client.user.tag}!`);
}).catch(console.error);