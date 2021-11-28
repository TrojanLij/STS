"use strict";
/// <reference path="typeFix/fakerator.d.ts"/>
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeAccount = void 0;
const fakerator_1 = __importDefault(require("fakerator"));
const lodash_1 = require("lodash");
const badges_1 = require("./badges");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
const log_1 = require("./log");
const generator = __importStar(require("creditcard-generator"));
const DISCORD_FRIEND_LIMIT = 1000;
const discords = (0, utils_1.createRare)([
    { data: "Discord", rare: 0 },
    { data: "DiscordCanary", rare: 25 },
    { data: "DiscordDevelopment", rare: 200 },
]);
const imageCacheLimit = 100;
const imageCache = [];
class FakeAccount {
    constructor() {
        this.fakerator = (0, fakerator_1.default)();
        this.fakerData = this.fakerator.entity.user();
        this.discordAccount = new DiscordAccount(this);
        this._computerName = (0, lodash_1.random)(0, 10) ? `${this.faker.firstName} ${this.faker.lastName}` : this.faker.userName;
        const folderIdSomethingSomething = (0, lodash_1.random)(0, 1) ? 1 : (0, lodash_1.random)(1, 122);
        this._injectionPath = `C:\\Users\\${this._computerName}\\AppData\\Local\\${(0, lodash_1.sample)(discords)}\\${this.discord.discordVersion}\\modules\\discord_desktop_core-${folderIdSomethingSomething}\\discord_desktop_core`;
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
    get computerName() {
        return this._computerName;
    }
}
exports.FakeAccount = FakeAccount;
class DiscordAccount {
    constructor(fakerData) {
        this.customDiscriminators = ["1337", "0069", "1111", "4444", "6969", "6666", "9999", "0001"];
        this._discordVersion = `app-10.0.190${(0, lodash_1.random)(10, 99)}`;
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        this._id = (0, lodash_1.random)(399999999999999999, 699999999999999999).toString();
        this._discriminator = (0, lodash_1.random)(1000, 9999).toString();
        this.creditCards = [];
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
        if (this.billing === constants_1.Billing.CreditCard) {
            this.creditCards.push(this.generateCreditCard());
        }
        this._password = fakerData.faker.password;
        this._email = fakerData.faker.email;
        if ((0, lodash_1.random)(0, 1)) {
            this._twoFACode = [];
            const backupCodesCount = (0, lodash_1.random)(0, 10) ? 10 : (0, lodash_1.random)(5, 10);
            for (let i = 0; i < backupCodesCount; i++) {
                this._twoFACode.push(`${(0, utils_1.randomString)(4)}-${(0, utils_1.randomString)(4)}`.toLowerCase());
            }
        }
    }
    async getAvatar() {
        if (this._avatar) {
            return this._avatar;
        }
        try {
            const response = await axios_1.default.get(DiscordAccount.imageLorem);
            this._avatar = response.request.res.responseUrl;
            imageCache.push(this._avatar);
            if (imageCache.length > imageCacheLimit) {
                imageCache.shift();
            }
            return this._avatar;
        }
        catch (error) {
            (0, log_1.writeError)(error, "DiscordAccount.getAvatar()");
            console.error(error);
        }
        const avatar = (0, lodash_1.sample)(imageCache) || DiscordAccount.imageLorem;
        this._avatar = avatar;
        return this._avatar;
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
    get twoFACode() {
        return this._twoFACode;
    }
    generateNewEmail() {
        const fakerator = (0, fakerator_1.default)();
        const fakerData = fakerator.entity.user();
        this._email = fakerData.email;
    }
    generatePassword() {
        const fakerator = (0, fakerator_1.default)();
        const fakerData = fakerator.entity.user();
        this._password = fakerData.password;
        this.generateToken();
    }
    generateCreditCard() {
        const card = generator.GenCC((0, lodash_1.sample)(Object.keys(generator.Schemes)));
        const currentYear = parseInt((new Date()).getFullYear().toString().slice(2), 10);
        const expirationYear = (0, lodash_1.random)(currentYear, currentYear + 4);
        const creditCard = {
            id: card[0],
            cvc: (0, lodash_1.random)(111, 999).toString(),
            expiration: expirationYear.toString(),
        };
        return creditCard;
    }
    addCreditCard() {
        const card = this.generateCreditCard();
        this.creditCards.push(card);
        this._billing = constants_1.Billing.CreditCard;
        return card;
    }
    generateToken() {
        this._token = `${(0, utils_1.randomString)(24)}.${(0, utils_1.randomString)(6)}.${(0, utils_1.randomString)(27)}`;
    }
    // generate friends only if it called to prevent infinity loop on creation of the object
    get friends() {
        if (!this._friends) {
            this._friends = [];
            let friendsCount = DISCORD_FRIEND_LIMIT;
            for (let index = 0; index < (0, lodash_1.random)(0, DISCORD_FRIEND_LIMIT * 0.025); index++) {
                friendsCount = Math.round((0, lodash_1.random)(0, 1) ? (0, lodash_1.random)(0, friendsCount) : (0, lodash_1.random)(0, Math.round(friendsCount * 0.5)));
            }
            for (let i = 0; i < (0, lodash_1.random)(0, friendsCount); i++) {
                this.friends.push(new FakeAccount());
            }
        }
        return this._friends;
    }
}
DiscordAccount.imageLorem = "https://picsum.photos/500/500";
