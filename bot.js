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
    console.log("\x1b[35m\x1b[1m[join]\x1b[0m " + member.user.tag);
    member.send("Hello! We are glad you joined our Cult! \nPlease read the rules in the #rules channel. You'll also find instructions on how to gain access to the server there.\n\nThanks and have fun! :)").then(m => {
        let URLembed = new Discord.RichEmbed()
            .setTitle("(Link to the #rules channel)")
            .setURL("https://discordapp.com/channels/430932202621108275/528717576357019648");
        member.send(URLembed);
    });
    member.addRole(addRole_newcomer);
});

client.on("guildMemberRemove", member => {
    console.log("\x1b[31m\x1b[1m[leave]\x1b[0m " + member.user.tag);
    var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
    return botLogs.send(`❌ \`${member.user.tag}\` has left the server`);
});

client.on("message", message => {
    if(message.author.bot && message.channel.id === '528717576357019648' && message.author.id != '532483662705590273') return message.delete();
    if(message.author.bot) return;
    var perms = message.member.roles.find(role => role.name == "user++") || message.member.roles.find(role => role.name == "Rot13")  || message.member.roles.find(role => role.name == "Arbiter of Fate");
	

    if (message.channel.id === '528717576357019648') {
		if (message.content == "!agree") {
            console.log("\x1b[32m\x1b[1m[agree]\x1b[0m " + message.author.tag);
            message.react("✅").then(m => message.delete(3000));
            let removeRole_newcomer = message.member.guild.roles.find(role => role.name == "newcomer");
            message.member.send("Great, you made it :smiley:\n\nYou now have access to the entire server! \n Please read the #info channel completely as there's important information there.\nAlso tell us a bit more about yourself, your programming skills and why you joined the server.\n(Doing this will give you a few perks)").then(m => {
                let URLembed = new Discord.RichEmbed()
                    .setTitle("(Link to the #introduce-yourself channel)")
                    .setURL("https://discordapp.com/channels/430932202621108275/430970251174215690");
                message.member.send(URLembed).then(m => {
                    message.member.send("\n\nThank you and have fun, your mod team :)");
                }).catch(err => message.member.send("Thank you, your mod team :)"));
            }).catch(err => {});
            
            message.member.removeRole(removeRole_newcomer);
			var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
            return botLogs.send(`👍 \`${message.author.tag}\` has agreed to the <#528717576357019648>`);
        }
        else if(message.content == "!ping") {
            message.channel.send("📶 Pong!").then(m => {
                message.delete();
                setTimeout(()=>{
                    m.delete();
                }, 3000);
            });
        }
        else {
            if (perms) {
				var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
				if(message.content == "!restart") botLogs.send(`♻ \`${message.author.tag}\` just restarted me`).then(m => {
					message.delete().then(r => {
						console.log("\x1b[31m\x1b[1m[restart]\x1b[0m " + message.author.tag);
						return process.exit(2);
					}).catch(err => console.log("err! " + err));
				}).catch(err => console.log("err2! " + err));
				else return;
			}
            else return message.delete();
        }
    }

    var isbadword = false;
    for (var i in filter) {
        if (message.content.toLowerCase().includes(filter[i].toLowerCase())) isbadword = true;
    }
    if(isbadword) {
        message.channel.send(message.member + " do you kiss your mother with that mouth?");
        message.delete().then(m => {
            var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
            let embed = new Discord.RichEmbed()
                .setTitle(`❗ Potentially bad message by \`${message.author.tag}\`:`)
                .addField("Channel:", `<#${message.channel.id.toString()}>`, false)
                .addBlankField()
                .addField("Content:", `\`\`\`\n${message.content}\n\`\`\``, false)
                .setFooter(new Date().toUTCString());

            return botLogs.send(embed);
        });
    }
});

client.login(config.token);