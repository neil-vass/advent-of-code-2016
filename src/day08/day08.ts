import {linesFromFile, Sequence} from "generator-sequences";
import {read} from "node:fs";

const hash = (x: number, y: number) => `${x},${y}`;
const unhash = (h: string) => h.split(",").map(Number);

export class LittleScreen {
    private whatsOn = new Set<string>();

    constructor(private readonly width: number,
                private readonly height: number) {
    }

    display() {
        const output = new Array<string>();
        for (let y = 0; y < this.height; y++) {
            let line = "";
            for (let x = 0; x < this.width; x++) {
                line += this.whatsOn.has(hash(x, y)) ? "#" : ".";
            }
            output.push(line);
        }
        return output;
    }

    setRectangle(rectangleWidth: number, rectangleHeight: number) {
        for (let x = 0; x < rectangleWidth; x++) {
            for (let y = 0; y < rectangleHeight; y++) {
                this.whatsOn.add(hash(x, y));
            }
        }
    }

    rotateColumn(column: number, shift: number) {
        this.rotate((x, y) => {
            if (x === column) {
                y = (y + shift) % this.height;
            }
            return hash(x, y);
        });
    }

    rotateRow(row: number, shift: number) {
        this.rotate((x, y) => {
            if (y === row) {
                x = (x + shift) % this.width;
            }
            return hash(x, y);
        });
    }

    private rotate(rotatorFn: (x: number, y: number) => string) {
        const oldVals = Array.from(this.whatsOn.values()).map(unhash);
        this.whatsOn = new Set<string>();
        for (const [x, y] of oldVals) {
            this.whatsOn.add(rotatorFn(x, y));
        }
    }

    countLitPixels() {
        return this.whatsOn.size;
    }

    async runInstructions(input: Sequence<string>) {
        for await (const instruction of input) {
            this.run(instruction);
        }
    }

    private run(instruction: string) {
        const rectInstruction = instruction.match(/^rect (\d+)x(\d+)$/);
        if (rectInstruction) {
            const [, x, y] = rectInstruction;
            this.setRectangle(+x, +y);
            return;
        }

        const colInstruction = instruction.match(/^rotate column x=(\d+) by (\d+)$/);
        if (colInstruction) {
            const [, column, shift] = colInstruction;
            this.rotateColumn(+column, +shift);
            return;
        }

        const rowInstruction = instruction.match(/^rotate row y=(\d+) by (\d+)$/);
        if (rowInstruction) {
            const [, row, shift] = rowInstruction;
            this.rotateRow(+row, +shift);
            return;
        }

        throw new Error(`Unrecognized instruction: ${instruction}`);
    }

    readableDisplay() {
        const letterWidth = 5;

        const readable = (line: string) => {
            line = line.replaceAll(".", " ");
            let spaced = "";
            for (let i = 0; i < this.width; i += letterWidth) {
                spaced += line.slice(i, i+letterWidth) + "  ";
            }
            return spaced;
        }

        return this.display().map(readable);
    }
}


// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day08.input.txt`;
    const littleScreen = new LittleScreen(50, 6);
    await littleScreen.runInstructions(linesFromFile(filepath));
    console.log(littleScreen.countLitPixels());
    console.log(littleScreen.readableDisplay());
}