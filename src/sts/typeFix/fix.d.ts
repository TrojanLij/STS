declare const DEVELOPMENT: boolean;
declare const U: undefined;
declare const T: true;
declare const F: false;

declare module "random-ipv4" {
    export default function(gen: string, {
        token1: {
            min: number,
            max: number,
        },
        token2: {
            min: number,
            max: number,
        },
        token3: {
            min: number,
            max: number,
        },
        token4: {
            min: number,
            max: number,
        },
    }): string;
}
