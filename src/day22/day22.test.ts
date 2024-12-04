import {describe, expect, it} from "vitest";
import {parseNode, solvePart1, solvePart2} from "./day22.js";
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

describe("Part 2", () => {
    it("Draws diagram", async () => {
        const lines = new Sequence([
            "Filesystem            Size  Used  Avail  Use%",
            "/dev/grid/node-x0-y0   10T    8T     2T   80%",
            "/dev/grid/node-x0-y1   11T    6T     5T   54%",
            "/dev/grid/node-x0-y2   32T   28T     4T   87%",
            "/dev/grid/node-x1-y0    9T    7T     2T   77%",
            "/dev/grid/node-x1-y1    8T    0T     8T    0%",
            "/dev/grid/node-x1-y2   11T    7T     4T   63%",
            "/dev/grid/node-x2-y0   10T    6T     4T   60%",
            "/dev/grid/node-x2-y1    9T    8T     1T   88%",
            "/dev/grid/node-x2-y2    9T    6T     3T   66%",
        ]);
        expect(await solvePart2(lines)).toBe("Next: paste into a spreadsheet");
    })
});
