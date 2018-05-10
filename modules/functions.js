module.exports = (client) => {
	client.pointsMonitor = (client, message) => {
        if (message.channel.type !=='text') return;
        if (message.content.startsWith(config.prefix)) return;

        const score = client.points.get(message.author.id) || { points: 0, level: 0 };
        score.points++

        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));

        if (score.level < curLevel) {
            message.reply(`You've leveled up to level **${curLevel}**, you're getting OP!`);
            score.level = curLevel;
        }

        client.points.set(message.author.id, score);
    };
};