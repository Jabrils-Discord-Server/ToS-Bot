const Discord = require('discord.js');
const jsl = require("svjsl");
const client = new Discord.Client();
const config = require("./config.json");
const filter = require("./filter.js");
const newcomerCheck = require("./newcomerCheck.js");

const randomActivities = ["Abusing the Non-Mods", "Pruning all the newcomers", "Kissing your mother with that mouth", "Banning @everyone", "Secretly overthrowing the admins"];

const iconURL = "https://sv443.net/cdn/other/tosboticon.png";

function randomActivity() {
    let rand = jsl.randRange(0, (randomActivities.length - 1));
    client.user.setActivity(randomActivities[rand]);
}


client.on('error', (err) => {
    console.log("\n\n    \x1b[31m\x1b[1m[Client Error]: \x1b[0m" + err.message)
});


client.on("ready", () => {
    console.log(`\n\n\n\x1b[36m\x1b[1m[startup]\x1b[0m John has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    randomActivity();
    setInterval(()=>randomActivity(), 15 * 60 * 1000); // every 15 mins

    newcomerCheck.checkNewcomers(client.guilds.find(guild => guild.id == "430932202621108275"));
    setInterval(()=>{
        newcomerCheck.checkNewcomers(client.guilds.find(guild => guild.id == "430932202621108275"));
    }, 20 * 60 * 1000); // every 20 mins

    client.user.setAvatar(iconURL).catch(err => {});
});

client.on('guildMemberAdd', member => {
    let addRole_newcomer = member.guild.roles.find(role => role.name == "newcomer");
    console.log("\x1b[35m\x1b[1m[join]\x1b[0m " + member.user.tag);
    newcomerCheck.addNewcomer(member.id);
    
    var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
    botLogs.send(`▶ \`${member.user.tag}\` has joined the server`);
    member.send("Hello! We are glad you joined our Cult! \nPlease read the rules in the #rules channel. You'll also find instructions on how to gain access to the server there.\n\nThanks and have fun! :)").then(m => {
        let URLembed = new Discord.RichEmbed()
            .setTitle("(Link to the #rules channel)")
            .setURL("https://discordapp.com/channels/430932202621108275/528717576357019648");
        member.send(URLembed).catch(err => {});
    });
    member.addRole(addRole_newcomer);

    let superUsers = client.channels.find(channel => channel.id == "489599094793175041");
    let banReason = "userbot";
    if(member.user.tag.toString().match(/[a-zA-Z]{2,}[0-9]{2,}#[0-9]{4}|[a-zA-Z]{2,}[0-9]{2,}[a-zA-Z]{2,}#[0-9]{4}/gm) && member.user.avatarURL == null) superUsers.send(member.user + " just joined the server and they are probably a user bot!\nClick the banhammer reaction within twelve hours to ban them!").then(msg => {
        msg.react("500792756281671690").then(r => {
            var filter = (reaction, user) => {
                return ['500792756281671690'].includes(reaction.emoji.id) && !user.bot;
            };
            msg.awaitReactions(filter, { max: 1, time: (12 * 60 * 60 * 1000), errors: ['time'] }).then(r => {
                if(r.first().emoji.id == "500792756281671690") {
                    var reactUser = r.first();
                    try {
                        member.ban({
                            reason: banReason
                        }).then(r => {
                            msg.delete();
                            return msg.channel.send(`✅ Successfully banned ${member.user} with reason \`${banReason}\`!`);
                        }).catch(err => {
                            return msg.channel.send(`‼ Couldn't ban ${member.user} due to error: ${err}`);
                        });
                    }
                    catch(err) {
                        return msg.channel.send(`‼ Fuck, I am error, please fix: ${err}`);
                    }
                }
                else return msg.channel.send("‼ Oh shit, I am error! Aborting.");
            }).catch(err => {
                msg.channel.send("Twelve hours have passed, not banning " + member.user + "\nDebug: " + err);
            });
        });
    });
});

client.on("guildMemberRemove", member => {
    console.log("\x1b[31m\x1b[1m[leave]\x1b[0m " + member.user.tag);
    var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
    return botLogs.send(`❌ \`${member.user.tag}\` has left the server`);
});

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

