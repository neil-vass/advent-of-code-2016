import {Sequence} from "generator-sequences";

export const OUTPUT = "output";
export const BOT = "bot";
export type HardwareName = typeof OUTPUT| typeof BOT;

export interface Destination { hardware: HardwareName, label: number }

export interface OutputCollection { [label: number]: { holding: [number]} }

export interface BotCollection {[label: number]:
        { holding: number[], low: Destination, high: Destination }}


function parseBotSetupLine(line: string) {
    const botSetup = line.match(/^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/);
    if (botSetup) {
        const [, botId, lowHardware, lowLabel, highHardware, highLabel] = botSetup;
        return {
            id: +botId,
            details: {
                holding: [],
                low: {hardware: lowHardware as HardwareName, label: +lowLabel},
                high: {hardware: highHardware as HardwareName, label: +highLabel}
            }
        }
    }
    return null;
}

function parseChipSetupLine(line: string) {
    const chipSetup = line.match(/^value (\d+) goes to bot (\d+)$/);
    if (chipSetup) {
        const [, chipLabel, botLabel] = chipSetup;
        return {chip: +chipLabel, bot: +botLabel};
    }
    return null;
}



export class Factory {
    private constructor(private botCollection: BotCollection) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const botCollection = {} as BotCollection;
        const startingChips = [] as { chip: number, bot: number }[];

        for await (const line of lines) {
            const botSetup = parseBotSetupLine(line);
            if (botSetup) {
                botCollection[botSetup.id] = botSetup.details;
                continue;
            }

            const chipSetup = parseChipSetupLine(line);
            if (chipSetup) {
                startingChips.push(chipSetup);
                continue;
            }

            throw new Error(`Unrecognized instruction: ${line}`);
        }

        for (const {chip, bot} of startingChips) {
            botCollection[bot].holding.push(chip);
        }

        return new Factory(botCollection);
    }

    bots(): BotCollection {
        // Copy of our collection - it's for viewing, not for changing.
        return JSON.parse(JSON.stringify(this.botCollection));
    }
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day10.input.txt`;
    console.log((filepath));
}