import {expect, describe, it} from "vitest";
import {sayHello} from "./day01";

enum Direction { NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3 }
const NUMBER_OF_DIRECTIONS = 4;
type TurnDir = "R"|"L";

class MapReader {
    facing: Direction;
    xPos: number;
    yPos: number;
    constructor() {
        this.facing = Direction.NORTH;
        this.xPos = 0;
        this.yPos = 0;
    }

    turn(dir: TurnDir) {
        this.facing += dir === "R" ? 1 : -1;
        if (this.facing < 0) { this.facing = NUMBER_OF_DIRECTIONS -1; }
        else if (this.facing >= NUMBER_OF_DIRECTIONS) { this.facing = 0; }
    }

    stepForward(steps: number) {
        switch(this.facing) {
            case Direction.NORTH:
                this.yPos += steps;
                break;
            case Direction.EAST:
                this.yPos += steps;
                break;
            case Direction.SOUTH:
                this.xPos -= steps;
                break;
            case Direction.WEST:
                this.yPos -= steps;
                break;
        }
    }

    followInstruction(turnDir: TurnDir, steps: number) {
        this.turn(turnDir);
        this.stepForward(steps);
    }

    travelledDistance() {
        return Math.abs(this.xPos) + Math.abs(this.yPos)
    }
}

describe("Part 1", () => {
    it("Can turn right", () => {
        const mapReader = new MapReader();
        expect(mapReader.facing).toBe(Direction.NORTH);
        mapReader.turn("R");
        expect(mapReader.facing).toBe(Direction.EAST);
    });

    it("Can turn left", () => {
        const mapReader = new MapReader();
        mapReader.turn("L");
        expect(mapReader.facing).toBe(Direction.WEST);
    });

    it("Can spin", () => {
        const mapReader = new MapReader();
        for (let i=0; i<4; i++) { mapReader.turn("L"); }
        expect(mapReader.facing).toBe(Direction.NORTH);
    });

    it("Can take steps", () => {
        const mapReader = new MapReader();
        mapReader.stepForward(2);
        expect(mapReader.facing).toBe(Direction.NORTH);
        expect(mapReader.xPos).toBe(0);
        expect(mapReader.yPos).toBe(2);
    });


    it("Calculates distance after no moves", () => {
        const mapReader = new MapReader();
        expect(mapReader.travelledDistance()).toBe(0);
    });

    it("Calculates distance after one move", () => {
        const mapReader = new MapReader();
        mapReader.followInstruction("R", 2);
        expect(mapReader.travelledDistance()).toBe(2);
    });
});

