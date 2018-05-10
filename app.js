const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const sql = require("sqlite");
sql.open("./score.sqlite");

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
	if(message.channel.type === "dm") return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
		if (!row) {
		 	sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
		} else {
			let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));

			if (curLevel > row.level) {
				row.level = curLevel;
				sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
				message.reply(`You've leveled up to level **${curLevel}**! Getting OP!!`);
			}

		  	sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
		}
	}).catch(() => {
		console.error;
		sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
			sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
		});
	});
	
	if(message.content.indexOf(config.prefix) !== 0) return;

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
			sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
				if (!row) return message.reply("Your current points are 0");
				message.reply(`Your current points are ${row.points}`);
			}).catch(() => {
				console.error;
			});

			break;
		case "level":
			sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
				if (!row) return message.reply("Your current level is 0");
				message.reply(`Your current level is ${row.level}`);
			}).catch(() => {
				console.error;
			});

			break;
	}
  
});

client.login(process.env.TOKEN);

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}