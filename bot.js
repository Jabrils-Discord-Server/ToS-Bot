const Discord = require('discord.js')
const client = new Discord.Client();
const config = require("./config.json");
var filter = require("./filter.js");

client.on("ready", () => {
	console.log(`\n\n\n\x1b[36m\x1b[1m[startup]\x1b[0m John has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Abusing the Non-Mods`);
});

client.on('guildMemberAdd', member => {
    let addRole_newcomer = member.guild.roles.find(role => role.name == "newcomer");
    console.log(member.username + "has joined the server!");
    member.sendMessage("Hello! Im glad you joined our Cult! \nPlease read the rules in the #rules channel and if you agree to our rules, type `!agree` in that same channel to gain access to the server.\n\nThanks and have fun! :)");
    member.addRole(addRole_newcomer);
});

client.on("message", message => {
    if(message.author.bot) return;
    var perms = message.member.roles.find(role => role.name == "user++") || message.member.roles.find(role => role.name == "Rot13")  || message.member.roles.find(role => role.name == "Arbiter of Fate");

    if (message.channel.id === '528717576357019648') {
        if (message.content == "!agree") {
			console.log("\x1b[32m\x1b[1m[agree]\x1b[0m " + message.author.tag);
            message.delete();
            let removeRole_newcomer = message.member.guild.roles.find(role => role.name == "newcomer");
            message.member.sendMessage("Great, you made it! You can go over to #introduce-yourself and tell us a bit about yourself, your coding skill and your goals! \n Please read the #info completely! It is very important!");
            message.member.removeRole(removeRole_newcomer);
            return;
        }
        else {
            if (perms) {
				console.log("\x1b[31m\x1b[1m[restart]\x1b[0m " + message.author.tag);
				if(message.content == "!restart") message.delete().then(m=>process.exit(2));
				else return;
			}
            return message.delete();
        }
    }

    for (var i in filter) {
        if (message.content.toLowerCase().includes(filter[i].toLowerCase())) {
            message.channel.send(message.member + " Do you kiss your mother with that mouth?");
            message.delete();
            return;
        }
    }
});

client.login(config.token);
