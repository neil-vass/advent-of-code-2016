import {describe, expect, it} from "vitest";
import {parseNode, solvePart1} from "./day22.js";
import {Sequence} from "generator-sequences";

describe("Part 1", () => {
    it("Parses nodes", () => {
        const line = "/dev/grid/node-x0-y0     94T   65T    29T   69%";
        const node = parseNode(line);
        expect(node.name).toBe("node-x0-y0");
        expect(node.used).toBe(65);
        expect(node.avail).toBe(29);
    });

    it("Finds pairs", async () => {
        const lines = new Sequence([
            "/dev/grid/node-x0-y0     10T   1T    9T   69%",
            "/dev/grid/node-x1-y0     10T   2T    8T   69%",
            "/dev/grid/node-x2-y0     20T   18T   2T   69%",
        ]);
        expect(await solvePart1(lines)).toBe(4);
    })
});