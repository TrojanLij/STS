/// <reference path="typeFix/fakerator.d.ts"/>

import * as Fakerator from "fakerator";
import { random, sample } from "lodash";
import { getRandomBadges, getRandomBilling, getRandomNitroBadge } from "./badges";
import { Badge, Nitro } from "./constants";
import { createRare, getRandomIp, randomString } from "./utils";
import { default as axios } from "axios";
import { writeError } from "./log";

const discords = createRare([
    { data: "Discord", rare: 0 },
    { data: "DiscordCanary", rare: 25 },
    { data: "DiscordDevelopment", rare: 200 },
]);

export class FakeAccount {
    private fakerator = Fakerator();
    private fakerData = this.fakerator.entity.user();
    private discordAccount: DiscordAccount;
    private computerName: string;
    private _injectionPath: string;
    constructor() {
        this.discordAccount = new DiscordAccount(this);
        this.computerName = random(0, 10) ? `${this.faker.firstName} ${this.faker.lastName}` : this.faker.userName;
        const folderIdSomethingSomething = random(0, 1) ? 1 : random(1, 122);

        this._injectionPath = `C:\\Users\\${this.computerName}\\AppData\\Local\\${sample(discords)}\\${this.discord.discordVersion}\\modules\\discord_desktop_core-${folderIdSomethingSomething}\\discord_desktop_core`;
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
    get injectionPath() {
        return this._injectionPath;
    }
}

class DiscordAccount {
    public static readonly imageLorem =  "https://picsum.photos/500/500";
    private readonly customDiscriminators = ["1337", "0069", "1111", "4444", "6969", "6666", "9999"];
    private _discordVersion = `app-10.0.190${random(10, 99)}`;
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    private _id = random(399999999999999999, 699999999999999999).toString();
    private discordName: string;
    private _discriminator = random(1000, 9999).toString();
    private _nitro: string;
    private _billing: string;
    private _badges: string[];
    private _token: string;
    private _ip: string;
    private _password: string;
    private _avatar: string;
    private _email: string;
    constructor(fakerData: FakeAccount) {
        this.discordName = fakerData.faker.userName;
        this._badges = [Badge.None];
        this.generateToken();
        this._ip = getRandomIp();
        if (!random(0, 50)) {
            if (random(0, 100)) {
                this._badges = getRandomBadges(1);
            } else if (!random(0, 200)) {
                this._badges = getRandomBadges(random(1, 3));
            } else if (!random(0, 500)) {
                this._badges = getRandomBadges(random(1, 5));
            } else {
                this._badges = getRandomBadges(random(1, 10));
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
        this._email = fakerData.faker.email;
    }
    async getAvatar() {
        if (this._avatar) {
            return this._avatar;
        }
        try {
            const e = await axios.get(DiscordAccount.imageLorem);
            this._avatar = e.request.res.responseUrl;
        } catch (error) {
            writeError(error, "DiscordAccount.getAvatar()");
            console.error(error);
        }
        return DiscordAccount.imageLorem;
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
    get nitro() {
        return this._nitro;
    }
    get billing() {
        return this._billing;
    }
    get token() {
        return this._token;
    }
    get badges() {
        return this._badges;
    }
    get ip() {
        return this._ip;
    }
    get discordVersion() {
        return this._discordVersion;
    }
    get password() {
        return this._password;
    }
    get email() {
        return this._email;
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
