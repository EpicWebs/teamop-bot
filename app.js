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
		case "help":
			await message.channel.send({embed:
				{
					color: 0xff6d00,
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL,
					},
					title: "TeamOP Bot Help",
					url: "https://www.teamoverpowered.com/",
					description: "Commands and help for the TeamOP bot.",
					timestamp: new Date(),
					fields: [{
						name: "Commands",
						value: "**/live** : Takes your discord username and appends it to twitch.tv to create a link, only works if your discord and twitch username match.\n**/duel** : Use /duel @mention to duel someone in discord, the winner will be decided randomly!"
					},
					],
					footer: {
						text: "TeamOP Bot",
					}
				}
			});
		case "duel":
			var randomNumber = randomIntFromInterval(1,2);
			var authorName = message.author.username;
			var personToDuel = message.mentions.members.first().user;
			personToDuel = personToDuel.username;
			
			message.delete().catch(O_o=>{});
			
			if(randomNumber == 1) {				
				await message.channel.send({embed:
					{
						color: 0xff6d00,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: authorName + " vs " + personToDuel,
						timestamp: new Date(),
						fields: [{
							name: "Duel commencing...",
							value: personToDuel + " threw a fireball at " + authorName + ".\n" + authorName + " dodged the fireball and stabbed " + personToDuel + ".\n" + personToDuel + " was slain by " + authorName + " in an epic duel."
						},
						],
					}
				});

			} else {
				await message.channel.send({embed:
					{
						color: 0xff6d00,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: authorName + " vs " + personToDuel,
						timestamp: new Date(),
						fields: [{
							name: "Duel commencing...",
							value: authorName + " was shot in the knee by " + personToDuel + ".\n" + authorName + " was killed by " + personToDuel + " in a duel of the ages."
						},
						],
					}
				});
			}
		
			break;
		case "live":
			var authorUsername = message.author.username;
			await message.channel.send(authorUsername + " is currently live at https://www.twitch.tv/" + authorUsername);
	}
  
});

client.login(process.env.TOKEN);

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}