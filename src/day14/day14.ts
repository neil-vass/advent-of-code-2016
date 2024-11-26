import {md5} from "js-md5";
import {singleLineFromFile} from "generator-sequences";

const hashCache = new Map<string, string>();

export function hash(str: string) {
    let answer = hashCache.get(str);
    if(!answer) {
        answer = md5(str);
        hashCache.set(str, answer);
    }
    return answer;
}

const stretchedHashCache = new Map<string, string>();

export function stretchedHash(str: string) {
    let answer = stretchedHashCache.get(str);
    if(!answer) {
        answer = md5(str);
        for (let i=0; i<2016; i++) {
            answer = md5(answer);
        }
        stretchedHashCache.set(str, answer);
    }
    return answer;
}


export function indexOfKey(keyNum: number, salt: string, hashFn=hash) {
    let index = -1;
    let currentKeyNum = 0;
    while (currentKeyNum < keyNum) {
        index++;
        const matchTriple = hashFn(salt + index).match(/(.)\1\1/);
        if (matchTriple) {
            const [, repeatedChar] = matchTriple;
            const re = new RegExp(`(${repeatedChar}){5}`);

            for(let j=1; j<=1000; j++) {
                if (hashFn(salt + (index+j)).match(re)) {
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
    console.log(indexOfKey(64, salt, stretchedHash));
}