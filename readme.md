<p align="center">
    <img width="128" height="128" src="https://raw.githubusercontent.com/slymax/portscan/master/icon.svg" />
</p>

<p align="center">
    portscan is an easy-to-use port scanner that checks for common vulnerabilities first
</p>

### Quick Start

```sh
npx @slymax/portscan example.com
```

The command above scans `example.com` for open ports – starting with the ports that are most commonly left open – and keeps scanning until the process is cancelled by the user or until all ports have been scanned (this can take a while).

### Setup

Portscan requires `node 14` or higher and can be used directly via its command-line-interface or it can be imported into other applications for programmatic use.

For cli-use, portscan can be used via `npx` (as in the example above) or it can be installed globally by running `npm i -g @slymax/portscan`.

### Options

```
portscan [host] [search] [--timeout] [--limit]
```

`host` (required) – the hostname or ip address of the target server

`search` (optional) – only scan a specific port or services containing a specific keyword

`--timeout` (optional) – the time (in ms) after which a port is considered unreachable (default is 250)

`--limit` (optional) – the maximum number of ports to scan

### Examples

```sh
# check the 10 most common open ports
$ portscan example.com --limit 10

80    http                           OPEN
23    telnet                         CLOSED
443   https                          OPEN
21    ftp                            CLOSED
22    ssh                            CLOSED
25    smtp                           CLOSED
3389  ms-wbt-server                  CLOSED
110   pop3                           CLOSED
445   microsoft-ds                   CLOSED

# check if any default mysql ports are open
$ portscan example.com mysql

3306  mysql                          CLOSED
1186  mysql-cluster                  CLOSED
1862  mysql-cm-agent                 CLOSED
2273  mysql-im                       CLOSED
6446  mysql-proxy                    CLOSED
33060 mysqlx                         CLOSED

# check if port 21 is open
$ portscan example.com 21

21    ftp                            CLOSED
```

### Programmatic Use

Portscan can also be installed locally by running `npm i @slymax/portscan`. It takes an `options` object as a single argument. The properties are the same as the cli options and only the host is required. It returns a promise that resolves to an array of objects when the scan is complete.

```js
const portscan = require("@slymax/portscan");

(async () => {
    const results = await portscan({
        host: "example.com",
        limit: 5
    });
    console.log(results);
})();
```

```js
[
  { port: '80', service: 'http', status: 'open' },
  { port: '23', service: 'telnet', status: 'closed' },
  { port: '443', service: 'https', status: 'open' },
  { port: '21', service: 'ftp', status: 'closed' },
  { port: '22', service: 'ssh', status: 'closed' }
]
```
