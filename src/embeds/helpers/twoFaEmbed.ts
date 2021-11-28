import { EmbedField, MessageEmbed } from "discord.js";
import { COPY_ON_MOBILE } from "../../constants";

export function prepare2FaEmbed(embed:MessageEmbed, codes: string[]) {
    embed.setTitle(":detective: __2FA Codes__");

    const backupCodes:string[] = [];
    let linkBuilder = COPY_ON_MOBILE;
    for (let i = 0; i < codes.length; i++) {
        backupCodes.push(codes[i]);
        linkBuilder += `${codes[i]}<br>`;
    }
    const embedFiles:EmbedField[] = backupCodes.map(c => {
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
