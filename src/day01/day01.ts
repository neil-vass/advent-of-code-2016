import {singleLineFromFile} from "../helpers/filereader.js";

export enum Direction { NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3 }
export const NUMBER_OF_DIRECTIONS = 4;
export type Turn = "R"|"L";
export type Instruction = { turn: Turn, steps: number };

export class Walker {
    facing: Direction;
    northPos: number;
    eastPos: number;
    visited: Set<string>;
    constructor() {
        this.facing = Direction.NORTH;
        this.northPos = 0;
        this.eastPos = 0;
        this.visited = new Set([this.currentPosToString()]);
    }

    currentPosToString() {
        return `${this.northPos},${this.eastPos}`;
    }

    turn(dir: Turn) {
        this.facing += dir === "R" ? 1 : -1;
        if (this.facing < 0) { this.facing = NUMBER_OF_DIRECTIONS -1; }
        else if (this.facing >= NUMBER_OF_DIRECTIONS) { this.facing = 0; }
    }

    stepForward(steps: number) {
        switch(this.facing) {
            case Direction.NORTH:
                this.northPos += steps;
                break;
            case Direction.EAST:
                this.eastPos += steps;
                break;
            case Direction.SOUTH:
                this.northPos -= steps;
                break;
            case Direction.WEST:
                this.eastPos -= steps;
                break;
        }
    }

    follow(instructionStr: string) {
        const instructions = instructionStr.split(",").map(parseInstruction);
        for(const instruction of instructions) {
            this.turn(instruction.turn);
            this.stepForward(instruction.steps);
        }
    }

    followUntilSamePlaceReachedTwice(instructionStr: string) {
        const instructions = instructionStr.split(",").map(parseInstruction);
        for(const instruction of instructions) {
            this.turn(instruction.turn);

            for (let s = 0; s < instruction.steps; s++) {
                this.stepForward(1);
                const thisPos = this.currentPosToString();
                if (this.visited.has(thisPos)) return;
                this.visited.add(thisPos);
            }
        }
    }

    distanceFromStart() {
        return Math.abs(this.northPos) + Math.abs(this.eastPos)
    }
}

export function parseInstruction(str: string): Instruction {
    const m = str.trim().match(/^([RL])(\d+)$/);
    if (m === null) throw new Error(`Unrecognized instruction: ${str}`);
    const [, turnStr, stepsStr] = m;
    return {turn: turnStr as Turn, steps: +stepsStr};
}

function part1(instructions: string) {
    const walker = new Walker();
    walker.follow(instructions);
    return walker.distanceFromStart();
}

function part2(instructions: string) {
    const walker = new Walker();
    walker.followUntilSamePlaceReachedTwice(instructions);
    return walker.distanceFromStart();
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const instructions = singleLineFromFile(`${import.meta.dirname}/day01.input.txt`);
    console.log(part2(instructions));
}
