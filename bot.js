const Discord = require('discord.js');
const jsl = require("svjsl");
// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const https = require("https");
const client = new Discord.Client();
const config = require("./config.json");
const filter = require("./filter.js");
const newcomerCheck = require("./newcomerCheck.js");



const pingModsOnBadWordFilterTriggered = false;
const jabstatHost = "jabstats.com";
const jabstatPath = "/pruned";




const randomActivities = [
    "Abusing the Non-Mods",
    "Pruning all the newcomers",
    "Kissing your mother with that mouth",
    "Banning @everyone",
    "Secretly overthrowing the admins",
    "Crashing constantly", "Vaccinating my kids"
];

const badWordResponses = [
    "%USER%, do you kiss your mother with that mouth?",
    "%USER%, \\*beep boop\\* I detect bad word \\*beep boop\\*"
];

const iconURL = "https://sv443.net/cdn/other/tosboticon.png";






// const treeDataChannelID = "637387745320370246";
const guildID = "430932202621108275";



function randomActivity() {
    let rand = jsl.randRange(0, (randomActivities.length - 1));
    client.user.setActivity(randomActivities[rand]);
}


client.on('error', (err) => {
    console.log("\n\n    \x1b[31m\x1b[1m[Client Error]: \x1b[0m" + err.message);
});


client.on("ready", () => {
    console.log(`\n\n\n\x1b[36m\x1b[1m[startup]\x1b[0m ToS has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    randomActivity();
    setInterval(()=>randomActivity(), 15 * 60 * 1000); // every 15 mins

    newcomerCheck.checkNewcomers(client.guilds.cache.find(guild => guild.id == guildID));
    setInterval(()=>{
        newcomerCheck.checkNewcomers(client.guilds.cache.find(guild => guild.id == guildID));
    }, 20 * 60 * 1000); // every 20 mins

    setInterval(()=>{
        let d = new Date();
        if(d.getHours() == 0 && d.getMinutes() == 0) {
            logCurrentDate();
        }
    }, 60 * 1000); // every minute
    logCurrentDate();

    // refreshTreeCount();
    // setInterval(() => {
    //     refreshTreeCount();
    // }, 10000 * 60);

    client.user.setAvatar(iconURL).then(() => {}).catch(() => {});
});

client.on('guildMemberAdd', member => {
    let addRole_newcomer = member.guild.roles.cache.find(role => role.name == "newcomer");
    console.log("\x1b[35m\x1b[1m[join]\x1b[0m " + member.user.tag);
    newcomerCheck.addNewcomer(member.id);
    
    var botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");
    botLogs.send(`▶ <@${member.user.id}> has joined the server`);
    try {
        member.send("Hello! We are glad you joined our Cult!\nYou will need to read the rules in the #rules channel and introduce yourself in the #introduce-yourself channel to gain access to the server.\n\nThanks and have fun! :)").then(() => {
            let URLembed = new Discord.MessageEmbed()
                .setTitle("Here's a few links to the most important channels/messages:")
                .setDescription("**∙** [Rules (must read to access server)](https://discordapp.com/channels/430932202621108275/528717576357019648)\n"
                            + "**∙** [How to format code correctly](https://discordapp.com/channels/430932202621108275/528717576357019648/662191468320129036)\n"
                            + "**∙** [The cult's GitHub org (source code of some bots)](https://github.com/Jabrils-Discord-Server)\n\n"
                            + "To access our community channels, please [introduce yourself in this channel](https://discordapp.com/channels/430932202621108275/430970251174215690)")
                .setFooter("❗️ All messages sent in here are forwarded directly to the admins")
                .setColor("#ff3b00");
            member.send(URLembed).then(() => {}).catch(() => {});
        });
    }
    catch(err) {
        let errRE = new Discord.MessageEmbed()
            .setTitle("📭 Couldn't send DM")
            .addField("**To User:**", member.user)
            .addField("**Type of DM:**", "Joined")
            .addField("**Complete Error:**", `\`${err}\``)
            .setColor("#ff0000");
        botLogs.send(errRE);
    }
    member.roles.add(addRole_newcomer);
});

client.on("guildMemberRemove", member => {
    console.log("\x1b[31m\x1b[1m[leave]\x1b[0m " + member.user.tag);
    var botLogs = client.channels.find(channel => channel.id == "489605729624522762");
    return botLogs.send(`❌ \`${member.user.tag}\` has left the server`);
});