client.on("message", message => {
    if(message.author.bot) return false;

    var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
    if (message.nonce === null && message.attachments.size <= 0 && !message.author.bot &&  message.guild && message.author.avatarURL == null){
        botLogs.send(new Discord.RichEmbed().setTitle(`Potential userbot: ${message.member}`));
    }


    if(message.author.bot && message.channel.id === '528717576357019648' && message.author.id != '532483662705590273') return message.delete();
    else if(message.author.bot) return checkBadMessage(message);
    var perms = false;
    try {
        perms = message.member.roles.find(role => role.name == "user++") || message.member.roles.find(role => role.name == "Rot13")  || message.member.roles.find(role => role.name == "Arbiter of Fate") || false;
    }
    catch {
        perms = false;
    }

    var advancedPerms = false;
    try {
        advancedPerms = message.member.roles.find(role => role.name == "Rot13")  || message.member.roles.find(role => role.name == "Arbiter of Fate") || false;
    }
    catch {
        advancedPerms = false;
    }

    checkBadMessage(message);

    var messageContent = message.content.toLowerCase().replace(/([\^\`\´\?\.\-\_\,\s*])/gm, "");
    let msgC = message.content.toLowerCase().replace(/([\^\`\´\?\.\-\_\,*])/gm, "");
    if(advancedPerms && messageContent == "!prunenewcomers") {
        var allNewcomers = [];
        var newcomerRole = message.member.guild.roles.find(role => role.name == "newcomer");
        message.guild.members.forEach(member => {
            if(member.roles.has(newcomerRole.id)) allNewcomers.push(member);
        });
        message.channel.send(`Should I really prune all ${allNewcomers.length} newcomers?\nClick the checkmark within 5 seconds to commence mass destruction (I really hope you know what you're doing).`).then(m => {
            m.react("✅").then(s => {
                var filter = (reaction, user) => {
                    return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                m.awaitReactions(filter, { max: 1, time: (5 * 1000), errors: ['time'] }).then(r => {
                    if(r.first().emoji.name == "✅") m.delete().then(m=>{
                        try {
                            allNewcomers.forEach(member => {
                                member.kick().catch(err => {
                                    return message.channel.send(`‼ Couldn't prune all ${allNewcomers.length} newcomers due to an error: ${err}`);
                                });
                            });
                            return message.channel.send(`✅ Successfully pruned all ${allNewcomers.length} newcomers!`);
                        }
                        catch(err) {
                            return message.channel.send(`‼ Fuck, I am error, please fix: ${err}`);
                        }
                    });
                    else return message.channel.send("‼ Oh shit, I am error! Aborting.");
                }).catch(err => {
                    message.channel.send("5 seconds have passed, aborting.");
                });
            });
        });
    }
    else if(advancedPerms && messageContent == "!checknewcomers") {
        message.channel.send("Checking all newcomers...");
        newcomerCheck.checkNewcomers(message.guild, member => {
            message.channel.send("Kicked " + member);
        });
    }
    else if(perms && msgC.split(" ")[0] == "!mark") {
        var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
        let markNbr = parseInt(msgC.split(" ")[1]);
        if(markNbr <= 0 || markNbr > 100 || isNaN(markNbr)) {
            message.author.send("The number of messages to mark has to be above 0 and below 250, not " + markNbr + ". I set it to the default of 25 instead.");
            markNbr = 25;
        }
        message.channel.fetchMessages({limit: (markNbr + 1)}).then(r => {
            message.delete();
            let rArr = r.array(), resArray = [];
            for(let i = 0; i < rArr.length; i++) {
                resArray[i] = {
                    "author": rArr[i].author,
                    "content": rArr[i].content.toString(),
                    "timestamp": rArr[i].createdAt.toUTCString()
                };
            }
            resArray.shift();

            var embed = new Discord.RichEmbed()
                .setTitle(`Message log of **#${message.channel.name}** - (**${markNbr}** messages in total) - Date/Time (UTC): **${new Date().toUTCString()}**`)
                .setColor("#5585d1");

            let chars = 0;
            for(let i = 0; i < resArray.length; i++) {
                chars += resArray[i].content.length;
                let e = resArray[i];
                if((i == 0 || i % 25 != 0) && chars <= 1850) {
                    let fs = require("fs");
                    let ec = e.content.replace(/`/gm, "\\`");
                    embed.addField(`By: **${e.author.tag}** - Time: **${e.timestamp}**`, `\`\`\`\n${!jsl.isEmpty(ec) ? ec : "(Empty or RichEmbed)"}\n\`\`\``);
                }
                else {
                    chars = 0;
                    botLogs.send(embed).catch(err => message.channel.send(`Error: ${err}`));
                    embed = new Discord.RichEmbed()
                        .setTitle(`Message log of **#${message.channel.name}** - (**${markNbr}** messages in total) - Date/Time (UTC): **${new Date().toUTCString()}**`)
                        .setColor("#5585d1"); 
                }
            };

            botLogs.send(embed).catch(err => message.channel.send(`Error: ${err}`));
        }).catch(err => botLogs.send(`Error: ${err}`));
        return message.author.send(`I successfully logged the last **${markNbr}** messages from the channel **#${message.channel.name}** to the log channel.`);
    }

    if (perms) {
        var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
        if(messageContent == "!restart") botLogs.send(`♻ \`${message.author.tag}\` just restarted me`).then(m => {
            message.delete().then(r => {
                console.log("\x1b[31m\x1b[1m[restart]\x1b[0m " + message.author.tag);
                return process.exit(2);
            }).catch(err => console.log("err! " + err));
        }).catch(err => console.log("err2! " + err));
        else return;
    }

    if (message.channel.id === '528717576357019648') {
        var messageContent = message.content.toLowerCase().replace(/([\^\`\´\?\.\-\_\,\s*])/gm, "");
		if (messageContent == "!agree") {
            console.log("\x1b[32m\x1b[1m[agree]\x1b[0m " + message.author.tag);
            message.react("✅").then(m => message.delete(3000));
            let removeRole_newcomer = message.member.guild.roles.find(role => role.name == "newcomer");

            let URLembed = new Discord.RichEmbed()
                .setTitle("Great, you made it :smiley:")
                .setDescription(`You now have access to the entire server! \n Please read [the #info channel](https://discordapp.com/channels/430932202621108275/430981000907194370) completely as there's important information there.\nAlso tell us a bit more about yourself, your programming skills and why you joined the server in [the #introduce-yourself channel](https://discordapp.com/channels/430932202621108275/430970251174215690).\n(Doing this will give you a few perks)\n\n\nThank you and have fun on the server! :)`)
            message.member.send(URLembed).catch(err => {});
            
            message.member.removeRole(removeRole_newcomer);
			var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
            return botLogs.send(`👍 \`${message.author.tag}\` has agreed to the <#528717576357019648>`);
        }
        else if(messageContent == "!ping") {
            message.channel.send("📶 Pong!").then(m => {
                message.delete();
                setTimeout(()=>{
                    m.delete();
                }, 3000);
            });
        }
        else if(!perms && !advancedPerms) message.delete();
    }
});

function checkBadMessage(message) {
    var originalMessageContent = message.content.toLowerCase();
    var messageContent = message.content.toLowerCase().replace(/([\|\^\`\´\?\.\-\_\,\s*])/gm, "");
    var isbadword = false, triggerWords = [];
    for (var i in filter) {
        if (messageContent.includes(filter[i].toLowerCase())) {
            isbadword = true;
            triggerWords.push(filter[i]);
        }
    }
    if(isbadword) {
        message.channel.send(message.member + " do you kiss your mother with that mouth?").catch(err => {});
        message.author.send(`You might have said a bad word which I had to filter out!\n\n\n**Channel:** \`#${message.channel.name}\`\n\n**Message:**\n\`\`\`${originalMessageContent}\`\`\`\n\n**The filter triggered on the ${(triggerWords.length <= 1 ? "word:** \`" : "words:** \`") + jsl.readableArray(triggerWords, ", ", " and ")}\`\n\n\nPlease understand that we have to do this since we got quite a few trolls / spammers in the last couple of months.\n\nThanks :)`).catch(err => {});
        message.delete().then(m => {
            if(!message.author.bot) {
                var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
                let embed = new Discord.RichEmbed()
                    .setTitle(`‼ Potentially bad message by \`${message.author.tag}\`:`)
                    .addField("Channel:", `<#${message.channel.id.toString()}>`, false)
                    .addBlankField()
                    .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "\`")}\n\`\`\``, false)
                    .setColor("#ff0000")
                    .setFooter(new Date().toUTCString());

                return botLogs.send(embed).catch(err => {});
            }
        }).catch(err => {});
    }
}


client.login(config.token);