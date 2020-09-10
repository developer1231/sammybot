const Command = require('./command');

module.exports = class Add extends Command {
    static match(message) {
        return message.content.startsWith(process.env.PREFIX + 'setDefault');
    }

    static action(message) {
        let author = message.author;
        let member = message.member;
        let perm = member.permissions.toArray();
        let indAdm = perm.indexOf("ADMINISTRATOR");

        if (indAdm === -1) {
            message.reply('``Hey,  ' + author + ' You apparently do not have permissions to use this command!! :rage:\n``' +
                'https://media.giphy.com/media/vSR0fhtT5A9by/giphy.gif');
            return false;
        }

        let server = message.guild;

        let path = process.env.SERVER_PATH;
        let file = path + '/' + server.id + '.json';

        if (message.channel.nsfw) {
            message.reply('``You cannot set the default channel to a NSFW or Restricted channel!``');
            return false;
        }

        let fs = require('fs');

        let obj = {};

        fs.exists(file, function (exists) {
            if (exists) {
                fs.readFile(file, function readFileCallback(err, data) {
                    if (err) {
                    } else {
                        obj = JSON.parse(data);

                        if (obj.hasOwnProperty("default") === false) {
                            obj.default = new Object();
                        }

                        obj.default['channel'] = message.channel.id;

                        let json = JSON.stringify(obj);
                        fs.writeFileSync(file, json);

                        message.reply('``The default channel has been set and changed!``');
                    }
                });
            } else {
                obj.default = new Object();

                obj.default['channel'] = message.channel.id;

                let json = JSON.stringify(obj);
                fs.writeFileSync(file, json);

                message.reply('``The default channel has been set and changed!``');
            }
        });
    }
};