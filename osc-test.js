const { Client, Server, Message } = require('node-osc');
const fs = require('fs');
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

/*
osc.on('*', message => {
    console.log(JSON.stringify(message));
});

osc.on('open', message => {
    console.info("OSC port opened");
});

osc.on('close', () => {
    console.info("OSC port closed")
});
  
osc.on('error', (err) => {
    console.error(err);
});

osc.open();
*/

var server = new Server(4558);
server.on('message', function (msg) {
    console.log(`Message: ${msg}`);
});

// /Applications/Sonic Pi.app/server/ruby/bin
// ../../native/ruby/bin/ruby sonic-pi-server.rb

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === 'r') {
        fs.readFile('sonic-vscode.rb', 'utf8', function(err, contents) {
            console.log(contents);
            const client = new Client('127.0.0.1', 4557);
            client.send('/run-code', 'sonic-vscode', contents, (err) => {
                if (err) {
                    console.error(err);
                }
                client.close();
            });
        });
    } else if (key.name === 's') {
        console.log('stopping');
        const client = new Client('127.0.0.1', 4557);
        client.send('/stop-all-jobs', 'sonic-vscode', (err) => {
            if (err) {
                console.error(err);
            }
            client.close();
        });
    }
});