const fs = require('fs');
const path = require('path');
const { unlink, readdir, appendFile, readFile } = require('fs/promises');

async function createBundleFile() {
  const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');
  const stylesPath = path.join(__dirname, 'styles')
  try {
    await appendFile(pathBundle, '')
    await unlink(pathBundle)
    await appendFile(pathBundle, ''); //create bundle.css

    const files = await readdir(stylesPath, { withFileTypes: true }); //read data from styles folder
    let stylesArr = []

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name;
      if (files[i].isFile() && path.extname(fileName) === '.css') {
        const text = await readFile(path.join(stylesPath, fileName), 'utf-8')
        stylesArr.push(text)
        await appendFile(pathBundle, `${text}\n\n`)
      }
    }
  }
  catch (err) {
    console.log(err)
  }
}

createBundleFile()