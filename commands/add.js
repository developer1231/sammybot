const Command = require('./command');
const moment = require('moment');

module.exports = class Add extends Command {
    static match(message) {
        return message.content.startsWith(process.env.PREFIX + 'add');
    }

    static action(message) {
        let bPerson = message.author;
        let server = message.guild;

        let args = message.content.split(' ');

        let dateFormat = process.env.DATE_FORMAT;

        if (moment(args[1], dateFormat, true).isValid()) {
            let bDate = moment(args[1], dateFormat);
            bDate.add(12, 'h');

            let potentialAge = moment().year() - bDate.year();
            if (potentialAge < 13) {
                message.reply("Are you " + potentialAge + " years old ? Really....  that can't be right.. ! "
                     +
                    "https://media.giphy.com/media/4OJFCEeGzYGs0/giphy.gif")
                    .then()
                    .catch();
                return false;
            } else if (potentialAge > 90) {
                message.reply("Mmmh... :thinking: are you " + potentialAge + " years old ? Are you sure ? :older_man:" +
                    ":older_woman: \n" +
                    "https://media.giphy.com/media/m8eIbBdkJK7Go/giphy.gif")
                    .then()
                    .catch();
                return false;
            }

            let path = process.env.SERVER_PATH;
            let file = path + '/' + server.id + '.json';

            let fs = require('fs');

            let obj = {};

            fs.exists(file, function (exists) {
                if (exists) {
                    fs.readFile(file, function readFileCallback(err, data) {
                        if (err) {
                        } else {
                            obj = JSON.parse(data);

                            if (obj.hasOwnProperty("bdays")) {
                                if (obj.bdays.hasOwnProperty(bPerson.id)) {
                                    message.reply("Your birthday has been changed and set!")
                                        .then()
                                        .catch();
                                } else {
                                    message.reply("Your birthday has been set!")
                                        .then()
                                        .catch();
                                }

                            } else {
                                obj.bdays = new Object();

                                message.reply("Your birthday has been added! (Congratz, you are the first one! :clap:).")
                                    .then()
                                    .catch();
                            }

                            obj.bdays[bPerson.id] = bDate;

                            let json = JSON.stringify(obj);
                            fs.writeFileSync(file, json);
                        }
                    });
                } else {
                    obj.bdays = new Object();

                    obj.bdays[bPerson.id] = bDate;

                    let json = JSON.stringify(obj);
                    fs.writeFileSync(file, json);

                    message.reply("Your birthday has been added! (Congratz, you are the first one! :clap:).")
                        .then()
                        .catch();
                }
            });
        } else {
            message.reply(" This is not formatted right! have you forgot your own birthday? Use the provided format below! :face_palm:" +
                '\n' + "As a reminder, this is the format to use : `" + dateFormat + "`")
                .then()
                .catch();
            return false;
        }
    }
};