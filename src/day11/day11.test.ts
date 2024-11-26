import {expect, describe, it, beforeEach} from "vitest";
import {Explorer, Facility, Floor, GOAL_CONDITION, Item, onesAndTwos, parseFloor, solvePart1} from "./day11.js";
import {Sequence} from "generator-sequences";
import {isNumberObject} from "node:util/types";


describe("Part 1", () => {
    it("Creates a floor", () => {
        const line = "The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.";
        const floor = parseFloor(line);
        expect(floor.items).toStrictEqual([
            new Item("hydrogen", "microchip"),
            new Item("lithium", "microchip")
            ]);
    });

    it("Serializes for easy checking of whether we've seen a state before", async () => {
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip.",
            "The second floor contains a hydrogen generator."
        ]);
        const facility = await Facility.buildFromDescription(input);
        expect(facility.serializeToCheckForGoalCondition()).toBe(
            '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}');
    });

    it("Serializes to the general GOAL_CONDITION response if goal is reached", async () => {
        const input = new Sequence([
            "The first floor contains nothing.",
            "The second floor contains a hydrogen-compatible microchip and a hydrogen generator."
        ]);
        const facility = await Facility.buildFromDescription(input);
        expect(facility.serializeToCheckForGoalCondition()).toBe(GOAL_CONDITION);
    });

    it("Deserializes to come back and explore a state further", async () => {
        // Same string as created by serializing in a previous test.
        const serial = '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}'

        const facility = Facility.deserialize(serial);
        expect(facility.elevatorFloor).toBe(0);
        expect(facility.floors.length).toBe(2);
        expect(facility.floors[0].items).toStrictEqual([
            new Item("hydrogen", "microchip")
        ]);
    });


    it("Calculates single-step heuristic", async () => {
        // You can complete this in one move.
        // We know you could fit 2 items in the elevator at once, so each
        // single thing you move counts as 0.5 steps for scoring.
        const serial = '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}'

        expect(Explorer.heuristic(serial, GOAL_CONDITION)).toBeCloseTo(0.5);
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
        expect(Explorer.heuristic(facility.serializeToCheckForGoalCondition(), GOAL_CONDITION)).toBeCloseTo(3);
    });

    it("Returns next step when there's only one choice", async () => {
        // We can complete this in one step.
        const serial = '{"floors":[{"items":["hydrogen microchip"]},{"items":["hydrogen generator"]}],"elevatorFloor":0}'
        let neighboursCount = 0;
        for (const neighbour of Explorer.neighbours(serial)) {
            expect(neighbour).toStrictEqual({ node: GOAL_CONDITION, cost: 1});
            neighboursCount++;
        }
        expect(neighboursCount).toBe(1);
    });

    it("Returns all one- and two- item combinations from a list", async () => {
        // Works on any array.
        const input = ["a", "b", "c"];
        expect([...onesAndTwos(input.length)]).toStrictEqual([
            [ 0 ],
            [ 1, 0 ],
            [ 2, 0 ],
            [ 1 ],
            [ 2, 1 ],
            [ 2 ]
        ]);
    });

    it("Moves items to requested floor", async () => {
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.",
            "The second floor contains a hydrogen generator.",
            "The third floor contains a lithium generator.",
            "The fourth floor contains nothing relevant.",
        ]);
        const facility = await Facility.buildFromDescription(input);
        facility.move([0, 1], 1);
        expect(facility.floors[0].items.length).toBe(0);
        expect(facility.floors[1].items.length).toBe(3);
        expect(facility.elevatorFloor).toBe(1);
        expect(facility.isValid()).toBe(false);
    });

    it("Solves a single-step puzzle", async () => {
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip.",
            "The second floor contains a hydrogen generator."
        ]);
        const facility = await Facility.buildFromDescription(input);
        expect(await solvePart1(facility)).toBe(1);
    });

    it("Microchips are protected from other generators when their compatible one is present", async () => {
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip.",
            "The second floor contains a hydrogen generator and a lithium generator."
        ]);
        const facility = await Facility.buildFromDescription(input);
        expect(await solvePart1(facility)).toBe(1);
    });

    it("Solves example from puzzle description", async () => {
        const input = new Sequence([
            "The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.",
            "The second floor contains a hydrogen generator.",
            "The third floor contains a lithium generator.",
            "The fourth floor contains nothing relevant.",
        ]);
        const facility = await Facility.buildFromDescription(input);
        expect(await solvePart1(facility)).toBe(11);
    });
});