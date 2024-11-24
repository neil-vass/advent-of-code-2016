import {linesFromFile, Sequence} from "generator-sequences";

export const OUTPUT = "output";
export const BOT = "bot";
export type HardwareName = typeof OUTPUT| typeof BOT;

export interface Destination { hardware: HardwareName, label: number }

export type BotCollection = Map<number, Bot>;

export function parseBotSetupLine(line: string) {
    const m = line.match(/^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/);
    if(!m) throw new Error(`Unrecognized instruction ${line}`);

    const [, botLabel, lowHardware, lowLabel, highHardware, highLabel] = m;
    const low = { hardware: lowHardware as HardwareName, label: +lowLabel };
    const high = { hardware: highHardware as HardwareName, label: +highLabel };
    return new Bot(+botLabel, low, high);
}

export function parseChipSetupLine(line: string) {
    const m = line.match(/^value (\d+) goes to bot (\d+)$/);
    if(!m) throw new Error(`Unrecognized instruction ${line}`);
    const [, chipLabel, botLabel] = m;
    return { chip: +chipLabel, bot: +botLabel };
}


export class Bot {
    private readonly holding = new Array<number>();

    constructor(
        readonly label: number,
        private readonly low: Destination,
        private readonly high: Destination) {}

    receiveChip(chipLabel: number) {
        if (this.holding.length === 0) {
            this.holding.push(chipLabel);
        } else if (this.holding.length === 1) {
            chipLabel < this.holding[0] ? this.holding.unshift(chipLabel) : this.holding.push(chipLabel);

        } else {
            throw new Error(`Bot ${this.label} is full, just got given chip ${chipLabel}`);
        }
    }

    giveChips() {
        if (this.holding.length < 2) {
            return [];
        } else {
            return [
                { chip: this.holding.shift()!, hardware: this.low.hardware, label: this.low.label },
                { chip: this.holding.shift()!, hardware: this.high.hardware, label: this.high.label }
            ];
        }
    }
}


export class Factory {
    private constructor(private botCollection: BotCollection) {}

    static async buildFromDescription(lines: Sequence<string>) {
        const botCollection = new Map<number, Bot>();
        const startingChips = [] as { chip: number, bot: number }[];

        for await (const line of lines) {
            if(line.startsWith("bot")) {
                const bot = parseBotSetupLine(line);
                botCollection.set(bot.label, bot);
            } else if (line.startsWith("value")) {
                const chipSetup = parseChipSetupLine(line);
                startingChips.push(chipSetup);
            } else {
                throw new Error(`Unrecognized instruction: ${line}`);
            }
        }

        for (const {chip, bot} of startingChips) {
            botCollection.get(bot)!.receiveChip(chip);
        }

        return new Factory(botCollection);
    }

    whichBotCompares(chipA: number, chipB: number) {
        const chipsToFlag = [chipA, chipB];
        let movedThisRound: boolean;

        do {
            movedThisRound = false;
            for (const bot of this.botCollection.values()) {
                const chipsToPass = bot.giveChips();
                if (chipsToPass.length === 0) continue;

                if(chipsToPass.map(c => c.chip).every(passed => chipsToFlag.includes(passed))) {
                    return bot.label;
                }

                for (const pass of chipsToPass) {
                    if (pass.hardware === BOT) {
                        this.botCollection.get(pass.label)!.receiveChip(pass.chip);
                    }
                }
                movedThisRound = true;
            }
        } while (movedThisRound);

        throw new Error(`Finished all moves, never compared these chips`);
    }
}

export async function solvePart1(lines: Sequence<string>) {
    const factory = await Factory.buildFromDescription(lines);
    return factory.whichBotCompares(61, 17);
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day10.input.txt`;
    console.log(await solvePart1(linesFromFile(filepath)));
}