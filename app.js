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
				m.edit(String(message.mentions.members.first() + " threw a fireball at " + String(message.author));
				
				const m2 = await message.channel.send("...");
				m2.edit(String(message.author) + " dodged the fireball and stabbed " + String(message.mentions.members.first()) );
				
				const m3 = await message.channel.send("...");
				m3.edit(String(message.mentions.members.first() + " was slain by " + String(message.author) + " in an epic duel.");
			} else {
				const m = await message.channel.send("Dueling...");
				m.edit(String(message.author) + " was killed by " + String(message.mentions.members.first() + " in a duel of the ages.");
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