const Command = require('./command');

module.exports = class Ping extends Command {
    static match(message) {
        return message.content.startsWith(process.env.PREFIX + 'status');
    }

    static action(message) {
        message.reply('The bot is working fine! Great! So the rest should be too!! :white_check_mark:');
    }
};