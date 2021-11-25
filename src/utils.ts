import { Rare } from "./interfaces";
import * as randomIpv4 from "random-ipv4";

export function createRare<D = any>(rareObjects: Rare<D>[]): D[] {
    const rareNumbers = rareObjects.map(r => r.rare);
    const max = Math.max.apply(null, rareNumbers);
    const filler: D[] = [];
    for (const rareObject of rareObjects) {
        for (let i = 0; i < max + 1  - rareObject.rare ; i++) {
            filler.push(rareObject.data);
        }
    }
    filler.sort(() => Math.random() > 0.5 ? 1 : -1);
    return filler;
}

export function pushUniq<T>(array: T[], item: T) {
    const index = array.indexOf(item);

    if (index === -1) {
        array.push(item);
        return array.length;
    } else {
        return index + 1;
    }
}

export function removeItem<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);

    if (index !== -1) {
        items.splice(index, 1);
        return true;
    } else {
        return false;
    }
}


export function randomString(length: number) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function getRandomIp(): string {
    return randomIpv4("{token1}.{token2}.{token3}.{token4}", {
        token1: {
            min: 1,
            max: 254,
        },
        token2: {
            min: 0,
            max: 254,
        },
        token3: {
            min: 0,
            max: 254,
        },
        token4: {
            min: 2,
            max: 254,
        },
    });
}

// function getInjectionPath(user, appinfo) {
//     return `C:\\Users\\${user}\\AppData\\Local\\Discord\\${appinfo}\\modules\\discord_desktop_core-1\\discord_desktop_core`;
// }

// function isCommand(msg, checker) {
//     return getArgsRaw(msg)[0].toLowerCase() === `${prefix}${checker}`.toLowerCase();
// }

// function getArgsRaw(msg) {
//     return msg.content.replace(/ +(?= )/g,'').split(' ');
// }

// function getCommandArgs(msg) {
//     const args = getArgsRaw(msg);
//     args.shift();
//     return args;
// }

// async function generateRandomProfileWithPic() {
//     const image = await getRandomImage();
//     const account = generateRandomProfile();
//     return {
//         ...account,
//         image
//     }
// }

// function generateRandomProfile() {
//     const computerName = `DESKTOP-${randomString(7)}`.toUpperCase();
//     const fakerData = fakerator.entity.user();
//     const email = fakerData.email;
//     const name = `${fakerData.firstName} ${fakerData.lastName}`;
//     const discordVersionName = `app-10.0.190${_.random(10, 99)}`;
//     const id = _.random(399999999999999999, 699999999999999999);
//     const discriminator = _.random(1000, 9999);
//     const discordName = _.sample(name.split().filter((e) => e.length > 3)) || randomString(_.random(3, 9));
//     const injectionPath = getInjectionPath(name, discordVersionName)
//     const nitro = _.sample(NITROS);
//     const billing = _.sample(BILLING);
//     const badges = getRealisticRandomBadges();
//     const ip = getRandomIp();
//     const injectionInfo = `\`\`\`Hostname: \n${computerName}\nIP: \n${ip}\nInjection Info: \n${injectionPath}\n\`\`\``;
//     const tag = `${discordName}#${discriminator}`;
//     const password = generatePassword();
//     const token = getRandomToken();
//     return {
//         id,
//         ip,
//         token,
//         email,
//         injectionInfo,
//         injectionPath,
//         password,
//         fakerData,
//         computerName,
//         discordVersionName,
//         discriminator,
//         tag,
//         nitro,
//         billing,
//         badges
//     }
// }

// async function getRandomImage() {
//     let req = "https://picsum.photos/500/500";
//     try {
//         const e = await axios.default.get("https://picsum.photos/500/500");
//         req = e.request.res.responseUrl;
//     } catch (error) {
//         console.error(error);
//     }
//     return req;
// }

// function randomString(length) {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     for (let i = length; i > 0; --i)
//       result += chars[Math.floor(Math.random() * chars.length)];
//     return result;
//   }

// function randomNumString(n) {
//     let add = 1,
//         max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

//     if (n > max) {
//         return generate(max) + generate(n - max);
//     }

