import {linesFromFile, Sequence} from "generator-sequences";

// Borrowed from day 12
export class Assembunny {
    private readonly registers: {[name: string]: number} = { "a": 0, "b": 0, "c": 0, "d": 0 };

    getRegisterValue(name: string) {
        if (this.registers[name] === undefined) throw new Error(`No register: ${name}`);
        return this.registers[name];
    }

    setRegisterValue(name: string, value: number) {
        if (this.registers[name] === undefined) throw new Error(`No register: ${name}`);
        this.registers[name] = value;
    }

    private copy(x: string, y: string) {
        if (x.match(/^-?\d+$/)) {
            this.setRegisterValue(y, +x);
        } else {
            this.setRegisterValue(y, this.getRegisterValue(x));
        }
    }

    private jump(x: string, y: string) {
        const xVal = (x.match(/^-?\d+$/)) ? +x : this.getRegisterValue(x);
        if (xVal === 0) return 1;

        const yVal = (y.match(/^-?\d+$/)) ? +y : this.getRegisterValue(y);
        return yVal;
    }

    private toggle(instructions: Array<string>, toggleIdx: number, x: string) {
        const target = toggleIdx + this.getRegisterValue(x);
        if (target < 0 || target >= instructions.length) return;

        const [oldCmd, oldX, oldY] = instructions[target].split(" ");
        if (oldY === undefined) {
            const newCmd = oldCmd === "inc" ? "dec" : "inc";
            instructions[target] = `${newCmd} ${oldX}`;
        } else {
            const newCmd = oldCmd === "jnz" ? "cpy" : "jnz";
            instructions[target] = `${newCmd} ${oldX} ${oldY}`;
        }
    }

    run(instructions: Array<string>) {
        let i = 0;
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
                    i += this.jump(x, y);
                    break;
                case "tgl":
                    this.toggle(instructions, i, x);
                    i++;
                    break;
                default:
                    console.log(`Unrecognized command: ${cmd}`);
            }
        }
    }
}

export async function findValueToSend(lines: Sequence<string>, initial_a: number) {
    const computer = new Assembunny();
    computer.setRegisterValue("a", initial_a);
    const instructions = await lines.toArray();
    computer.run(instructions);
    return computer.getRegisterValue("a");
}

// Calculating for large numbers takes a long time. I exported the calculation
// steps for initial_a = 6 to a spreadsheet, found the pattern, and confirmed
// it's the same for some other values.
export function shortcutCalculation(initial_a: number) {
    let factorial = 1;
    for (let n=initial_a; n>1; n--) factorial *= n;
    return factorial + 95**2;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const initial_a = 12;
    console.log(shortcutCalculation(initial_a));
}