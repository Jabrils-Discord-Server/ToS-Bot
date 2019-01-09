const Discord = require('discord.js')
const client = new Discord.Client();
const config = require("./config.json");
var filter = require("./filter.js");

client.on("ready", () => {
    console.log(`John has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Abusing the Non-Mods`);
});

client.on('guildMemberAdd', member => {
    let addRole_newcomer = member.guild.roles.find("name", "newcomer");
    console.log(member.username + "has joined the server!");
    member.sendMessage("Hello! Im glad you joined our Cult, please read the rules in #rules, and afterwards if you agree to them, type ```!agree``` to gain access to the server!");
    member.addRole(addRole_newcomer);
});

client.on("message", message => {
    if(message.author.bot) return;
    var perms = message.member.roles.find("name", "user++") || message.member.roles.find("name", "Rot13")  || message.member.roles.find("name", "Arbiter of Fate")

    if (message.channel.id === '528708651284824094') {
        if (message.content.includes("!agree")) {
            message.delete();
            let removeRole_newcomer = message.member.guild.roles.find("name", "newcomer");
            message.member.sendMessage("Great, you made it! You can go over to #introduce-yourself and tell us a bit about yourself, your coding skill and your goals! \n Please read the #info completely! It is very important!");
            message.member.removeRole(removeRole_newcomer);
            return;
        }
        else {
            if (perms) return;
            message.delete();
            return;
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