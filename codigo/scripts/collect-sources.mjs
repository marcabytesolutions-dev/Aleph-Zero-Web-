import { readFile, writeFile, mkdir } from 'node:fs/promises';
const base = 'https://aleph-zero.odoo.com';
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');
const rows = [];
for (const [category, count] of [['calzado',4], ['disenador',3], ['arabes',3]]) {
  const html = await readFile(`docs/sources/${category}.html`, 'utf8');
  const matches = [...html.matchAll(/<a contenteditable="false" href="([^"]+)"[^>]*title="([^"]+)"[\s\S]*?<img src="([^"]+)"/g)].slice(0,count);
  for (const m of matches) {
    const path=decode(m[1]), id=path.match(/-(\d+)$/)[1];
    rows.push({id,category,name:decode(m[2]),sourceUrl:base+path,imageUrl:base+decode(m[3]),observedAt:'2026-11-14'});
  }
}
await mkdir('public/images', {recursive:true});
for (const row of rows) {
  for (const [url,path] of [[row.sourceUrl,`docs/sources/product-${row.id}.html`],[row.imageUrl,`public/images/product-${row.id}.webp`]]) {
    const response=await fetch(url);
    if(!response.ok) throw new Error(`${response.status}: ${url}`);
    await writeFile(path,Buffer.from(await response.arrayBuffer()));
  }
  console.log(`${row.id}: ${row.name}`);
}
await writeFile('docs/sources/manifest.json',JSON.stringify(rows,null,2)+'\n');
