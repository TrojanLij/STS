"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomBadges = exports.getRandomBilling = exports.getRandomNitroBadge = void 0;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const lodash_1 = require("lodash");
const nitros = (0, utils_1.createRare)(constants_1.NITROS);
const billing = (0, utils_1.createRare)(constants_1.BILLING);
const badges = (0, utils_1.createRare)(constants_1.BADGES.filter(b => b.data !== constants_1.Badge.None));
function getRandomNitroBadge() { return (0, lodash_1.sample)(nitros); }
exports.getRandomNitroBadge = getRandomNitroBadge;
function getRandomBilling() { return (0, lodash_1.sample)(billing); }
exports.getRandomBilling = getRandomBilling;
function getRandomBadges(count = 1) {
    const incompatible = [constants_1.Badge.Balance, constants_1.Badge.Bravery, constants_1.Badge.Brilliance];
    const incompatible2 = [constants_1.Badge.BugHunter2, constants_1.Badge.BugHunter1];
    const totalBadges = constants_1.BADGES.length - incompatible.length - incompatible2.length;
    if (count > totalBadges) {
        count = totalBadges;
    }
    const badgeBuilder = [];
    while (badgeBuilder.length < count) {
        const possible = badges.filter(b => {
            if (badgeBuilder.includes(b)) {
                return false;
            }
            if (incompatible.includes(b) && !badgeBuilder.includes(b)) {
                return false;
            }
            if (incompatible2.includes(b) && !badgeBuilder.includes(b)) {
                return false;
            }
            return true;
        });
        const random = (0, lodash_1.sample)(possible);
        badgeBuilder.push(random);
    }
    return badgeBuilder;
}
exports.getRandomBadges = getRandomBadges;
