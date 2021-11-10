const _ = require('lodash');
const { pirateStealerConfig, generateRandomProfileWithPic, generateRandomProfile, genRandomBadges, RARE_BADGES } = require('./utils');

async function getUserLogonEmbed(account) {
    account = account || await generateRandomProfileWithPic();
    const friends = _.random(0, 1000);
    const rareFriends = _.random(0, friends * 0.25) ? _.random(_.clamp(Math.floor(friends * 0.25), 1, 8)) : 0; 
    let rareFriendsMsg = ''
    if (rareFriends) {
        for (let i = 0; i < rareFriends; i++) {
            rareFriendsMsg += `${genRandomBadges(_.random(1, 3), RARE_BADGES)} ${generateRandomProfile().tag}\n`
        }
    } else {
        rareFriendsMsg = 'No Rare Friends'
    }
    
    const { injectionInfo, id, billing, tag, token, password, image, nitro, email, badges } = account;
    return {
        username: 'PirateStealer',
        embeds: [{
            title: 'User Login',
            color: pirateStealerConfig['embed-color'],
            fields: [{
                name: 'Info',
                value: injectionInfo,
                inline: false
            }, {
                name: 'Username',
                value: `\`${tag}\``,
                inline: true
            }, {
                name: 'ID',
                value: `\`${id}\``,
                inline: true
            }, {
                name: 'Nitro',
                value: `${nitro}`,
                inline: false
            }, {
                name: 'Badges',
                value: `${badges}`,
                inline: false
            }, {
                name: 'Billing',
                value: `${billing}`,
                inline: false
            }, {
                name: 'Email',
                value: `\`${email}\``,
                inline: true
            }, {
                name: 'Password',
                value: `\`${password}\``,
                inline: true
            }, {
                name: 'Token',
                value: `\`\`\`${token}\`\`\``,
                inline: false
            }],
            author: {
                name: 'PirateStealer'
            },
            footer: {
                text: 'PirateStealer'
            },
            thumbnail: {
                url: image
            }
        }, {
            title: `Total Friends (${friends})`,
            color: pirateStealerConfig['embed-color'],
            description: rareFriendsMsg,
            author: {
                name: 'PirateStealer'
            },
            footer: {
                text: 'PirateStealer'
            },
            thumbnail: {
                url: image
            }
        }]
    };
} 
module.exports.getUserLogonEmbed = getUserLogonEmbed;