const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  client.user.setActivity('teamoverpowered.com');
});

client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// COMMANDS
	switch(command) {	
		case "duel":
			const m = await message.channel.send("Dueling...");
			m.edit(message.mentions.members.first().nickname + " was slain by " + message.author.nickname);
			break;
		default:
			await message.channel.send("This command is not recognized.");
			break;
	}
  
});

client.login(process.env.TOKEN);