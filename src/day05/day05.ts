import { md5 } from "js-md5";

export function passwordFor(doorId: string) {
    let password = "";
    let index = 0;

    while (password.length < 8) {
        const hash = md5(doorId + index);
        if(hash.startsWith("00000")) {
            password += hash[5];
        }
        index++;
    }

    return password;
}

export function betterPasswordFor(doorId: string) {
    let password = ["_", "_", "_", "_", "_", "_", "_", "_"];
    let index = 0;

    while (password.includes("_")) {
        const hash = md5(doorId + index);
        const m = hash.match(/^00000([0-7])(.)/);
        if(m) {
            const [, pos, value] = m;
            if(password[+pos] === "_") password[+pos] = value;
        }
        index++;
    }

    return password.join("");
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    console.log(betterPasswordFor("abbhdwsy"));
}