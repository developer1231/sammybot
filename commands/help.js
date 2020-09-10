const Command = require('./command');
const { DiscordAPIError, RichEmbed } = require('discord.js');
const Discord = require ('discord.js');



const exampleEmbed = new Discord.RichEmbed()
.setTitle('**All the available commands!**')
.setFooter('Birthday Bot Hosted for Oxygen!')
.setColor('#00008B')
.addField('!help => Shows all the commands of this bot', '!add [' + process.env.DATE_FORMAT + '] => Add your birthday')
.addField('!delete => Will delete your name and birthday from the database*', '!setDefault => Set the channel where the birthdays will be announced (Admin only)')
.addField('!status => (simply to test the bots status)', '----------------------------')
.setImage('https://media.giphy.com/media/26FPpSuhgHvYo9Kyk/giphy.gif')



module.exports = class Help extends Command {
    static match(message) {
        return message.content.startsWith(process.env.PREFIX + 'help');
    }




    static action(message) {
        message.reply(exampleEmbed);
    }
};