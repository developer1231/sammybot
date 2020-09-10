require('dotenv').config({path: `.env`});

const Discord = require('discord.js');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const moment = require('moment');

const bot = new Discord.Client();

const Ping = require('./commands/status');
const Help = require('./commands/help');
const Add = require('./commands/add');
const Delete = require('./commands/delete');
const Default = require('./commands/setDefault');



let prefix = process.env.PREFIX;

bot.on('ready', function () {
    bot.user.setActivity(prefix + 'help for great birthday commands!').catch();
    wish();
});

bot.on('message', function (message) {
    if (message.author.bot) {
        return false;
    }

    if (message.channel.type === 'dm' || message.channel.type === 'group') {
        return false;
    }

    if (message.content.lastIndexOf(prefix, 0) === 0) {
        let commandUsed =
            Ping.parse(message) || 
            Add.parse(message) ||
            Delete.parse(message) ||
            Default.parse(message) ||
            Help.parse(message);
    }
});

bot.on('error', console.error);
console.log('bot is ready to throw some birthday-parties!')

new CronJob('0 0 7 * * *', function () {
    wish();
}, null, true, 'Europe/Amsterdam');

function wish() {
    let allguild = bot.guilds.array();

    allguild.forEach(function (guild) {

        let path = process.env.SERVER_PATH;
        let file = path + '/' + guild.id + '.json';

        fs.exists(file, function (exists) {
            if (exists) {
                fs.readFile(file, function readFileCallback(err, data) {
                    if (err) {
                    } else {
                        let obj = JSON.parse(data);

                        let today = moment();
                        let todayYear = today.year();
                        today.year(1970);

                        for (let key in obj.bdays) {


                            let bdate = moment(obj.bdays[key]);
                            let bdateYear = bdate.year();
                            bdate.year(1970);

                            if (today.isSame(bdate, 'd')) {
                                let age = todayYear - bdateYear;

                                let defaultChan = guild.channels.find(val => val.id === obj.default['channel']);
                                let user = guild.members.find(val => val.id === key);

                                if (defaultChan !== null) {

                                    let random = Math.random() * (100 - 1) + 1;

                                    if (random < 25) {
                                        defaultChan.send(
                                            "**Hey **" + user + "** ! Isn't it your birthday today? **" +
                                            "**It is your birthday! Congratz! How do you feel? ! have you just turned ? **" + age + "** years ? You have grown alot! You are old now!**" +
                                            "**HAPPY BIRTHDAY!!! WE WISH YOU THE BEST IN THE NEXT UPCOMING YEARS! !\n**" +
                                            "https://media.giphy.com/media/OXY6TyrhUNdlu/giphy.gif"
                                        );
                                    } else if (random > 25 && random < 50) {
                                        defaultChan.send(
                                            "**:tada: :gift: Happy Birthday to **" + user + "** ! he/she turned **" + age +
                                            "**years today ! :gift: :tada:\n**" +
                                            "https://media.giphy.com/media/cNTixPR4FC4zNe4fkC/giphy.gif"
                                        );
                                    } else if (random > 50 && random < 75) {
                                        defaultChan.send(
                                            "**:boom: Boom ! It is the birthday of.....** " + user +
                                            "** ! AH ! You didn't see it coming ! Lets be happy for him/her, for turning **" + age + "** ! :clap:\n**" +
                                            "https://media.giphy.com/media/XGt4jw7EJoNt6kRjwG/giphy.gif"
                                        );
                                    } else {
                                        defaultChan.send(
                                            "**WOW ! STOP EVERYTHING ! IT IS THE BIRTHDAY OF **" + user + "** ! HAPPY **" +
                                            "**FREAKING **" + age + "**BIRTHDAY !\n**" +
                                            "https://media.giphy.com/media/L0SVtu86DgL21RkZAB/giphy.gif"
                                        );
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    })
}

bot.login(process.env.TOKEN);