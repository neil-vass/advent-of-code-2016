import {expect, describe, it} from "vitest";
import {Direction, parseInstruction, Walker} from "./day01.js";

describe("Part 1", () => {
    it("Parses a single instruction", async () => {
        expect(parseInstruction("R2")).toStrictEqual({turn: "R", steps: 2});
    });

    it("Can turn right", () => {
        const mapReader = new Walker();
        expect(mapReader.facing).toBe(Direction.NORTH);
        mapReader.turn("R");
        expect(mapReader.facing).toBe(Direction.EAST);
    });

    it("Can turn left", () => {
        const walker = new Walker();
        walker.turn("L");
        expect(walker.facing).toBe(Direction.WEST);
    });

    it("Can spin", () => {
        const walker = new Walker();
        for (let i=0; i<4; i++) { walker.turn("L"); }
        expect(walker.facing).toBe(Direction.NORTH);
    });

    it("Can take steps", () => {
        const walker = new Walker();
        walker.stepForward(2);
        expect(walker.facing).toBe(Direction.NORTH);
        expect(walker.northPos).toBe(2);
        expect(walker.eastPos).toBe(0);
    });


    it("Calculates distance after no moves", () => {
        const walker = new Walker();
        expect(walker.distanceFromStart()).toBe(0);
    });

    it("Calculates distance after one move", () => {
        const walker = new Walker();
        walker.follow("R2");
        expect(walker.distanceFromStart()).toBe(2);
    });

    it("Calculates distance after two moves", () => {
        const walker = new Walker();
        walker.follow("R2, L3");
        expect(walker.distanceFromStart()).toBe(5);
    });

    it("Matches second example", () => {
        const walker = new Walker();
        walker.follow("R2, R2, R2");
        expect(walker.distanceFromStart()).toBe(2);
    });

    it("Matches third example", () => {
        const walker = new Walker();
        walker.follow("R5, L5, R5, R3");
        expect(walker.distanceFromStart()).toBe(12);
    });
});

describe("Part 2", () => {
    it("Matches example", () => {
        const walker = new Walker();
        walker.followUntilSamePlaceReachedTwice("R8, R4, R4, R8");
        expect(walker.distanceFromStart()).toBe(4);
    });
});

