import {linesFromFile, Sequence} from "generator-sequences";

// Borrowed from day 23
export class Assembunny {
    private registers: {[name: string]: number} = { "a": 0, "b": 0, "c": 0, "d": 0 };

    getRegisterValue(name: string) {
        if (this.registers[name] === undefined) throw new Error(`No register: ${name}`);
        return this.registers[name];
    }

    setRegisterValue(name: string, value: number) {
        if (this.registers[name] === undefined) throw new Error(`No register: ${name}`);
        this.registers[name] = value;
    }

    setRegisterValues(a: number, b: number, c: number, d: number) {
        this.registers = {a, b, c, d};
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

    run(instructions: Array<string>, transmissionCount: number) {
        let i = 0;
        const transmitted: number[] = [];
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
                case "out":
                    transmitted.push(this.registers[x]);
                    if (transmitted.length >= transmissionCount) return transmitted;
                    i++;
                    break;
                default:
                    throw new Error(`Unrecognized command: ${cmd}`);
            }
        }
        throw new Error(`End of program without reaching transmissionCount`);
    }
}

function interpretTransmission(transmission: number[]) {
    // I think we have two 6-bit binary numbers here. They're little-endian.
    const firstBinary = transmission.slice(0,6).reverse().join("");
    const first = parseInt(firstBinary, 2);
    const secondBinary = transmission.slice(6).reverse().join("");
    const second = parseInt(secondBinary, 2);
    return {first, second};
}

export async function solvePart1(lines: Sequence<string>) {
    const computer = new Assembunny();
    const instructions = await lines.toArray();
    const a = 100;
    const transmissionCount = 12;
    for (let i=a; i<a+10; i++) {
        computer.setRegisterValues(i, 0, 0, 0);
        const transmitted = computer.run(instructions, transmissionCount);
        const {first, second} = interpretTransmission(transmitted);
        console.log(`${i}: ${first}, ${second}`);
    }
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day25.input.txt`;

    // From inspecting the outputs, I could see numbers ticking up and
    // worked out from these functions where to find the target value.
    const target = "010101010101";
    const targetTransmission = target.split("").map(Number);
    console.log(interpretTransmission(targetTransmission));
    console.log(await solvePart1(linesFromFile(filepath)));
}