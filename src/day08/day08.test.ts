import {afterEach, describe, expect, it, vi} from "vitest";
import {LittleScreen} from "./day08.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    afterEach(() => vi.restoreAllMocks());

    it("Starts empty", () => {
        const sut = new LittleScreen(7, 3);
        expect(sut.display()).toStrictEqual([
            ".......",
            ".......",
            ".......",
        ]);
    });

    it("Sets rectangle", () => {
        const sut = new LittleScreen(7, 3);
        sut.setRectangle(3, 2);
        expect(sut.display()).toStrictEqual([
            "###....",
            "###....",
            ".......",
        ]);
    });

    it("Rotates column", () => {
        const sut = new LittleScreen(7, 3);
        sut.setRectangle(3, 2);
        sut.rotateColumn(1, 1);
        expect(sut.display()).toStrictEqual([
            "#.#....",
            "###....",
            ".#.....",
        ]);
    });

    it("Rotates row", () => {
        const sut = new LittleScreen(7, 3);
        sut.setRectangle(3, 2);
        sut.rotateColumn(1, 1);
        sut.rotateRow(0, 4);
        expect(sut.display()).toStrictEqual([
            "....#.#",
            "###....",
            ".#.....",
        ]);
    });

    it("Solves full example", () => {
        const sut = new LittleScreen(7, 3);
        sut.setRectangle(3, 2);
        sut.rotateColumn(1, 1);
        sut.rotateRow(0, 4);
        sut.rotateColumn(1, 1);
        expect(sut.display()).toStrictEqual([
            ".#..#.#",
            "#.#....",
            ".#.....",
        ]);
        expect(sut.countLitPixels()).toBe(6);
    });


    it("Parses instructions", async () => {
        const sut = new LittleScreen(7, 3);
        const spy = {
            setRectangle: vi.spyOn(sut, "setRectangle"),
            rotateColumn: vi.spyOn(sut, "rotateColumn"),
            rotateRow: vi.spyOn(sut, "rotateRow"),
        };

        const input = new Sequence([
            "rect 3x2",
            "rotate column x=1 by 1",
            "rotate row y=0 by 4"
        ]);

        await sut.runInstructions(input);

        expect(spy.setRectangle).toHaveBeenCalledWith(3, 2);
        expect(spy.rotateColumn).toHaveBeenCalledWith(1, 1);
        expect(spy.rotateRow).toHaveBeenCalledWith(0, 4);
    });
});