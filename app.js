const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

// Points system
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const pointProvider = new EnmapLevel({name: "points"});
this.points = new Enmap({provider: pointProvider});

client.on("ready", () => {
  client.user.setActivity('teamoverpowered.com');
});

client.on("guildMemberAdd", (member) => {
	const guild = member.guild;
	newUsers.set(member.id, member.user);
  
	if (newUsers.size > 0) {
		const defaultChannel = guild.defaultChannel;
		const userlist = newUsers.map(u => u.toString()).join(" ");
		defaultChannel.send("Welcome to TeamOP " + userlist + "!");
		newUsers.clear();
	}
});

client.on("message", async message => {
	if(message.author.bot) return;
	pointsMonitor(client, message);

	if(message.content.indexOf(config.prefix) !== 0) return;
	if(message.channel.type === "dm") return;

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

			break;
		case "duel":
			var randomNumber = randomIntFromInterval(1,2);
			var authorName = message.author.username;
			var personToDuel = message.mentions.members.first().user;
			personToDuel = personToDuel.username;
			
			//message.delete().catch(O_o=>{});
			
			if(randomNumber == 1) {				
				await message.channel.send({embed:
					{
						color: 0xff6d00,
						title: "Duel commencing...",
						fields: [{
							name: authorName + " vs " + personToDuel,
							value: personToDuel + " threw a fireball at " + authorName + ". \n" + authorName + " dodged the fireball and stabbed " + personToDuel + ". \n" + personToDuel + " was slain by " + authorName + " in an epic duel. \n**Winner: " + authorName + "**"
						},
						],
					}
				});

			} else {
				await message.channel.send({embed:
					{
						color: 0xff6d00,
						title: "Duel commencing...",
						fields: [{
							name: authorName + " vs " + personToDuel,
							value: authorName + " was shot in the knee by " + personToDuel + ". \n" + authorName + " was killed by " + personToDuel + " in a duel of the ages. \n**Winner: " + personToDuel + "**"
						},
						],
					}
				});
			}
		
			break;
		case "say":
			const sayMessage = args.join(" ");

			message.delete().catch(O_o=>{});
			message.channel.send(sayMessage);

			break;
		case "live":
			var authorUsername = message.author.username;
			await message.channel.send(authorUsername + " is currently live at https://www.twitch.tv/" + authorUsername);

			break;
		case "points":
			message.delete().catch(O_o=>{});

			// POINTS COMMAND
			const scorePoints = client.points.get(message.author.id).points;
			!scorePoints ? message.channel.send('You have no points yet.') : message.channel.send(`You have ${scorePoints} points!`);

			break;
		case "level":
			message.delete().catch(O_o=>{});

			// LEVEL COMMAND
			const scoreLevel = client.points.get(message.author.id).level;
			!scoreLevel ? message.channel.send('You have no levels yet.') : message.channel.send(`You are currently level ${scoreLevel}!`);
			
			break;
	}
  
});

client.login(process.env.TOKEN);

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function pointsMonitor(client, message) {
	if (message.channel.type !=='text') return;
	if (message.content.startsWith("/")) return;

	const score = client.points.get(message.author.id) || { points: 0, level: 0 };
	score.points++

	const curLevel = Math.floor(0.1 * Math.sqrt(score.points));

	if (score.level < curLevel) {
		message.reply(`You've leveled up to level **${curLevel}**, you're getting OP!`);
		score.level = curLevel;
	}

	client.points.set(message.author.id, score);
};