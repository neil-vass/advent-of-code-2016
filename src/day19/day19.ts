export function solvePart1(filepath: string) {
    return "Hello, World!";
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day19.input.txt`;
    console.log(solvePart1(filepath));
}