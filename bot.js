const Discord = require('discord.js');
const jsl = require("svjsl");
const client = new Discord.Client();
const config = require("./config.json");
const filter = require("./filter.js");
const newcomerCheck = require("./newcomerCheck.js");



const pingModsOnBadWordFilterTriggered = false;




const randomActivities = ["Abusing the Non-Mods", "Pruning all the newcomers", "Kissing your mother with that mouth", "Banning @everyone", "Secretly overthrowing the admins", "Crashing constantly", "Vaccinating my kids"];

const badWordResponses = ["%USER%, do you kiss your mother with that mouth?", "%USER%, \\*beep boop\\* I detect bad word \\*beep boop\\*"];

const iconURL = "https://sv443.net/cdn/other/tosboticon.png";







function randomActivity() {
    let rand = jsl.randRange(0, (randomActivities.length - 1));
    client.user.setActivity(randomActivities[rand]);
}


client.on('error', (err) => {
    console.log("\n\n    \x1b[31m\x1b[1m[Client Error]: \x1b[0m" + err.message);
});


client.on("ready", () => {
    console.log(`\n\n\n\x1b[36m\x1b[1m[startup]\x1b[0m John has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    randomActivity();
    setInterval(()=>randomActivity(), 15 * 60 * 1000); // every 15 mins

    newcomerCheck.checkNewcomers(client.guilds.find(guild => guild.id == "430932202621108275"));
    setInterval(()=>{
        newcomerCheck.checkNewcomers(client.guilds.find(guild => guild.id == "430932202621108275"));
    }, 20 * 60 * 1000); // every 20 mins

    setInterval(()=>{
        let d = new Date();
        if(d.getHours() == 0 && d.getMinutes() == 0) {
            logCurrentDate();
        }
    }, 60 * 1000);
    logCurrentDate();

    client.user.setAvatar(iconURL).then(() => {}).catch(err => {});
});

client.on('guildMemberAdd', member => {
    let addRole_newcomer = member.guild.roles.find(role => role.name == "newcomer");
    console.log("\x1b[35m\x1b[1m[join]\x1b[0m " + member.user.tag);
    newcomerCheck.addNewcomer(member.id);
    
    var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
    botLogs.send(`▶ <@${member.user.id}> has joined the server`);
    try {
        member.send("Hello! We are glad you joined our Cult!\nYou will need to read the rules in the #rules channel to gain access to the server.\nAlso make sure to read the #readme channel to see how to access our programming help channels.\n\nThanks and have fun! :)").then(m => {
            let URLembed = new Discord.RichEmbed()
                .setTitle("Here's a few links to the most important channels/messages:")
                .setDescription("**∙** [Rules (must read to access server)](https://discordapp.com/channels/430932202621108275/528717576357019648)\n"
                            + "**∙** [How to access programming help channels](https://discordapp.com/channels/430932202621108275/618804574873976843)\n"
                            + "**∙** [All bots and their commands](https://discordapp.com/channels/430932202621108275/430981000907194370/432163980866486279)\n"
                            + "**∙** [Our 3D art contests](https://discordapp.com/channels/430932202621108275/431042265868402688/582909817199525894)\n"
                            + "**∙** [Folding@Home](https://discordapp.com/channels/430932202621108275/431042265868402688/581582035106136093)\n"
                            + "**∙** [How to format code correctly](https://discordapp.com/channels/430932202621108275/528717576357019648/532909422956249108)\n"
                            + "**∙** [The cult's GitHub org (source code of some bots)](https://github.com/Jabrils-Discord-Server)")
                .setFooter("❗️ All messages sent in here are forwarded directly to the admins", "https://images-ext-1.discordapp.net/external/j0DzB2qVolwWd7Y9Y3v1isLDQc6fM3b4rnR6gqxl0Ac/https/cdn.discordapp.com/icons/430932202621108275/a_adb1790c440d6b1e69e22a38126ba774.jpg")
                .setColor("#ff3b00");
            member.send(URLembed).then(() => {}).catch(err => {});
        });
    }
    catch(err) {
        let errRE = new Discord.RichEmbed()
            .setTitle("📭 Couldn't send DM")
            .addField("**To User:**", member.user)
            .addField("**Type of DM:**", "Joined")
            .addField("**Complete Error:**", `\`${err}\``)
            .setColor("#ff0000");
        botLogs.send(errRE);
    }
    member.addRole(addRole_newcomer);
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
    if(!message.author.bot && message.channel.type == "dm") return gotDM(message.content, message.channel);

    if(message.author.bot || !message.guild) return false;

    var botLogs = client.channels.find(channel => channel.id == "489605729624522762");


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


    let lcmessage = message.content.toLowerCase();

    if(lcmessage.includes("://discord.gg/") || lcmessage.includes("://www.discord.gg/") || lcmessage.includes("://discordapp.com/invite") || lcmessage.includes("://discord.gg/invite")) {
        return botLogs.send(
            new Discord.RichEmbed()
            .setTitle("Someone sent an invite to a server")
            .addField("User:", message.author, true)
            .addField("In channel:", `<#${message.channel.id}>`, true)
            .addField("Message content:", `\`\`\`\n${message.content.replace(/\`/gm, "´")}\n\`\`\``)
            .setColor("#ff0000")
        );
    }

    if(message.content.replace(/\!\?\./gm, "").toLowerCase() == "creeper")
        message.channel.send("Aww man");


    var messageContent = message.content.toLowerCase().replace(/([\^\`\´\?\.\-\_\,\s*])/gm, "");
    let msgC = message.content.toLowerCase().replace(/([\^\`\´\?\.\-\_\,*])/gm, "");
    if(perms && messageContent == "!prunenewcomers") {
        var allNewcomers = [];
        var newcomerRole = message.member.guild.roles.find(role => role.id == "532550411962286125");
        message.guild.members.forEach(member => {
            let Qperms = false;
            let QadvancedPerms = false;

            try {
                Qperms = member.roles.find(role => role.name == "user++") || member.roles.find(role => role.name == "Rot13")  || member.roles.find(role => role.name == "Arbiter of Fate") || false;
            }
            catch {
                Qperms = false;
            }

            try {
                QadvancedPerms = member.roles.find(role => role.name == "Rot13")  || member.roles.find(role => role.name == "Arbiter of Fate") || false;
            }
            catch {
                QadvancedPerms = false;
            }

            if(member.roles.has(newcomerRole.id) && member.roles.size <= 2 && !Qperms && !QadvancedPerms) allNewcomers.push(member);
        });
        message.channel.send(`Should I really prune all ${allNewcomers.length} newcomers?\nClick the checkmark within 5 seconds to commence mass destruction (I really hope you know what you're doing).`).then(m => {
            m.react("✅").then(s => {
                var filter = (reaction, user) => {
                    return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                m.awaitReactions(filter, { max: 1, time: (5 * 1000), errors: ['time'] }).then(r => {
                    if(r.first().emoji.name == "✅") m.delete().then(m => {
                        let dmCount = 0;
                        try {
                            allNewcomers.forEach(member => {
                                try {
                                    member.send("You were pruned from the Cult of Jabrils server in accordance with our rules, however if you simply did not have time to read our rules and wish to rejoin the server, you can do so with this link: https://discord.gg/EZagHBx \n\nWe thank you for understanding\n- your mod team 😃").then(() => {
                                        member.kick().then(() => {}).catch(err => {
                                            return message.channel.send(`‼ Couldn't prune member ${member.user.tag} due to an error: ${err}`);
                                        });
                                    }).catch(err => {throw new Error(err)});
                                    dmCount++;
                                }
                                catch(err) {
                                    botLogs.send(`Error while DMing \`${member.user.tag}\` with the prune reason message: ${err}`);
                                }
                            });
                            var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
                            botLogs.send(`🤧 Farewell to **${allNewcomers.length}** pruned member${allNewcomers.length == 1 ? "" : "s"}!\nPruning initiated by: ${message.author}\nI DM-ed ${dmCount != allNewcomers.length ? (dmCount + " of " + allNewcomers.length) : "all"} users with the reason message.`);
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
    else if(perms && messageContent.startsWith("!say")) {
        try {
            message.delete().then(() => {
                message.channel.send(message.content.split("!say")[1].substring(1));
            });
        }
        catch(err) {
            message.channel.send(`Error while executing "!say" command: ${err}`);
        }
    }
    else if(perms && messageContent == "!checknewcomers") {
        message.channel.send("Checking all newcomers...");
        newcomerCheck.checkNewcomers(message.guild, member => {
            message.channel.send("Kicked " + member);
        });
    }
    else if(perms && msgC.split(" ")[0] == "!mark") {
        var evidenceChannel = client.channels.find(channel => channel.id == "586407357458939906");
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
                    "timestamp": new Date(rArr[i].createdAt).toUTCString().replace("GMT", "UTC")
                };
            }
            resArray.shift();

            var embed = new Discord.RichEmbed()
                .setTitle(`Message log of **#${message.channel.name}** - (**${markNbr}** messages in total) - Date/Time (UTC): **${new Date().toUTCString()}**`)
                .setFooter(`Initiated by ${message.author.tag}`)
                .setColor("#5585d1");

            let chars = 0;

            resArray = resArray.reverse();

            for(let i = 0; i < resArray.length; i++) {
                chars += resArray[i].content.length;
                let e = resArray[i];
                if((i == 0 || i % 25 != 0) && chars <= 900) {
                    let ec = e.content.replace(/`/gm, "\\`");
                    embed.addField(`By: **${e.author.tag}** - Time: **${e.timestamp}**`, `\`\`\`\n${!jsl.isEmpty(ec) ? ec : "(Image or RichEmbed)"}\n\`\`\``);
                }
                else {
                    chars = 0;
                    evidenceChannel.send(embed).then(() => {}).catch(err => message.channel.send(`Error: ${err}`));
                    embed = new Discord.RichEmbed()
                        .setTitle(`Message log of **#${message.channel.name}** - (**${markNbr}** messages in total) - Date/Time of log creation (UTC): **${new Date().toUTCString()}**`)
                        .setFooter(`Initiated by ${message.author.tag}`)
                        .setColor("#5585d1"); 
                }
            };

            evidenceChannel.send(embed).then(() => {}).catch(err => message.channel.send(`Error: ${err}`));
        }).catch(err => evidenceChannel.send(`Error: ${err}`));
        return;
    }

    if(advancedPerms) {
        var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
        if(messageContent == "!restart") botLogs.send(`♻ <@${message.author.id}> just restarted me`).then(m => {
            message.delete().then(r => {
                console.log("\x1b[31m\x1b[1m[restart]\x1b[0m " + message.author.tag);
                process.exit(2);
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

            try {
                let URLembed = new Discord.RichEmbed()
                    .setTitle("Great, you made it :smiley:")
                    .setDescription(`You now have access to (almost) the entire server! \n Please read [the #info channel](https://discordapp.com/channels/430932202621108275/430981000907194370) completely as there's important information there.\nAlso tell us a bit more about yourself, your programming skills and why you joined the server in [the #introduce-yourself channel](https://discordapp.com/channels/430932202621108275/430970251174215690). You need to do this in order to get programming help and to gain a few cool perks.\n\n\nThank you and have fun on the server! :)`)
                    .setColor("#2bff2b");
                message.member.send(URLembed).then(() => {}).catch(err => {throw new Error(err)});
            }
            catch(err) {
                let errRE = new Discord.RichEmbed()
                    .setTitle("📭 Couldn't send DM")
                    .addField("**To User:**", member.user)
                    .addField("**Type of DM:**", "Joined")
                    .addField("**Complete Error:**", `\`${err}\``)
                    .setColor("#ff0000");
                botLogs.send(errRE);
            }

            message.member.removeRole(removeRole_newcomer);
			var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
            return botLogs.send(`👍 <@${message.author.id}> has agreed to the <#528717576357019648>`);
        }
        else if(messageContent == "!ping") {
            message.channel.send("📶 Pong!").then(m => {
                message.delete();
                setTimeout(()=>{
                    m.delete();
                }, 3000);
            });
        }
        else if(!perms && !perms) message.delete();
    }
});

/**
 * @param {Discord.Message} message
 */
function checkBadMessage(message) {
    var originalMessageContent = message.content.toLowerCase();
    var messageContent = message.content.toLowerCase().replace(/([\|\^\`\´\?\.\-\_\,\s*])/gm, "");
    var messageLightCheckContent = message.content.toLowerCase();

    var isbadword = false, lightcheckisbadword = false, triggerWords = [], triggerWordsLight = [];
    for (var i in filter) {
        if (messageContent.includes(filter[i].toLowerCase())) {
            isbadword = true;
            triggerWords.push(filter[i]);
        }

        if (messageLightCheckContent.includes(filter[i].toLowerCase())) {
            lightcheckisbadword = true;
            triggerWordsLight.push(filter[i]);
        }
    }

    if(isbadword) {
        var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
        let embed = new Discord.RichEmbed()
        .setTitle(`‼ There could have been a bad word in the following message:`)
        .addField("User:", `<@${message.author.id}>`, true)
        .addField("Channel:", `<#${message.channel.id.toString()}>`, true)
        .addBlankField()
        .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
        .addBlankField()
        .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, `\`\`\`\n${triggerWords.join(", ")}\`\`\``, true)
        .addBlankField()
        .setDescription(lightcheckisbadword ? "**I deleted their message as the chance the message was toxic was pretty high.**" : "**I didn't delete their message as the chance the message was toxic was too low.**")
        .setColor("#ffaa00")
        .setFooter("(\` replaced with ´) - " + new Date().toUTCString());
        if(!lightcheckisbadword) botLogs.send(embed);
    }

    if(lightcheckisbadword) {
        let response = badWordResponses[jsl.randRange(0, badWordResponses.length - 1)];
        message.channel.send(response.replace("%USER%", message.member)).then(() => {}).catch(err => {});
        message.author.send(`You might have said a bad word which I had to filter out!\n\n\n**Channel:** \`#${message.channel.name}\`\n\n**Message:**\n\`\`\`${originalMessageContent}\`\`\`\n\n**The filter triggered on the ${(triggerWords.length <= 1 ? "word:** \`" : "words:** \`") + jsl.readableArray(triggerWords, ", ", " and ")}\`\n\n\nPlease understand that we have to do this since we got quite a few trolls / spammers in the last couple of months.\n\nThanks :)`).catch(err => {});
        message.delete().then(m => {
            if(!message.author.bot) {
                var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
                let embed = new Discord.RichEmbed()
                .setTitle(`‼ Bad word filter was triggered, message was deleted`)
                .addField("User:", `<@${message.author.id}>`, true)
                .addField("Channel:", `<#${message.channel.id.toString()}>`, true)
                .addBlankField()
                .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
                .addBlankField()
                .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, `\`\`\`\n${triggerWords.join(", ")}\`\`\``, true)
                .setColor("#ff0000")
                .setFooter("(\` replaced with ´) - " + new Date().toUTCString());

                if(pingModsOnBadWordFilterTriggered === true) botLogs.send(`${message.guild.roles.find(role => role.id == "430952058200260608")} ${message.guild.roles.find(role => role.id == "430950769710202880")}`);
                if(isbadword && lightcheckisbadword) return botLogs.send(embed).then(() => {}).catch(err => {});
                else return;
            }
        }).catch(err => {});
    }
}

function logCurrentDate() {
    let d = new Date();
    console.log(`\n\x1b[33m\x1b[1m[x]\x1b[0m ${d.getDate() < 10 ? "0" : ""}${d.getDate()}-${d.getMonth() + 1 < 10 ? "0" : ""}${d.getMonth() + 1}-${d.getFullYear()}\n`);
}

/**
 * Function gets executed when a user sends ToS a DM
 * @param {String} content
 * @param {Discord.User} user
 */
function gotDM(content, user) {
    console.log(content);
    if(content.startsWith("!report ")) {
        let report = content.replace("!report ", "");
        let rem = new Discord.RichEmbed()
            .setTitle("**I just got a report:**")
            .addField("**From:**", user)
            .addField("**Content:**", report)
            .setColor("#ff0000");
        client.guilds.find(guild => guild.id == "430932202621108275").channels.find(channel => channel.id == "489599094793175041").send(rem).then(()=>{
            user.send(`Successfully sent your report to the admins of the Cult of Jabrils server!`).then(() => {}).catch(err => {});
        });
    }
    else {
        let rem = new Discord.RichEmbed()
            .setTitle("**I just got a DM:**")
            .addField("**User:**", user)
            .addField("**Content:**", content)
            .setColor("#ff0000");
        client.guilds.find(guild => guild.id == "430932202621108275").channels.find(channel => channel.id == "489605729624522762").send(rem).then(()=>{
            user.send(`Your DM has been forwarded to the admins of the Cult of Jabrils server.`).then(() => {}).catch(err => {});
        });
    }
}


// Sv443 | 2019-07-07 | check edited messages for bad words
client.on("messageUpdate", (oldmsg, newmsg) => {
    checkBadMessage(newmsg);
});





client.login(config.token);