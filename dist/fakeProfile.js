"use strict";
/// <reference path="typeFix/fakerator.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeAccount = void 0;
const Fakerator = require("fakerator");
const lodash_1 = require("lodash");
const badges_1 = require("./badges");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const axios_1 = require("axios");
const log_1 = require("./log");
const discords = (0, utils_1.createRare)([
    { data: "Discord", rare: 0 },
    { data: "DiscordCanary", rare: 25 },
    { data: "DiscordDevelopment", rare: 200 },
]);
class FakeAccount {
    fakerator = Fakerator();
    fakerData = this.fakerator.entity.user();
    discordAccount;
    computerName;
    _injectionPath;
    constructor() {
        this.discordAccount = new DiscordAccount(this);
        this.computerName = (0, lodash_1.random)(0, 10) ? `${this.faker.firstName} ${this.faker.lastName}` : this.faker.userName;
        const folderIdSomethingSomething = (0, lodash_1.random)(0, 1) ? 1 : (0, lodash_1.random)(1, 122);
        this._injectionPath = `C:\\Users\\${this.computerName}\\AppData\\Local\\${(0, lodash_1.sample)(discords)}\\${this.discord.discordVersion}\\modules\\discord_desktop_core-${folderIdSomethingSomething}\\discord_desktop_core`;
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
exports.FakeAccount = FakeAccount;
class DiscordAccount {
    static imageLorem = "https://picsum.photos/500/500";
    customDiscriminators = ["1337", "0069", "1111", "4444", "6969", "6666", "9999"];
    _discordVersion = `app-10.0.190${(0, lodash_1.random)(10, 99)}`;
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    _id = (0, lodash_1.random)(399999999999999999, 699999999999999999).toString();
    _discriminator = (0, lodash_1.random)(1000, 9999).toString();
    discordName;
    _password;
    _billing;
    _badges;
    _avatar;
    _nitro;
    _token;
    _email;
    _ip;
    constructor(fakerData) {
        this.discordName = fakerData.faker.userName;
        this._badges = [constants_1.Badge.None];
        this.generateToken();
        this._ip = (0, utils_1.getRandomIp)();
        if (!(0, lodash_1.random)(0, 50)) {
            if ((0, lodash_1.random)(0, 100)) {
                this._badges = (0, badges_1.getRandomBadges)(1);
            }
            else if (!(0, lodash_1.random)(0, 200)) {
                this._badges = (0, badges_1.getRandomBadges)((0, lodash_1.random)(1, 3));
            }
            else if (!(0, lodash_1.random)(0, 500)) {
                this._badges = (0, badges_1.getRandomBadges)((0, lodash_1.random)(1, 5));
            }
            else {
                this._badges = (0, badges_1.getRandomBadges)((0, lodash_1.random)(1, 10));
            }
        }
        this._nitro = (0, badges_1.getRandomNitroBadge)();
        if (this._nitro !== constants_1.Nitro.None) {
            if (!(0, lodash_1.random)(0, 5)) { // random chance that user will have set their discriminator
                this._discriminator = (0, lodash_1.sample)(this.customDiscriminators);
            }
        }
        this._billing = (0, badges_1.getRandomBilling)();
        this._password = fakerData.faker.password;
        this._email = fakerData.faker.email;
    }
    async getAvatar() {
        if (this._avatar) {
            return this._avatar;
        }
        try {
            const e = await axios_1.default.get(DiscordAccount.imageLorem);
            this._avatar = e.request.res.responseUrl;
        }
        catch (error) {
            (0, log_1.writeError)(error, "DiscordAccount.getAvatar()");
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
    generateToken() {
        this._token = `${(0, utils_1.randomString)(24)}.${(0, utils_1.randomString)(6)}.${(0, utils_1.randomString)(27)}`;
    }
}
