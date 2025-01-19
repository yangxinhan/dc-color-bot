module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        // 可以在這裡執行其他初始化任務
    },
};