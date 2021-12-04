declare module "creditcard-generator" {
    interface CreditCardSchemes {
        prefixList: string[],
        digitCount: number;
    }

    export const Schemes: CreditCardSchemes;

    export function GenCC(card: string): string[];
}
