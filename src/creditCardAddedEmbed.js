const { pirateStealerConfig, generateRandomProfileWithPic, warpTripleQuote, randomNumString } = require('./utils');
const _ = require("lodash");
const generator = require("creditcard-generator");

const CREDIT_CARDS = [
    {
        name: "Amex",
        len: 4,
    },
    {
        name: "VISA",
        len: 3,
    },
    {
        name: "Mastercard",
        len: 3,
    },
    {
        name: "Diners",
        len: 4,
    },
        {
        name: "Discover",
        len: 3,
    },
    {
        name: "EnRoute",
        len: 4,
    },
    {
        name: "JCB",
        len: 4,
    },
    {
        name: "Voyager",
        len: 4,
    },
]

async function getCreditCardEmbed(account) {
    account = account || await generateRandomProfileWithPic();
    const {id, tag, email, nitro, badges, ip, token, fakerData, image } = account;
    account.billing = '`✔️` :credit_card:'
    const card = generator.GenCC(_.sample(CREDIT_CARDS).name);
    const currentYear = parseInt((new Date()).getFullYear().toString().slice(2), 10);
    const expirationYear = _.random(currentYear, currentYear + 10);

    const description = [
        `**Username:**${warpTripleQuote(tag)}`,
        `**ID:**${warpTripleQuote(id)}`,
        `**Email:**${warpTripleQuote(email)}`,
        `**Nitro Type**:${warpTripleQuote(nitro)}`,
        `**Badges:**${warpTripleQuote(badges)}`,
        `**Credit Card Number: **${warpTripleQuote(card)}`,
        `**Credit Card Expiration: **${warpTripleQuote(`${_.random(1, 12)}/${expirationYear}`)}`,
        `**CVC: **${warpTripleQuote(randomNumString(3))}`,
        `**Country: **${warpTripleQuote(fakerData.address.country)}`,
        `**State: **${warpTripleQuote(fakerData.address.state)}`,
        `**City: **${warpTripleQuote(fakerData.address.city)}`,
        `**ZIP:**${warpTripleQuote(fakerData.address.zip)}`,
        `**Street: **${warpTripleQuote(fakerData.address.street)}`,
        `**Token:**${warpTripleQuote(token)}`,
        `**IP: **${warpTripleQuote(ip)}`,
    ].join('\n')

    return {
        username: "PirateStealer",
        embeds: [{
          title: "User Credit Card Added",
          description,
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

module.exports.getCreditCardEmbed = getCreditCardEmbed;
