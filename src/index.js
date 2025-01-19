const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const colorManager = require('./utils/colorManager'); // 新增這行
const express = require('express');

const app = express();

app.get('/', (req, res) => {    
    console.log("uptimeRobot enter");
    res.send('color bot is running');
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

// 新增這段代碼來每30秒更換一次身份組顏色
client.once('ready', () => {
    console.log(`Bot已登入為 ${client.user.tag}`);
    
    setInterval(async () => {
        // 遍歷所有伺服器
        client.guilds.cache.forEach(async (guild) => {
            const role = guild.roles.cache.find(r => r.name === '自動更換'); // 替換為您的身份組名稱
            if (!role) {
                console.log(`在伺服器 ${guild.name} 中找不到指定身份組`);
                return;
            }

            const newColor = colorManager.getRandomColor();
            try {
                await role.setColor(newColor);
                console.log(`伺服器 ${guild.name} 中的身份組 ${role.name} 顏色已更改為 ${newColor}`);
            } catch (error) {
                console.error(`在伺服器 ${guild.name} 更改顏色時發生錯誤：`, error);
            }
        });
    }, 30000); // 30秒
});

// Login to Discord
client.login(config.token).then(() => {
    console.log(`Logged in as ${client.user.tag}!`);
}).catch(console.error);