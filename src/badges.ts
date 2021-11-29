import { NITROS, BILLING, BADGES, Badge } from "./constants";
import { createRare } from "./utils";
import { sample } from "lodash";
const nitros = createRare(NITROS);
const billing = createRare(BILLING);
const badges = createRare(BADGES.filter(b => b.data !== Badge.None));

export function getRandomNitroBadge () { return sample(nitros)!; }
export function getRandomBilling () { return sample(billing)!; }

export function getRandomBadges(count = 1) {
    const incompatible: string[] = [Badge.Balance, Badge.Bravery, Badge.Brilliance];
    const incompatible2: string[] = [Badge.BugHunter2, Badge.BugHunter1];
    const totalBadges = BADGES.length - incompatible.length - incompatible2.length;
    if (count > totalBadges) {
        count = totalBadges;
    }
    const badgeBuilder: string[] = [];
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
        const random = sample(possible);
        badgeBuilder.push(random);
    }
    return badgeBuilder;
}