// const getCircularReplacer = () => {
//     const seen = new WeakSet();
//     return (key, value) => {
//       if (typeof value === "object" && value !== null) {
//         if (seen.has(value)) {
//           return;
//         }
//         seen.add(value);
//       }
//       return value;
//     };
// };

client.on("message", message => {
    if(!message.author.bot && message.channel.type == "dm") return gotDM(message.content, message.channel);

    if(message.author.bot || !message.guild) return false;

    var botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");


    if(message.author.bot)
        return message.delete();
    else if(message.author.bot)
        return checkBadMessage(message);

    var perms = false;
    try {
        perms = message.member.roles.cache.find(role => role.name == "user++") || message.member.roles.cache.find(role => role.name == "Rot13")  || message.member.roles.cache.find(role => role.name == "Arbiter of Fate") || false;
    }
    catch(err) {
        perms = false;
    }

    var advancedPerms = false;
    try {
        advancedPerms = message.member.roles.cache.find(role => role.name == "Rot13")  || message.member.roles.cache.find(role => role.name == "Arbiter of Fate") || false;
    }
    catch(err) {
        advancedPerms = false;
    }

    checkBadMessage(message);


    let lcmessage = message.content.toLowerCase();

    if(lcmessage.includes("://discord.gg/") || lcmessage.includes("://www.discord.gg/") || lcmessage.includes("://discordapp.com/invite") || lcmessage.includes("://discord.gg/invite")) {
        return botLogs.send(
            new Discord.MessageEmbed()
            .setTitle("Someone sent an invite to a server")
            .addField("User:", message.author + " / `" + message.author.tag + "`", true)
            .addField("In channel:", `<#${message.channel.id}>`, true)
            .addField("Message content:", `\`\`\`\n${message.content.replace(/`/gm, "´")}\n\`\`\``)
            .addField(`Direct Link:`, `${message.url}`, false)
            .setColor("#ff0000")
        );
    }

    if(message.content.replace(/!\?\./gm, "").toLowerCase() == "creeper")
        message.channel.send("Aww man");


    var messageContent = message.content.toLowerCase().replace(/([\^`´?.\-_,\s*])/gm, "");
    let msgC = message.content.toLowerCase().replace(/([\^`´?.\-_,*])/gm, "");

    if (message.channel.id == '528717576357019648') {
		if (messageContent == "!agree") {
            console.log("\x1b[32m\x1b[1m[agree]\x1b[0m " + message.author.tag);
            message.react("✅").then(() => message.delete(3000));
            let removeRole_newcomer = message.member.guild.roles.cache.find(role => role.name == "newcomer");

            try {
                let URLembed = new Discord.MessageEmbed()
                    .setTitle("Great, you made it :smiley:")
                    .setDescription(`You now have access to (almost) the entire server! \n Please read [the #info channel](https://discordapp.com/channels/430932202621108275/430981000907194370) completely as there's important information there.\nAlso tell us a bit more about yourself, your programming skills and why you joined the server in [the #introduce-yourself channel](https://discordapp.com/channels/430932202621108275/430970251174215690). You need to do this in order to get programming help and to gain a few cool perks.\n\n\nThank you and have fun on the server! :)`)
                    .setColor("#2bff2b");
                message.member.send(URLembed).then(() => {}).catch(err => {throw new Error(err)});
            }
            catch(err) {
                let errRE = new Discord.MessageEmbed()
                    .setTitle("📭 Couldn't send DM")
                    .addField("**To User:**", message.member.user)
                    .addField("**Type of DM:**", "Joined")
                    .addField("**Complete Error:**", `\`${err}\``)
                    .setColor("#ff0000");
                botLogs.send(errRE);
            }

            message.member.roles.remove(removeRole_newcomer);
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
        else if(perms || advancedPerms)
            return;
        else
            message.delete();
    }

    // Rest in Peace sister Yabe :'(
    if(messageContent.startsWith("!addrole"))
    {
        try {
            let roleSearch = message.content.substring(8).trim();
            let roleToAdd = message.guild.roles.cache.find(x => x.name.toLowerCase() === roleSearch.toLowerCase());
    
            if (!roleSearch.toLowerCase())
                return message.reply('Gimmie a role ya big silly');
    
            if (roleToAdd == undefined && roleSearch.match(/<|>/gm))
                roleToAdd = message.guild.roles.cache.find(x => x.name.toLowerCase() === roleSearch.toLowerCase().replace(/<|>/gm, ""));
            else if (roleToAdd == undefined)
                return message.reply(`Unfortunately that role, **${roleSearch}**, does not exist`);
    
            if (message.member.roles.cache.has(roleToAdd.id))
                return message.reply('You already have that role!');
    
            message.member.roles.add(`${roleToAdd.id}`).then(() => message.react(`✅`))
                .catch(error => {
                    console.error;
                    message.react('❎');
                    if (error == "DiscordAPIError: Missing Permissions")
                        return message.reply(`You lack the power to gain a role as noble as \`${roleToAdd.name || roleToAdd}\``);
                    else
                        return message.reply(`Unexpected error: ${error}`);
                })
    
        } catch (err) {
            botLogs.send(`There was an error adding a role: ${err}`);
        }
    }
    else if(messageContent.startsWith("!removerole"))
    {
        try {
            let roleSearch = message.content.substring(11).trim();
            let roleToRemove = message.guild.roles.cache.find(x => x.name.toLowerCase() === roleSearch.toLowerCase());
    
            if (!roleSearch.toLowerCase())
                return message.reply('Gimmie a role ya big silly');
    
            if (roleToRemove == undefined)
                return message.reply(`Unfortunately that role, **${roleSearch}**, does not exist`);
    
            if (!message.member.roles.cache.has(roleToRemove.id))
                return message.reply("You don't have that role!");
    
            message.member.roles.remove(`${roleToRemove.id}`).then(() => message.react(`✅`))
            .catch(error => {
                console.error;
                message.react('❎');
                if (error == "DiscordAPIError: Missing Permissions")
                    return message.reply(`You lack the power to remove a role as noble as \`${roleToRemove.name || roleToRemove}\``);
                else
                    return message.reply(`Unexpected error: ${error}`);
            })
        } catch (err) {
            botLogs.send(`There was a problem while removing the role: ${err}`);
        }
    }
    else if(messageContent.startsWith("!avatar"))
    {
        try {
            var targetName = message.content.substring(7).trim();
            var target;
    
            if (targetName.includes('@'))
                target = message.mentions.users.first();
            else if (!jsl.isEmpty(targetName) && !targetName.includes('@')) {
                try {
                    target = message.guild.members.cache.find(member => [member.displayName.toLowerCase(), member.user.username.toLowerCase()].includes(targetName.toLowerCase())).user;
                }
                catch (err) {
                    // If the supplied name cannot be resolved, check for any discriminators and strip them incase of a "silent mention" used to autofill the target's name
                    //We do the discriminator check after the name check fails, incase the target has a # in their name
                    targetName = targetName.substring(0, targetName.indexOf('#'));
                    target = message.guild.members.cache.find(member => [member.displayName.toLowerCase(), member.user.username.toLowerCase()].includes(targetName.toLowerCase())).user;
                }
            }
            else if (jsl.isEmpty(targetName))
                target = message.author;
    
            let embed = new Discord.MessageEmbed()
                .setTitle(`**${target.username}'s** Avatar`)
                .setImage(target.displayAvatarURL())
                .setColor("#5585d1");
            return message.channel.send(embed);
    
        } catch (err) {
            // If no user can be found, the error will be caught here
            //Check for perms incase yabe is no longer required to be an administrator in the future (@illusion luv u bby)
            if (target == null) {
                message.react('💤');
                message.channel.send(`❌ user \`${targetName}\` not found ❌`).then(respMessage => {
                    if (message.guild.me.hasPermission("MANAGE_MESSAGES"))
                        respMessage.delete(10000);
                });
            }
            else
                console.log(err);
        }
    }
    else if(messageContent.startsWith("!whois"))
    {
        try {
            let maxUsersToDisplay = 30;
    
            let roles = message.guild.roles.cache;
            let roleKeys = roles.keyArray();
    
            let sendEmbed = (name, role) => {
                let memberNames = [];
    
                let roleKeys = role.keyArray()
                roleKeys.forEach(key => memberNames.push(role.get(key)));
    
                let emb = new Discord.MessageEmbed();
    
                emb.setColor("#5585d1");
    
                let memberUsers = "";
                let moreThanMax = false;
                let memberCount = memberNames.length;
                let tooManyText = "";
    
                if (memberNames.length > maxUsersToDisplay)
                {
                    memberNames.splice(maxUsersToDisplay);
                    moreThanMax = true;
                    tooManyText = " (too many to display)";
                }
                
                memberNames.forEach(member => memberUsers += "<@" + member.user.id + ">\n");
    
                if(moreThanMax)
                    memberUsers += "...";
            
                if(!memberUsers)
                    memberUsers = "(none)";
    
                emb.addField(`Who is ${name}:`, memberUsers);
                emb.setFooter(`${memberCount} users have this role${tooManyText}.`)
                message.channel.send(emb);
            };
    
            roleKeys.forEach(key => {
                let role = roles.get(key);
                let name = role.name.toLowerCase();
                let argS = message.content.split(" ");
                argS.shift();
                argS = argS.join(" ").toLowerCase().trim();
                if (name == argS) {
                    sendEmbed(name, role.members);
                    return;
                }
            });
        } catch (err) {
            botLogs.send(`Error in command !whois: ${err}`);
        }
    }
    else if(messageContent == "!roles")
    {
        // Role names inside the blacklist won't be included in the final list
        // Find all roles below the Coding Yabe Sei role, filter out the blacklist roles, and filter out any roles with the Administrator permission 
        // (to avoid any no perms message if a user were to try and add the role) - and then sort the filter and convert it into an array
        try {
            var blackList = ["@everyone"];

            let yabeRole = message.guild.roles.cache.find(yaberole => yaberole.name == "ToS-Bot");
            console.log(`yaberole: ${yabeRole}`);
            let roles = message.guild.roles.cache.filter(allRoles => allRoles.position < yabeRole.position && !blackList.includes(allRoles.name)
                        && !allRoles.permissions.has("ADMINISTRATOR"))
                        .sort().array();
            
            console.log(`roles: ${roles[0]}`);


            let embed = new Discord.MessageEmbed()
                .setColor("#5585d1")
                .setTitle(`These are the ${roles.length} roles avaliable to you for ` + message.guild.name + '\n')
                .setDescription(roles.join(' ') + "\n\n**Add roles using ToS with `!addrole <role name>`**")
                .setTimestamp();

            message.channel.send(embed);
            //console.log(roles.length)
        } catch (err) {
            console.log('There was an error displaying roles: ' + err);
        }
    }
    else if(messageContent == "!help")
    {
        try
        {
            let embed = new Discord.MessageEmbed()
                .setColor("#5585d1")
                .setTitle("These are my commands:")
                .setDescription(`\
\`!help\` - Shows this message
\`!roles\` - Displays available roles
\`!addrole <role_name>\` - Grants you a role
\`!removerole <role_name>\` - Removes a role
\`!whois <role_name>\` - Shows users that have the specified role
\`!avatar <user>\` - Displays the avatar of a user or yourself if omitted
`)
                .setFooter("These commands were stolen from Coding Yabe Sei, Rest in Peace, Sis :(");

            message.channel.send(embed);
        }
        catch(err)
        {
            botLogs.send(`Error while displaying help: ${err}`);
        }
    }
    else if(perms && messageContent == "!prunenewcomers") {
        var allNewcomers = [];
        var newcomerRole = message.member.guild.roles.cache.find(role => role.id == "532550411962286125");
        message.guild.members.cache.forEach(member => {
            let Qperms = false;
            let QadvancedPerms = false;

            try {
                Qperms = member.roles.cache.find(role => role.name == "user++") || member.roles.cache.find(role => role.name == "Rot13")  || member.roles.cache.find(role => role.name == "Arbiter of Fate") || false;
            }
            catch(err) {
                Qperms = false;
            }

            try {
                QadvancedPerms = member.roles.cache.find(role => role.name == "Rot13")  || member.roles.cache.find(role => role.name == "Arbiter of Fate") || false;
            }
            catch(err) {
                QadvancedPerms = false;
            }

            if(member.roles.cache.has(newcomerRole.id) && member.roles.cache.size <= 2 && !Qperms && !QadvancedPerms)
                allNewcomers.push(member);
        });
        message.channel.send(`Should I really prune all ${allNewcomers.length} newcomers?\nClick the checkmark within 5 seconds to commence mass destruction (I really hope you know what you're doing).`).then(m => {
            m.react("✅").then(() => {
                var filter = (reaction, user) => {
                    return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                m.awaitReactions(filter, { max: 1, time: (5 * 1000), errors: ['time'] }).then(r => {
                    if(r.first().emoji.name == "✅") m.delete().then(() => {
                        let dmCount = 0;
                        try {
                            allNewcomers.forEach(member => {
                                try {
                                    member.send("You were pruned from the Cult of Jabrils server in accordance with our rules, however if you simply did not have time to read our rules and wish to rejoin the server, you can do so with this link: https://discord.gg/EZagHBx \n\nWe thank you for understanding\n- your mod team 😃").then(() => {
                                        member.kick().catch(err => {
                                            return message.channel.send(`‼ Couldn't prune member ${member.user.tag} due to an error: ${err}`);
                                        });
                                    }).catch(err => botLogs.send(`Error while DMing \`${member.user.tag}\` with the prune reason message: ${err}`));
                                    dmCount++;
                                }
                                catch(err) {
                                    botLogs.send(`Error while DMing \`${member.user.tag}\` with the prune reason message: ${err}`);
                                }
                            });
                            var botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");
                            botLogs.send(`🤧 Farewell to **${allNewcomers.length}** pruned member${allNewcomers.length == 1 ? "" : "s"}!\nPruning initiated by: ${message.author}\nI DM-ed ${dmCount != allNewcomers.length ? (dmCount + " of " + allNewcomers.length) : "all"} users with the reason message.`);

                            jabstatWH(null, allNewcomers, message.author);

                            return message.channel.send(`✅ Successfully pruned all ${allNewcomers.length} newcomers!`);
                        }
                        catch(err) {
                            return message.channel.send(`‼ Fuck, I am error, please fix: ${err}`);
                        }
                    });
                    else return message.channel.send("‼ Oh shit, I am error! Aborting.");
                }).catch(() => {
                    message.channel.send("5 seconds have passed, aborting.");
                });
            });
        });
    }
    else if(perms && messageContent == "!testprunenewcomers") {
        allNewcomers = [];
        newcomerRole = message.member.guild.roles.cache.find(role => role.id == "532550411962286125");

        message.guild.members.forEach(member => {
            let Qperms = false;
            let QadvancedPerms = false;

            try {
                Qperms = member.roles.cache.find(role => role.name == "user++") || member.roles.cache.find(role => role.name == "Rot13")  || member.roles.cache.find(role => role.name == "Arbiter of Fate") || false;
            }
            catch(err) {
                Qperms = false;
            }

            try {
                QadvancedPerms = member.roles.cache.find(role => role.name == "Rot13")  || member.roles.cache.find(role => role.name == "Arbiter of Fate") || false;
            }
            catch(err) {
                QadvancedPerms = false;
            }

            if(member.roles.cache.has(newcomerRole.id) && member.roles.cache.size <= 2 && !Qperms && !QadvancedPerms)
                allNewcomers.push(member);
        });
        message.channel.send(`Should I really prune all ${allNewcomers.length} newcomers?\nClick the checkmark within 5 seconds to commence mass destruction (I really hope you know what you're doing).`).then(m => {
            m.delete().then(() => {
                let dmCount = 0;
                try {
                    var botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");
                    botLogs.send(`TEST PRUNE - NOBODY WAS KICKED!\n🤧 Farewell to **${allNewcomers.length}** pruned member${allNewcomers.length == 1 ? "" : "s"}!\nPruning initiated by: ${message.author}\nI DM-ed ${dmCount != allNewcomers.length ? (dmCount + " of " + allNewcomers.length) : "all"} users with the reason message.`);

                    jabstatWH(null, allNewcomers, message.author);

                    return message.channel.send(`✅ Successfully pruned all ${allNewcomers.length} newcomers!`);
                }
                catch(err) {
                    return message.channel.send(`‼ Fuck, I am error, please fix: ${err}`);
                }
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
        var evidenceChannel = client.channels.cache.find(channel => channel.id == "586407357458939906");
        let markNbr = parseInt(msgC.split(" ")[1]);
        if(markNbr <= 0 || markNbr > 250 || isNaN(markNbr)) {
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

            var embed = new Discord.MessageEmbed()
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
                    embed.addField(`By: **${e.author.tag}** - Time: **${e.timestamp}**`, `\`\`\`\n${!jsl.isEmpty(ec) ? ec : "(Image or MessageEmbed)"}\n\`\`\``);
                }
                else {
                    chars = 0;
                    evidenceChannel.send(embed).then(() => {}).catch(err => message.channel.send(`Error: ${err}`));
                    embed = new Discord.MessageEmbed()
                        .setTitle(`Message log of **#${message.channel.name}** - (**${markNbr}** messages in total) - Date/Time of log creation (UTC): **${new Date().toUTCString()}**`)
                        .setFooter(`Initiated by ${message.author.tag}`)
                        .setColor("#5585d1"); 
                }
            }

            evidenceChannel.send(embed).then(() => {}).catch(err => message.channel.send(`Error: ${err}`));
        }).catch(err => evidenceChannel.send(`Error: ${err}`));
        return;
    }

    if(advancedPerms) {
        botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");
        if(messageContent == "!restart") botLogs.send(`♻ <@${message.author.id}> just restarted me`).then(() => {
            message.delete().then(() => {
                console.log("\x1b[31m\x1b[1m[restart]\x1b[0m " + message.author.tag);
                process.exit(2);
            }).catch(err => console.log("err! " + err));
        }).catch(err => console.log("err2! " + err));
        else return;
    }
});

/**
 * @param {String|null} error
 * @param {Discord.GuildMember} prunedUsers
 * @param {Discord.User} prunedBy
 */
function jabstatWH(error, prunedUsers, prunedBy)
{
    prunedUsers = prunedUsers.map(v => {
        return v.user.id;
    });

    var botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");

    let whData = JSON.stringify({
        "error": error !== null,
        "message": error || "Ok",
        "prunedCount": prunedUsers ? prunedUsers.length || 0 : 0,
        "prunedUsers": prunedUsers ? prunedUsers || [] : [],
        "prunedBy": prunedBy ? prunedBy.id : null
    }, null, 4);

    let req = https.request({
        method: "POST",
        hostname: jabstatHost,
        port: 443,
        path: jabstatPath,
        headers: {
            "Content-Type": "application/json",
            "Content-Length": whData.length,
            "Connection": "keep-alive",
            "Accept": "*/*"
        }
    }, (res) => {
        if(res.statusCode < 300)
            console.log(`Jabstat XHR ok (${res.statusCode})`);
        else
            botLogs.send(`Error while sending webhook request to Jabstat: HTTP ${res.statusCode} - response: \`${res.statusMessage}\``);
    });

    req.on("error", err => {
        botLogs.send(`Error while sending webhook request to Jabstat: ${err}`);
    });

    req.write(whData);
    req.end();
}

/**
 * @param {Discord.Message} message
 */
function checkBadMessage(message) {
    var originalMessageContent = message.content.toLowerCase();
    var messageContent = message.content.toLowerCase().replace(/([|^`´?.\-_,\s*])/gm, "");
    var messageLightCheckContent = message.content.toLowerCase().replace(/\|\|/gm, "");

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
        var botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");
        let embed = new Discord.MessageEmbed()
        .setTitle(`‼ There could have been a bad word in the following message:`)
        .addField("User:", `<@${message.author.id}>`, true)
        .addField("Channel:", `<#${message.channel.id.toString()}>`, true)
        .addField("\u200B", "\u200B")
        .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
        .addField("\u200B", "\u200B")
        .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, `\`\`\`\n${triggerWords.join(", ")}\`\`\``, true)
        .addField("\u200B", "\u200B")
        .setDescription(lightcheckisbadword ? "**I deleted their message as the chance the message was toxic was pretty high.**" : "**I didn't delete their message as the chance the message was toxic was too low.**")
        .setColor("#ffaa00")
        .setFooter("(` replaced with ´) - " + new Date().toUTCString());
        if(!lightcheckisbadword) botLogs.send(embed);
    }

    if(lightcheckisbadword) {
        let response = badWordResponses[jsl.randRange(0, badWordResponses.length - 1)];
        message.channel.send(response.replace("%USER%", message.member)).then(() => {}).catch(() => {});
        message.author.send(`You might have said a bad word which I had to filter out!\n\n\n**Channel:** \`#${message.channel.name}\`\n\n**Message:**\n\`\`\`${originalMessageContent}\`\`\`\n\n**The filter triggered on the ${(triggerWords.length <= 1 ? "word:** `" : "words:** `") + jsl.readableArray(triggerWords, ", ", " and ")}\`\n\n\nPlease understand that we have to do this since we got quite a few trolls / spammers in the last couple of months.\n\nThanks :)`).catch(() => {});
        message.delete().then(() => {
            if(!message.author.bot) {
                var botLogs = client.channels.cache.find(channel => channel.id == "489605729624522762");
                let embed = new Discord.MessageEmbed()
                .setTitle(`‼ Bad word filter was triggered, message was deleted`)
                .addField("User:", `<@${message.author.id}>`, true)
                .addField("Channel:", `<#${message.channel.id.toString()}>`, true)
                .addField("\u200B", "\u200B")
                .addField("Content:", `\`\`\`\n${originalMessageContent.replace(/`/gm, "´")}\n\`\`\``, false)
                .addField("\u200B", "\u200B")
                .addField(`Triggered on word${triggerWords.length == 1 ? "" : "s"}:`, `\`\`\`\n${triggerWords.join(", ")}\`\`\``, true)
                .setColor("#ff0000")
                .setFooter("(` replaced with ´) - " + new Date().toUTCString());

                if(pingModsOnBadWordFilterTriggered === true) botLogs.send(`${message.guild.roles.cache.find(role => role.id == "430952058200260608")} ${message.guild.roles.cache.find(role => role.id == "430950769710202880")}`);
                if(isbadword && lightcheckisbadword) return botLogs.send(embed).then(() => {}).catch(() => {});
                else return;
            }
        }).catch(() => {});
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
    if(content.startsWith("!report ")) {
        let report = content.replace("!report ", "");
        let rem = new Discord.MessageEmbed()
            .setTitle("**I just got a report:**")
            .addField("**From:**", user)
            .addField("**Content:**", report)
            .setColor("#ff0000");
        client.guilds.cache.find(guild => guild.id == guildID).channels.cache.find(channel => channel.id == "489599094793175041").send(rem).then(()=>{
            user.send(`Successfully sent your report to the admins of the Cult of Jabrils server!`).then(() => {}).catch(() => {});
        });
    }
    else {
        if(content.includes("discord.gg/") || content.includes("discordapp.com/invite") || content.includes("discord.gg/invite"))
            return user.send("It seems like your message contains an invite to a server.\nDue to people spamming the DMs with invite farm links, this DM will **not** be forwarded to the admins.");

        let isInGuild = false;
        client.guilds.cache.find(g => g.id == guildID).members.forEach(mem => {
            if(user.id == mem.id)
                isInGuild = true;
        });

        if(!isInGuild)
            return user.send("It seems like you are not a member of the Cult of Jabrils server anymore. This DM will **not** be forwarded to the admins.");

        let rem = new Discord.MessageEmbed()
            .setTitle("**I just got a DM:**")
            .addField("**User:**", user)
            .addField("**Content:**", content)
            .setColor("#ff0000");
        client.guilds.cache.find(guild => guild.id == guildID).channels.cache.find(channel => channel.id == "489605729624522762").send(rem).then(()=>{
            user.send(`Your DM has been forwarded to the admins of the Cult of Jabrils server.`).then(() => {}).catch(() => {});
        });
    }
}


// Sv443 | 2019-07-07 | check edited messages for bad words
client.on("messageUpdate", (oldmsg, newmsg) => {
    checkBadMessage(newmsg);
});


// Sv443 | 2019-10-25 | #TeamTrees server data channel
// function refreshTreeCount()
// {
//     let xhr = new XMLHttpRequest();
//     xhr.open("GET", "https://teamtrees.org/", true);

//     xhr.onreadystatechange = () => {
//         if(xhr.readyState == 4 && xhr.status < 300)
//         {
//             if(xhr.responseText == undefined)
//                 return;

//             let treeCount = "error";
//             let treeCountLine = "";
//             let htmlDoc = xhr.responseText.split(/\n/gm);

//             htmlDoc.forEach(line => {
//                 if(line.includes(`id="totalTrees"`))
//                     treeCountLine = line;
//             });

//             treeCount = treeCountLine.split(`data-count="`)[1];
//             if(jsl.isEmpty(treeCount)) return;

//             treeCount = treeCount.split(`"`)[0];
//             if(jsl.isEmpty(treeCount)) return;
            
//             treeCount = numberWithCommas(parseInt(treeCount));
//             if(jsl.isEmpty(treeCount)) return;

//             let channel = client.guilds.cache.find(g => g.id == guildID).channels.find(c => c.id == treeDataChannelID);
//             channel.setName("trees ꞉ " + treeCount); // template literal wouldn't work with the unicode whitespace char
//         }
//     }

//     xhr.send();
// }

// /**
//  * Turns a number into a string with commas as thousands separators.
//  * Example: 10000 -> 10,000
//  * @param {Number} x 
//  */
// function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "‚");
// }




client.login(config.token);