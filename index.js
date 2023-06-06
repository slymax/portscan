#!/usr/bin/env node

const net = require("net");
const argv = require("minimist")(process.argv);
const cli = require.main === module;

const getServices = ({ search, limit }) => {
    return new Promise(async resolve => {
        const response = await fetch("https://svn.nmap.org/nmap/nmap-services");
        const text = await response.text();
        resolve(text.split("\n").map(line => {
            if (!line.startsWith("#") && line.length) {
                const cells = line.split("\t");
                const ports = cells[1].split("/");
                if (ports[1] === "tcp") return {
                    frequency: parseFloat(cells[2]),
                    service: cells[0],
                    port: ports[0]
                };
            }
        }).filter(a => a).filter(({ port, service }) => {
            return !search || (isNaN(search) ? service.includes(search) : search === port);
        }).sort((a, b) => b.frequency - a.frequency).slice(0, limit));
    });
};

const scanPort = ({ host, timeout }, { port, service }) => {
    return new Promise(resolve => {
        const socket = new net.Socket();
        const complete = (status = "closed") => {
            clearTimeout(timer);
            socket.destroy();
            resolve({ port, service, status });
        };
        socket.on("error", () => complete);
        socket.on("connect", () => complete("open"));
        const timer = setTimeout(complete, timeout || 250);
        socket.connect(parseInt(port), host);
    });
};

const portscan = options => {
    return new Promise(async resolve => {
        const results = [];
        cli && console.log("\nscanning ports on", options.host, "\n");
        for (const service of await getServices(options)) {
            const result = await scanPort(options, service);
            if (cli) {
                const { port, service, status } = result;
                console.log(port.padEnd(5), service.padEnd(30), status.toUpperCase());
            } else {
                results.push(result);
            }
        }
        cli ? console.log() : resolve(results);
    });
};

if (cli) {
    portscan({
        "host": argv._[2]?.toString(),
        "search": argv._[3]?.toString(),
        "timeout": argv.timeout,
        "limit": argv.limit
    });
} else {
    module.exports = portscan;
}
