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
			var authorName = message.author.tag;
			var personToDuel = message.mentions.members.first().tag;
			
			authorName = authorName.replace("@", "");
			personToDuel = personToDuel.replace("@", "");
			
			if(randomNumber == 1) {
				const m = await message.channel.send("...");
				m.edit(personToDuel + " threw a fireball at " + authorName);
				
				const m2 = await message.channel.send("...");
				m2.edit(authorName + " dodged the fireball and stabbed " + personToDuel);
				
				const m3 = await message.channel.send("...");
				m3.edit(personToDuel + " was slain by " + authorName + " in an epic duel.");
			} else {
				const m = await message.channel.send("Dueling...");
				m.edit(authorName + " was killed by " + personToDuel + " in a duel of the ages.");
			}
			
			
			message.delete().catch(O_o=>{});
		
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