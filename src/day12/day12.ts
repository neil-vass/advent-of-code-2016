import {linesFromFile, Sequence} from "generator-sequences";

export class Assembunny {
    private readonly registers: {[name: string]: number} = { "a": 0, "b": 0, "c": 0, "d": 0 };

    getRegisterValue(name: string) {
        return this.registers[name];
    }

    copy(x: string, y: string) {
        if (x.match(/^\d+$/)) {
            this.registers[y] = +x;
        } else {
            this.registers[y] = this.registers[x];
        }
    }

    run(instructions: Array<string>) {
        let i = 0;
        let loops = 0;
        while (i < instructions.length) {
            const [cmd, x, y] = instructions[i].split(" ");
            switch (cmd) {
                case "cpy":
                    this.copy(x, y);
                    i++;
                    break;
                case "inc":
                    this.registers[x]++;
                    i++;
                    break;
                case "dec":
                    this.registers[x]--;
                    i++;
                    break;
                case "jnz":
                    i += (this.registers[x] === 0 ? 1 : +y);
                    break;
                default:
                    throw new Error(`Unrecognized command: ${cmd}`);
            }
        }
    }
}

export async function solvePart1(filepath: string) {
    const computer = new Assembunny();
    const instructions = await linesFromFile(filepath).toArray();
    computer.run(instructions);
    return computer.getRegisterValue("a");
}

export async function solvePart2(filepath: string) {
    const computer = new Assembunny();
    const instructions = await linesFromFile(filepath).toArray();
    instructions.unshift("cpy 1 c");
    computer.run(instructions);
    return computer.getRegisterValue("a");
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day12.input.txt`;
    console.log(await solvePart2(filepath));
}

