import {readFile,writeFile,access} from 'node:fs/promises';
const original=await readFile('index.html','utf8');
for(const file of ['../web/app.iife.js','../web/styles.css','../web/images/logo-original.png'])await access(file);
function html(prefix){
  return original
    .replace('<title>',`<meta name="aleph-assets" content="${prefix}" />\n    <title>`)
    .replace('href="/favicon.svg"',`href="${prefix}favicon.svg"`)
    .replaceAll('href="/images/',`href="${prefix}images/`)
    .replace('<script type="module" src="/src/main.js"></script>',`<link rel="stylesheet" href="${prefix}styles.css" />\n    <script defer src="${prefix}app.iife.js"></script>`);
}
await writeFile('../web/index.html',html('./'));
await writeFile('../ABRIR WEB.html',html('./web/'));
await writeFile('../index.html',html('./web/'));
console.log('Versión lista para doble clic: ABRIR WEB.html');
