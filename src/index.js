const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const colorManager = require('./utils/colorManager');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Express 路由
app.get('/', (req, res) => {    
    console.log("uptimeRobot enter");
    res.send('color bot is running');
});

// 啟動 Express 服務器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Discord 客戶端設置
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
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

// Bot 就緒事件
client.once('ready', () => {
    console.log(`Bot已登入為 ${client.user.tag}`);
    // 定期更新顏色
    setInterval(() => {
        colorManager.updateColors(client);
    }, 30000); // 每30秒執行一次
});

// 錯誤處理
client.on('error', error => {
    console.error('Discord client error:', error);
});

// 登入 Bot
client.login(config.token);

// 優雅關閉
process.on('SIGINT', () => {
    console.log('正在關閉 Bot...');
    client.destroy();
    process.exit(0);
});