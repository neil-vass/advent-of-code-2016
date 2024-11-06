import {describe, expect, it} from "vitest";
import {checksumFor, countLetters, decryptRoomName, isRealRoom, orderLetters, parseRoom, solvePart1} from "./day04.js";
import {Sequence} from "../helpers/sequence.js";

describe("Part 1", () => {
    it("Parses room name", () => {
        expect(parseRoom("aaaaa-bbb-z-y-x-123[abxyz]")).toStrictEqual({
            encryptedName: "aaaaa-bbb-z-y-x",
            sectorId: 123,
            checksum: "abxyz"
        });
    });

    it("Counts letters", () => {
        expect(countLetters("aaaaa-bbb-z-y-x")).toStrictEqual({
            "a": 5, "b": 3, "z": 1, "y": 1, "x": 1
        });
    });

    it("Orders letters by count and alphabetization", () => {
        expect(orderLetters({
            "a": 5, "b": 3, "z": 1, "y": 1, "x": 1
        })).toStrictEqual([
            ["a", 5], ["b", 3], ["x", 1], ["y", 1], ["z", 1]
        ]);
    });

    it("Generates correct checksum", () => {
        expect(checksumFor("aaaaa-bbb-z-y-x")).toBe("abxyz");
    });

    it("Identifies a real room", () => {
        expect(isRealRoom({
            sectorId: 123,
            encryptedName: "aaaaa-bbb-z-y-x",
            checksum: "abxyz"
        })).toBe(true);
    });

    it("Solves example", async () => {
        const input = new Sequence([
            "aaaaa-bbb-z-y-x-123[abxyz]",
            "a-b-c-d-e-f-g-h-987[abcde]",
            "not-a-real-room-404[oarel]",
            "totally-real-room-200[decoy]"
        ]);

        expect(await solvePart1(input)).toBe(1514);
    });
});


describe("Part 2", () => {
    it("Decrypts room name", () => {
        expect(decryptRoomName({
            sectorId: 343,
            encryptedName: "qzmt-zixmtkozy-ivhz",
            checksum: "ignored"
        })).toBe("very encrypted name");
    });
});