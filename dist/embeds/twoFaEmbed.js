"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare2FaEmbed = void 0;
const constants_1 = require("../constants");
function prepare2FaEmbed(embed, codes) {
    embed.setTitle(":detective: __2FA Codes__");
    const backupCodes = [];
    let linkBuilder = constants_1.COPY_ON_MOBILE;
    for (let i = 0; i < codes.length; i++) {
        backupCodes.push(codes[i]);
        linkBuilder += `${codes[i]}<br>`;
    }
    const embedFiles = backupCodes.map(c => {
        return {
            name: "Code",
            value: c,
            inline: true,
        };
    });
    embed.setDescription(`[Get all of them](${linkBuilder})`),
        embed.setFields(embedFiles);
    return embed;
}
exports.prepare2FaEmbed = prepare2FaEmbed;
