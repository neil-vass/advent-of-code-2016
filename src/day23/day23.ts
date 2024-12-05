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

export async function solvePart1(lines: Sequence<string>) {
    const computer = new Assembunny();
    computer.setRegisterValue("a", 7);
    const instructions = await lines.toArray();
    computer.run(instructions);
    return computer.getRegisterValue("a");
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day23.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}