const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout, exit } = require('process');
const newFilePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface(stdin, stdout);

function writeMessageToFile(message) {
  fs.appendFile(newFilePath, `${message}\n`, (err) => { if (err) throw err; });
}

function endSession() {
  console.log('Goodbye!');
}

fs.writeFile(newFilePath, '', (err) => { if (err) throw err; });

console.log('Enter message:');

rl.on('close', endSession);

rl.on('line', (mes) => {
  if (mes === 'exit') {
    endSession();
    exit();
  } else {
    writeMessageToFile(mes);
  }
});
