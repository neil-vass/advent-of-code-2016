import {expect, describe, it, beforeEach} from "vitest";
import {Facility, Floor, Item, parseFloor} from "./day11.js";
import {Sequence} from "generator-sequences";


describe("Part 1", () => {
    it("Creates a floor", () => {
        const line = "The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.";
        const floor = parseFloor(line);
        expect(floor.items).toStrictEqual(new Set([
            new Item("hydrogen", "microchip"),
            new Item("lithium", "microchip")
            ]));
    });

    it("Solves a very basic puzzle", async () => {
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip.",
            "The second floor contains a hydrogen generator."
        ]);
        const facility = Facility.buildFromDescription(input);

    });
});