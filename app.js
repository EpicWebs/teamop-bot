const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  client.user.setActivity('Serving TeamOP');
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // COMMANDS
  if(command === "duel") {	
    const m = await message.channel.send("Dueling...");
    m.edit("pMauz was slain by " + message.author);
  }
  
});

client.login(process.env.TOKEN);