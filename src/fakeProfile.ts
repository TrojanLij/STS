/// <reference path="typeFix/fakerator.d.ts"/>

import * as Fakerator from "fakerator";
import { random, sample } from "lodash";
import { getRandomBadges, getRandomBilling, getRandomNitroBadge } from "./badges";
import { Badge, Nitro } from "./constants";
import { getRandomIp, randomString } from "./utils";

export class FakeAccount {
    private fakerator = Fakerator();
    private fakerData = this.fakerator.entity.user();
    private discordAccount: DiscordAccount;
    constructor() {
        this.discordAccount = new DiscordAccount(this);
    }
    get email() {
        return this.fakerData.email;
    }
    get name() {
        return `${this.fakerData.firstName} ${this.fakerData.lastName}`;
    }
    get faker() {
        return this.fakerData;
    }
    get discord() {
        return this.discordAccount;
    }
}

class DiscordAccount {
    private readonly customDiscriminators = ["1337", "0069", "1111", "4444", "6969", "6666", "9999"];
    private _discordVersion = `app-10.0.190${random(10, 99)}`;
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    private _id = random(399999999999999999, 699999999999999999);
    private discordName: string;
    private _discriminator = random(1000, 9999).toString();
    private _nitro: string;
    private _billing: string;
    private _badges: string[];
    private _token: string;
    private _ip: string;
    private _password: string;
    private _avatar: string;
    constructor(fakerData: FakeAccount) {
        this.discordName = fakerData.faker.userName;
        this._badges = [Badge.None];
        this.generateToken();
        this._ip = getRandomIp();
        if (!random(0, 3)) {
            if(!random(0, 5)) {
                this._badges = getRandomBadges(random(1, 5));
            } else {
                this._badges = getRandomBadges(random(1, 2));
            }
        }

        this._nitro = getRandomNitroBadge();
        if (this._nitro !== Nitro.None) {
            if (!random(0, 5)) { // random chance that user will have set their discriminator
                this._discriminator = sample(this.customDiscriminators);
            }
        }
        this._billing = getRandomBilling();
        this._password = fakerData.faker.password;
        this._avatar = fakerData.faker.avatar;
    }
    get id() {
        return this._id;
    }
    get tag() {
        return `${this.discordName}#${this._discriminator}`;
    }
    get name() {
        return this._discriminator;
    }
    get discriminator() {
        return this._discriminator;
    }
    get nitor() {
        return this._nitro;
    }
    get billing() {
        return this._billing;
    }
    get token() {
        return this._token;
    }
    get badges() {
        return this._badges.join(" ");
    }
    get ip() {
        return this._ip;
    }
    get discordVersion() {
        return this._discordVersion;
    }
    get avatar() {
        return this._avatar;
    }
    get password() {
        return this._password;
    }
    generatePassword() {
        const fakerator = Fakerator();
        const fakerData = fakerator.entity.user();
        this._password = fakerData.password;
        this.generateToken();
    }
    private generateToken() {
        this._token = `${randomString(24)}.${randomString(6)}.${randomString(27)}`;
    }
}

// function generateRandomProfile() {
//     const injectionPath = getInjectionPath(name, discordVersionName)
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

