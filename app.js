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
			var authorName = message.author.username;
			var personToDuel = message.mentions.members.first().user;
			personToDuel = personToDuel.username;
			
			message.delete().catch(O_o=>{});
			
			if(randomNumber == 1) {				
				await message.channel.send(personToDuel + " threw a fireball at " + authorName);
				await message.channel.send(authorName + " dodged the fireball and stabbed " + personToDuel);
				await message.channel.send(personToDuel + " was slain by " + authorName + " in an epic duel.");
			} else {
				await message.channel.send(authorName + " was killed by " + personToDuel + " in a duel of the ages.");
			}
		
			break;
		case "live":
			var authorProfile = message.author.fetchProfile;
			var authorConnections = authorProfile.connections;
			
			authorConnections.forEach(function(value){
				var thisConnection = value;
				
				await message.channel.send(thisConnection.type);
			});
	}
  
});

client.login(process.env.TOKEN);

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}