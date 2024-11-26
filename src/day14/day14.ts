import {md5} from "js-md5";
import {singleLineFromFile} from "generator-sequences";

const cache = new Map<string, string>();

function hash(str: string) {
    let answer = cache.get(str);
    if(!answer) {
        answer = md5(str);
        cache.set(str, answer);
    }
    return answer;
}

export function indexOfKey(keyNum: number, salt: string) {
    let index = -1;
    let currentKeyNum = 0;
    while (currentKeyNum < keyNum) {
        index++;
        const matchTriple = hash(salt + index).match(/(.)\1\1/);
        if (matchTriple) {
            const [, repeatedChar] = matchTriple;
            const re = new RegExp(`(${repeatedChar}){5}`);

            for(let j=1; j<=1000; j++) {
                if (hash(salt + (index+j)).match(re)) {
                    currentKeyNum++;
                    break;
                }
            }
        }
    }

    return index;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day14.input.txt`;
    const salt = singleLineFromFile(filepath);
    console.log(indexOfKey(64, salt));
}