const { MessageEmbed } = require('discord.js');
const colorManager = require('../utils/colorManager');

module.exports = {
    name: 'color',
    description: '更改身份組顏色',
    async execute(message, args) {
        const role = message.guild.roles.cache.find(r => r.name === args[0]);
        if (!role) {
            return message.reply('找不到該身份組。請確保您輸入的名稱正確。');
        }

        const newColor = args[1];
        if (!colorManager.isValidColor(newColor)) {
            return message.reply('請提供有效的顏色格式，例如 HEX 或 RGB。');
        }

        try {
            await role.setColor(newColor);
            const embed = new MessageEmbed()
                .setColor(newColor)
                .setTitle('身份組顏色已更改')
                .setDescription(`身份組 **${role.name}** 的顏色已更改為 ${newColor}`);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('無法更改身份組顏色。請檢查我的權限。');
        }
    },
};