
export function supportsTLS(address: string) {
    return false;
}

// If this script was invoked directly on the command line:
if (`file://${process.argv[1]}` === import.meta.url) {
    const filepath = `${import.meta.dirname}/day07.input.txt`;
    console.log("");
}

