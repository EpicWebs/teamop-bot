const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

// Points system
const Enmap = require('enmap');

const EnmapPGSql = require('enmap-pgsql');
const pointProvider = new EnmapPGSql({name: "points", connectionString: process.env.DATABASE_URL,});
client.points = new Enmap({provider: pointProvider});

client.on("ready", () => {
	client.user.setActivity('teamoverpowered.com');
});

client.on("guildMemberAdd", (member) => {
	const guild = member.guild;
	const defaultChannel = guild.defaultChannel;

	defaultChannel.send("Welcome to TeamOP " + member.displayName + "!");
});

client.on('presenceUpdate', (oldMember, newMember) => {
	const memberLevel = getMemberLevel(client, newMember);
	const highestRole = newMember.highestRole;
	const thisGuild = newMember.guild;
	const liveRole = thisGuild.roles.find("name", "Live Now");

	if(memberLevel > 4 && highestRole.name != "Legendary") {
		if(newMember.presence !== null) {
			if(newMember.presence.game !== null) {
				if(newMember.presence.game.streaming !== null) {
					newMember.addRole(liveRole);
				} else {
					newMember.removeRole(liveRole);
				}
			}
		}
	}
});

client.on("message", async message => {
	if(message.author.bot) return;

	pointsMonitor(client, message);
	botPersonality(client, message);

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
					title: "teamoverpowered.com",
					url: "https://www.teamoverpowered.com/",
					description: "Commands and help information for using TeamOPBot.",
					timestamp: new Date(),
					fields: [{
						name: "Commands",
						value: "**/say** : use /say message to make TeamOPBot say something.\n**/live** : Takes your discord username and appends it to twitch.tv to create a link, only works if your discord and twitch username match.\n**/duel** : Use /duel @mention to duel someone in discord, the winner will be decided randomly.\n**/xp** : Use /xp to see how much xp you have earned on the server.\n**/level** : Use /level to see what level you currently are on the server."
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
		case "teamopbotsucks":
			message.channel.send("I think you mean Realdawnseeker sucks.");

			break;
		case "live":
			var authorUsername = message.author.username;
			await message.channel.send(authorUsername + " is currently live at https://www.twitch.tv/" + authorUsername);

			break;
		case "xp":
			// POINTS COMMAND
			const scorePoints = client.points.get(message.author.id).points;
			!scorePoints ? message.channel.send(message.author.username + ' has no xp yet.') : message.channel.send(message.author.username + ` has ${scorePoints} xp!`);

			break;
		case "level":
			// LEVEL COMMAND
			const scoreLevel = client.points.get(message.author.id).level;
			!scoreLevel ? message.channel.send(message.author.username + ' has no levels yet.') : message.channel.send(message.author.username + ` is currently level ${scoreLevel}!`);
			
			break;
		default:
			message.channel.send("I do not know that command, use /help for commands you can use!");

			break;
	}
  
});

client.login(process.env.TOKEN);

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function pointsMonitor(client, message) {
	if (message.channel.type !=='text') return;
	if (message.content.startsWith(config.prefix)) return;

	const score = client.points.get(message.author.id) || { points: 0, level: 0 };
	score.points++

	const curLevel = calculateMemberLevel(score.points);

	if (score.level < curLevel) {
		message.reply(`You've leveled up to level **${curLevel}**, you're getting OP!`);
		score.level = curLevel;
	}

	client.points.set(message.author.id, score);
};

function getMemberLevel(client, member) {
	const score = client.points.get(member.id) || { points: 0, level: 0 };
	const curLevel = calculateMemberLevel(score.points);
	const rareRole = member.guild.roles.find("name", "Rare");

	if (curLevel > 4) {
		member.addRole(rareRole);
	}

	return curLevel;
}

function calculateMemberLevel(points) {
	const level = Math.floor(points / 100);
	return level;
}

function botPersonality(client, message) {
	if (message.channel.type !=='text') return;
	if (message.content.startsWith(config.prefix)) return;

	switch (true) {
		case messageTextContains(message,"teamopbot"):
			message.reply('Did you call me?');
			break;
		case messageTextContains(message,"is anyone streaming tonight"):
			message.reply('Not me!');
			break;
		case messageTextContains(message,"i love you"):
			message.reply('Do you love me?');
			break;
	}
}

function messageTextContains(message,text) {
	var messageText = message.content.toLowerCase();
	var searchText = text.toLowerCase();

    return messageText.includes(searchText);
}