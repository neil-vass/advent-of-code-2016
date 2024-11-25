import {expect, describe, it, beforeEach} from "vitest";
import {Explorer, Facility, Floor, Item, parseFloor} from "./day11.js";
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

    it("Serilializes for easy checking of whether we've seen a state before", async () => {
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip.",
            "The second floor contains a hydrogen generator."
        ]);
        const facility = await Facility.buildFromDescription(input);
        expect(facility.serialize()).toBe(
            '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}');
    });

    it("Deserializes to come back and explore a state further", async () => {
        // Same string as created by .serialize() in previous test.
        const serial = '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}'

        const facility = Facility.deserialize(serial);
        expect(facility.elevatorFloor).toBe(0);
        expect(facility.floors.length).toBe(2);
        expect(facility.floors[0].items).toStrictEqual(new Set([
            new Item("hydrogen", "microchip")
        ]));
    });

    it("Calculates single-step heuristic", async () => {
        // You can complete this in one move.
        // We know you could fit 2 items in the elevator at once, so each
        // single thing you move counts as 0.5 steps for scoring.
        const serial = '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}'

        expect(Explorer.heuristic(serial, "")).toBeCloseTo(0.5);
    });

    it("Calculates simple heuristic", async () => {
        // The true best case from the puzzle example: 11 moves.
        // Our heuristic will be overconfident, but still useful.
        // Heuristic assumes: grab both microchips (2 will fit in the elevator),
        // and take them straight up to the top - it doesn't consider needing to
        // have the correct generators - for a total of 3 steps.
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.",
            "The second floor contains a hydrogen generator.",
            "The third floor contains a lithium generator.",
            "The fourth floor contains nothing relevant.",
        ]);

        const facility = await Facility.buildFromDescription(input);
        expect(Explorer.heuristic(facility.serialize(), "")).toBeCloseTo(3);
    });

});