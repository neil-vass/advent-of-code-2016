import {expect, describe, it, beforeEach} from "vitest";
import {Floor, fn, Item, parseFloor} from "./day11.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    let input: Sequence<string>;

    beforeEach(() => {
        input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.",
            "The second floor contains a hydrogen generator.",
            "The third floor contains a lithium generator.",
            "The fourth floor contains nothing relevant.",
        ]);
    });

    it("Creates a floor", () => {
        const line = "The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.";
        const floor = parseFloor(line);
        expect(floor.items).toStrictEqual(new Set([
            new Item("hydrogen", "microchip"),
            new Item("lithium", "microchip")
            ]));
    });
});