import { md5 } from "js-md5";

export function hashOf(doorId: string, index: number) {
    return md5(doorId + index);
}

export function passwordFor(doorId: string) {
    let password = "";
    let index = 0;

    while (password.length < 8) {
        const hash = hashOf(doorId, index);
        if(hash.startsWith("00000")) {
            password += hash[5];
        }
        index++;
    }

    return password;
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    console.log(passwordFor("[puzzle input]"));
}