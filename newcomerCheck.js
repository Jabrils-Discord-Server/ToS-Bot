const fs = require("fs");

const newcomerFilePath = "./data/newcomers.txtdb";
const separator = ""; // record separator - U+001E
const daysUntilKick = 1;



module.exports.addNewcomer = memberID => {
    // fs.appendFileSync(newcomerFilePath, `${memberID}${separator}${new Date().toString()}\n`);
}

module.exports.checkNewcomers = (guild, callback) => {
    // if(callback == null) callback = ()=>{};
    // var allNewcomers = fs.readFileSync(newcomerFilePath).toString().split("\n");
    // allNewcomers.pop();
    
    // for(let i = 0; i < allNewcomers.length; i++) {
    //     allNewcomers[i] = [allNewcomers[i].split(separator)[0], allNewcomers[i].split(separator)[1]];
    // }

    // for(let i = 0; i < allNewcomers.length; i++) {
    //     let ncDate = new Date(allNewcomers[i][1]);
    //     let maxDate = new Date().setDate(ncDate.getDate() + daysUntilKick);

    //     if(maxDate < ncDate) {
    //         let kickMember = guild.members.find(member => member.id == allNewcomers[i][0]);
    //         if(kickMember != null) {
    //             if(kickMember.roles.find(role => role.name == "newcomer")) {
    //                 console.log("\x1b[36m\x1b[1m[kick]\x1b[0m " + kickMember);
    //                 callback(kickMember);
    //                 kickMember.send(`You haven't agreed to our rules within ${daysUntilKick} ${daysUntilKick < 2 ? "day" : "days"} and were automatically kicked.\nIf you forgot about it, please re-join the server with this invite and don't forget to agree to our rules! Thank you :)\n\nhttps://discord.gg/8D3pJ4K`);
    //                 kickMember.kick();
    //                 guild.channels.find(channel => channel.id == "489599094793175041").send(`I just kicked the member ${allNewcomers[i][0]} after ${daysUntilKick} ${daysUntilKick < 2 ? "day" : "days"} of not-agreeing`);
    //             }
    //         }
    //     }
    // }
}