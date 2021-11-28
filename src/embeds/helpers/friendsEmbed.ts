import { MessageEmbed } from "discord.js";
import { clamp } from "lodash";
import { RARE_BADGES } from "../../constants";
import { FakeAccount } from "../../fakeProfile";

const RARE_FRIENDS_LIMIT = 25; // Longer might exceed the embed limit

export async function prepareFriendsEmbed(embed: MessageEmbed, account: FakeAccount) {
    const rareFriends: FakeAccount[] = [];

    for (const fakeFriend of account.discord.friends) {
        for (const badge of fakeFriend.discord.badges) {
            if((RARE_BADGES as string[]).includes(badge)) {
                rareFriends.push(fakeFriend);
                break;
            }
        }
    }
    let rareFriendsMsg = "No Rare Friends";
    if (rareFriends.length) {
        rareFriendsMsg = "";
        for (let i = 0; i < clamp(rareFriends.length, 0, RARE_FRIENDS_LIMIT); i++) {
            const disAcc = rareFriends[i].discord;
            rareFriendsMsg += `${disAcc.badges.join(" ")} ${disAcc.tag}`;
        }
    }
    embed.setTitle(`Total Friends (${account.discord.friends.length})`);
    embed.setDescription(rareFriendsMsg);
    embed.setThumbnail(await account.discord.getAvatar());
}
