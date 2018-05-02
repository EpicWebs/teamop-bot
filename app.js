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
			var randomNumber = randomIntFromInterval(1,2);
			
			if(randomNumber == 1) {
				const m = await message.channel.send("...");
				m.edit(message.mentions.members.first().toString() + " threw a fireball at " + message.author.toString());
				
				const m2 = await message.channel.send("...");
				m2.edit(message.author.toString() + " dodged the fireball and stabbed " + message.mentions.members.first().toString());
				
				const m3 = await message.channel.send("...");
				m3.edit(message.mentions.members.first().toString() + " was slain by " + message.author.toString() + " in an epic duel.");
			} else {
				const m = await message.channel.send("Dueling...");
				m.edit(message.author.toString() + " was killed by " + message.mentions.members.first().toString() + " in a duel of the ages.");
			}
		
			break;
		default:
			await message.channel.send("This command is not recognized.");
			break;
	}
  
});

client.login(process.env.TOKEN);

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}