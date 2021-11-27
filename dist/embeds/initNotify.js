"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitNotifyEmbed = void 0;
const fakeProfile_1 = require("../fakeProfile");
const baseEmbed_1 = require("./helpers/baseEmbed");
const utils_1 = require("../utils");
async function getInitNotifyEmbed(config, account = new fakeProfile_1.FakeAccount()) {
    const { embeds, webhookMessage } = (0, baseEmbed_1.getBaseEmbeds)(config);
    const embed = embeds[0];
    embed.setTitle(":detective: Successfull injection"); // Misspelled in original pirate stealer
    embed.setFields([{
            name: ":syringe: Inject Path",
            value: (0, utils_1.warpTripleQuote)(`${account.injectionPath}/index.js`),
            inline: false
        }]);
    return webhookMessage();
}
exports.getInitNotifyEmbed = getInitNotifyEmbed;
