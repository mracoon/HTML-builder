const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const newFilePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function writeMessageToFile(message) {
  fs.appendFile(newFilePath, `${message}\n`, (err) => { if (err) throw err })
}

function endSession() {
  console.log('Goodbye!')
}

fs.writeFile(newFilePath, '', (err) => { if (err) throw err });

rl.question('Enter message:\n', (message) => {
  writeMessageToFile(message)
  rl.on('line', (mes) => {
    if (mes === 'exit') {
      rl.close()
    } else {
      writeMessageToFile(mes)
    }
  })
  rl.on('close', endSession)
})

