import {readFile,writeFile} from 'node:fs/promises';
const manifest=JSON.parse(await readFile('docs/sources/manifest.json','utf8'));
const brands={'6511':'Reebok','6347':'Reebok','6510':'Puma','6508':'Puma','3351':'Xerjoff','3656':'Versace','2793':'Valentino','671':'Afnan','3643':'Maison Alhambra','3301':'Lattafa Vurv'};
const names={'3351':'Naxos','3656':'Bright Crystal','2793':'Uomo Born in Roma Intense','671':'9PM','3643':'Salvo','3301':'Profumo Intensity Pour Homme'};
const colors={'6511':'Blanco / negro','6347':'Blanco / rosado'};
const products=[];
for(const row of manifest){
  const html=await readFile(`docs/sources/product-${row.id}.html`,'utf8');
  const structured=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{try{return JSON.parse(m[1])}catch{return []}});
  const product=structured.find(s=>s['@type']==='Product'||s['@type']==='ProductGroup');
  const sizeEntries=[...html.matchAll(/data-value-name="([^"]+)" data-attribute-name="Talla Calzado"/g)].map(m=>m[1]);
  const variants=(product.hasVariant||[product]).map((v,i)=>({
    id:`${row.id}-${i+1}`, reference:v.sku||`Odoo ${row.id}`,
    size:row.category==='calzado'?(sizeEntries[i]?.match(/EU ([\d.]+)/)?.[1]||null):null,
    sizeSystem:row.category==='calzado'?'EU':null,
    sourceSizeLabel:sizeEntries[i]||null,
    color:colors[row.id]||null,
    volume:row.category==='calzado'?null:(row.id==='3656'?90:100),
    concentration:row.category==='calzado'?null:(row.id==='3656'?'Parfum':'Eau de parfum'),
    price:Number.isFinite(v.offers?.price)?v.offers.price:null,
    currency:v.offers?.priceCurrency||null,
    availability:'confirmar',
    observedAvailability:v.offers?.availability||null,
    sourceUrl:v.url||row.sourceUrl,
  }));
  products.push({...row,brand:brands[row.id],name:names[row.id]||row.name.replace(brands[row.id]+' ',''),sourceName:row.name,image:`/images/product-${row.id}.webp`,variants});
}
await writeFile('src/catalog.json',JSON.stringify(products,null,2)+'\n');
console.log(`Catálogo: ${products.length} productos; moneda documentada en JSON-LD; existencias no sincronizadas.`);
