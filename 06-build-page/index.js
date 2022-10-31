const fs = require('fs');
const path = require('path');
const { mkdir, rm, unlink, readdir, appendFile, readFile } = require('fs/promises');


async function copyDir(sourceFolder, destFolder) {
  try {
    await rm(path.join(destFolder), { recursive: true, force: true });
    await mkdir(destFolder, { recursive: true });
    const files = await readdir(sourceFolder, { withFileTypes: true });
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


async function createBundleFile(stylesSourceFolder, pathBundleStylesFile) {
  try {
    await appendFile(pathBundleStylesFile, '')
    await unlink(pathBundleStylesFile)
    await appendFile(pathBundleStylesFile, '');

    const files = await readdir(stylesSourceFolder, { withFileTypes: true }); //read data from styles folder
    let stylesArr = []

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name;
      if (files[i].isFile() && path.extname(fileName) === '.css') {
        const text = await readFile(path.join(stylesSourceFolder, fileName), 'utf-8')
        stylesArr.push(text)
        await appendFile(pathBundleStylesFile, `${text}\n\n`)
      }
    }
  }
  catch (err) {
    console.log(err)
  }
}

async function createHtmlFile(pathHtmlFile, pathTemplateHtml, componentsFolder) {
  try {
    await appendFile(pathHtmlFile, '')
    await unlink(pathHtmlFile)
    await appendFile(pathHtmlFile, ''); //create index.html
    createIndexHTMLFromTemplate(pathTemplateHtml, componentsFolder, pathHtmlFile)
  }
  catch (err) {
    console.log(err)
  }
}

async function createIndexHTMLFromTemplate(pathTemplateHtml, componentsFolder, pathHtmlFile) {
  const files = await readdir(componentsFolder, { withFileTypes: true });
  let templateText = await readFile(pathTemplateHtml, 'utf-8'); //read data from template.html
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i].name;
    const componentName = path.parse(fileName).name
    if (files[i].isFile() && path.extname(fileName) === '.html') {
      const componentContent = await readFile(path.join(componentsFolder, fileName), 'utf-8')
      templateText = templateText.replaceAll(`{{${componentName}}}`, componentContent)
    }
  }
  await appendFile(pathHtmlFile, templateText); //write to index.html
}


async function createPrjDist() {

  const prjDistFolderPath = path.join(__dirname, 'project-dist')
  const assetsSourceFolderDir = path.join(__dirname, 'assets');
  const assetsDestFolderDir = path.join(prjDistFolderPath, 'assets');
  const pathBundleStylesFile = path.join(prjDistFolderPath, 'style.css');
  const stylesSourceFolder = path.join(__dirname, 'styles')
  const pathHtmlFile = path.join(prjDistFolderPath, 'index.html');
  const pathTemplateHtml = path.join(__dirname, 'template.html')
  const componentsFolder = path.join(__dirname, 'components')

  try {
    await rm(prjDistFolderPath, { recursive: true, force: true }); //delete project-dist folder
    await mkdir(prjDistFolderPath, { recursive: true }); // create project-dist folder
    copyDir(assetsSourceFolderDir, assetsDestFolderDir) // copy assets folder
    createBundleFile(stylesSourceFolder, pathBundleStylesFile) //create style.css
    createHtmlFile(pathHtmlFile, pathTemplateHtml, componentsFolder)
  }
  catch (err) {
    console.log(err)
  }
}


createPrjDist()