//     max = Math.pow(10, n + add);
//     let min = max / 10; // Math.pow(10, n) basically
//     let number = Math.floor(Math.random() * (max - min + 1)) + min;

//     return ("" + number).substring(add);
// }

// function convertTimestamp(timestamp) {
//     let d = new Date(timestamp), // Convert the passed timestamp to milliseconds
//         yyyy = d.getFullYear(),
//         mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
//         dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
//         hh = d.getHours(),
//         h = hh,
//         min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
//         ampm = "AM",
//         time;

//     if (hh > 12) {
//         h = hh - 12;
//         ampm = "PM";
//     } else if (hh === 12) {
//         h = 12;
//         ampm = "PM";
//     } else if (hh == 0) {
//         h = 12;
//     }

//     // ie: 2013-02-18, 8:35 AM
//     time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;

//     return time;
// }

// function getBadges(e) {
// let t = "";
// return (
//     1 == (1 & e) && (t += "<:staff:874750808728666152> "),
//     2 == (2 & e) && (t += "<:partner:874750808678354964> "),
//     4 == (4 & e) && (t += "<:hypesquad_events:874750808594477056> "),
//     8 == (8 & e) && (t += "<:bughunter_1:874750808426692658> "),
//     64 == (64 & e) && (t += "<:bravery:874750808388952075> "),
//     128 == (128 & e) && (t += "<:brilliance:874750808338608199> "),
//     256 == (256 & e) && (t += "<:balance:874750808267292683> "),
//     512 == (512 & e) && (t += "<:early_supporter:874750808414113823> "),
//     16384 == (16384 & e) && (t += "<:bughunter_2:874750808430874664> "),
//     131072 == (131072 & e) && (t += "<:developer:874750808472825986> "),
//     "" == t && (t = "None"),
//     t
// );
// }

// function getNitro(e) {
//     return 0 == e
//         ? "No Nitro"
//         : 1 == e
//         ? "<:classic:896119171019067423> 'Nitro Classic'"
//         : 2 == e
//         ? "<a:boost:824036778570416129> 'Nitro Boost'"
//         : "No Nitro";
// }
// function genRandomBadges(n, badges = BADGES) {
//     if (n >= badges.length) {
//         return badges.join(' ');
//     } else {
//         const uniqueBadges = _.sampleSize(badges, n);

//         if (uniqueBadges.length >= 1) {
//             const removedNone = uniqueBadges.filter(e => e !== 'None')
//             if (removedNone.length === 0) {
//                 return 'None';
//             } else {
//                 return removedNone.join(' ');
//             }
//         } else {
//             return 'None';
//         }
//     }
// }
// function getRealisticRandomBadges() {
//     return _.random(0, 10) ? genRandomBadges(0, 2) : genRandomBadges(0, 5)
// }

// function getRandomToken() {
//     return `${randomString(24)}.${randomString(6)}.${randomString(27)}`
// }

// function getRandomIp() {
//     return randomIpv4('{token1}.{token2}.{token3}.{token4}', {
//         token1: {
//           min: 1,
//           max: 254,
//         },
//         token2: {
//           min: 0,
//           max: 254,
//         },
//         token3: {
//           min: 0,
//           max: 254,
//         },
//         token4: {
//           min: 2,
//           max: 254,
//         },
//       });
// }

// function quoteEscape(msg) {
//     return msg.toString().replace(/\`/g, '`').replace(/`/g, '/\`')
// }

// function warpTripleQuote(msg) {
//     return `\`\`\`${quoteEscape(msg)}\`\`\``;
// }

// function warpInQuote(msg) {
//     return `\`${quoteEscape(msg)}\``;
// }

// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// function wiggleNumber(number, max) {
//     const half = max * 0.5;
//     const rad = _.random(max);
//     return number - half + rad;
// }


// const pirateStealerConfig = {
//     logout: "%LOGOUT%",
//     "logout-notify": "%LOGOUTNOTI%",
//     "init-notify": "%INITNOTI%",
//     "embed-color": 3447704,
//     "disable-qr-code": "%DISABLEQRCODE%",
// };

