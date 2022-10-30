const fs = require('fs');
const path = require('path');
const { mkdir, rm, readdir, } = require('fs/promises');

const sourceFolderDir = path.join(__dirname, 'files');
const destFolderDir = path.join(__dirname, 'files-copy');

async function copyDir(sourceFolder, destFolder) {
  try {
    await rm(path.join(destFolder), { recursive: true, force: true }); //delete files-copy folder
    await mkdir(destFolder, { recursive: true }); // create files-copy folder
    const files = await readdir(sourceFolder, { withFileTypes: true }); //read data from files folder
    for (const el of files) {
      const fileName = el.name;
      if (el.isDirectory()) {
        copyDir(path.join(sourceFolder, fileName), path.join(destFolder, fileName));
      }
      fs.copyFile(path.join(sourceFolder, fileName), path.join(destFolder, fileName), () => { }); //from promises: error operation not permitted
    }
  }
  catch (err) {
    console.log(err);
  }
}

copyDir(sourceFolderDir, destFolderDir)
