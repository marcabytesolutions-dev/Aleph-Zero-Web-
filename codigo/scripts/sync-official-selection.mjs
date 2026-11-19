import {mkdir,writeFile} from 'node:fs/promises';

const root='https://aleph-zero.odoo.com';
const observedAt='2026-11-18';
const selection=[
  {category:'calzado',brand:'Reebok',name:'Cityride Black White',color:'Blanco / negro',url:'/shop/calzado-1/reebok-cityride-black-white-6511'},
  {category:'calzado',brand:'Puma',name:'Carch Black White',color:'Negro / blanco',url:'/shop/calzado-1/puma-402679-04-puma-carch-black-white-6349'},
  {category:'calzado',brand:'Nike',name:'Zoom Vomero Roam Black Light Silver Jade Horizon',color:'Negro / plata / jade',url:'/shop/calzado-1/nike-fv2295-001-nike-zoom-vomero-roam-black-light-silver-jade-horizon-6503'},
  {category:'calzado',brand:'Adidas',name:'Handball Spezial Core Black Carbon Gold Metallic',color:'Negro / carbón / dorado',url:'/shop/calzado-1/adidas-js3868-adidas-handball-spezial-core-black-carbon-gold-metallic-6483'},
  {category:'calzado',brand:'Nike',name:'Blazer Low 77 Jumbo',color:'Blanco / negro',url:'/shop/calzado-1/nike-blazer-low-77-jumbo-3564'},
  {category:'calzado',brand:'Nike',name:'Air Max 1 Blanco Alabastro',color:'Blanco alabastro',url:'/shop/calzado-1/nike-air-max-1-blanco-alabastro-2748'},
  {category:'calzado',brand:'Puma',name:'Palermo White Black Gum',color:'Blanco / negro / goma',url:'/shop/calzado-1/puma-396464-01-puma-palermo-white-black-gum-6231'},
  {category:'calzado',brand:'Puma',name:'Palermo LTH Prime Low Black',color:'Negro',url:'/shop/calzado-1/puma-palermo-lth-prime-low-black-6230'},
  {category:'calzado',brand:'Puma',name:'Court Classic Lux Suede White Feather',color:'Blanco feather',url:'/shop/calzado-1/puma-395087-12-puma-court-classic-lux-suede-white-feather-6228'},
  {category:'calzado',brand:'Puma',name:'Softride Enzo 5 Black Pink Pixel',color:'Negro / rosado',url:'/shop/calzado-1/puma-311213-15-puma-softride-enzo-5-black-pink-pixel-6507'},
  {category:'disenador',brand:'Xerjoff',name:'Naxos',url:'/shop/perfumes-disenador-nicho-7/xerjoff-naxos-edp-100-ml-3351'},
  {category:'disenador',brand:'Yves Saint Laurent',name:'MYSLF Le Parfum',url:'/shop/perfumes-disenador-nicho-7/myslf-yves-saint-laurent-le-parfum-100-ml-6345'},
  {category:'disenador',brand:'Valentino',name:'Uomo Born in Roma Extradose',url:'/shop/perfumes-disenador-nicho-7/valentino-uomo-born-in-roma-extradose-parfum-100ml-4304'},
  {category:'disenador',brand:'Valentino',name:'Uomo Born in Roma Purple Melancholia',url:'/shop/perfumes-disenador-nicho-7/valentino-uomo-born-in-roma-purple-melancholia-edt-100-ml-6327'},
  {category:'disenador',brand:'Prada',name:'Paradoxe',url:'/shop/perfumes-disenador-nicho-7/prada-paradoxe-edp-100-ml-3350'},
  {category:'disenador',brand:'Dior',name:'Homme Intense',url:'/shop/perfumes-disenador-nicho-7/dior-homme-intense-100ml-edp-m-1583'},
  {category:'disenador',brand:'Yves Saint Laurent',name:'Libre',url:'/shop/perfumes-disenador-nicho-7/yves-saint-laurent-libre-edp-90-ml-6344'},
  {category:'disenador',brand:'Mancera',name:'Instant Crush',url:'/shop/perfumes-disenador-nicho-7/mancera-instant-crush-edp-120-ml-4312'},
  {category:'disenador',brand:'Mancera',name:'Cedrat Boise',url:'/shop/perfumes-disenador-nicho-7/mancera-cedrat-boise-edp-120-ml-6324'},
  {category:'disenador',brand:'Valentino',name:'Uomo Born in Roma Intense',url:'/shop/perfumes-disenador-nicho-7/valentino-uomo-born-in-roma-intense-edp-100ml-2793'},
];

const decode=s=>String(s??'').replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"').replaceAll('&#34;','"');
const asArray=value=>Array.isArray(value)?value:value?[value]:[];
const volumeFrom=name=>Number(name.match(/(\d+)\s*ML/i)?.[1]||0)||null;
const concentrationFrom=name=>/EXTRADOSE|PARFUM/i.test(name)?'Parfum':/\bEDT\b/i.test(name)?'Eau de toilette':/\bEDP\b/i.test(name)?'Eau de parfum':null;

await mkdir('public/assets/products',{recursive:true});
await mkdir('docs/sources/official-2026-11-18',{recursive:true});
const products=[];
for(const item of selection){
  const id=item.url.match(/-(\d+)$/)?.[1];
  if(!id)throw new Error(`No se encontró ID en ${item.url}`);
  const sourceUrl=root+item.url;
  const page=await fetch(sourceUrl);
  if(!page.ok)throw new Error(`${page.status}: ${sourceUrl}`);
  const html=await page.text();
  await writeFile(`docs/sources/official-2026-11-18/product-${id}.html`,html);
  const structured=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>{try{return asArray(JSON.parse(match[1]))}catch{return []}});
  const product=structured.find(data=>['Product','ProductGroup'].includes(data?.['@type']));
  if(!product)throw new Error(`Sin datos Product en ${sourceUrl}`);
  const sourceName=product.name||item.name;
  const sourceVariants=asArray(product.hasVariant).length?asArray(product.hasVariant):[product];
  const sizes=[...new Set([...html.matchAll(/data-value-name="([^"]+)" data-attribute-name="Talla Calzado"/g)].map(match=>decode(match[1])))];
  const variants=sourceVariants.map((variant,index)=>({
    id:`${id}-${index+1}`,
    reference:variant.sku||`Odoo ${id}`,
    size:item.category==='calzado'?(sizes[index]?.match(/EU\s*([\d.]+)/i)?.[1]||null):null,
    sizeSystem:item.category==='calzado'?'EU':null,
    sourceSizeLabel:item.category==='calzado'?(sizes[index]||null):null,
    color:item.color||null,
    volume:item.category==='calzado'?null:volumeFrom(sourceName),
    concentration:item.category==='calzado'?null:concentrationFrom(sourceName),
    price:Number(variant.offers?.price??product.offers?.price??0)||null,
    currency:variant.offers?.priceCurrency||product.offers?.priceCurrency||'USD',
    availability:'confirmar',
    observedAvailability:variant.offers?.availability||product.offers?.availability||null,
    sourceUrl:variant.url||sourceUrl,
  }));
  const imageValue=sourceVariants.find(variant=>variant.image)?.image||product.image;
  const imageUrl=asArray(imageValue)[0]||html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if(!imageUrl)throw new Error(`Sin imagen en ${sourceUrl}`);
  const imageResponse=await fetch(imageUrl,{headers:{accept:'image/webp,image/*'}});
  if(!imageResponse.ok)throw new Error(`${imageResponse.status}: ${imageUrl}`);
  await writeFile(`public/assets/products/product-${id}.webp`,Buffer.from(await imageResponse.arrayBuffer()));
  products.push({id,category:item.category,name:item.name,sourceUrl,imageUrl,observedAt,brand:item.brand,sourceName,image:`/assets/products/product-${id}.webp`,variants});
  console.log(`${id} · ${item.brand} ${item.name} · ${variants.length} opción(es)`);
}

await writeFile('src/data/catalog.json',JSON.stringify(products,null,2)+'\n');
await writeFile('docs/sources/official-2026-11-18/manifest.json',JSON.stringify(products.map(({id,brand,name,sourceUrl,imageUrl,observedAt})=>({id,brand,name,sourceUrl,imageUrl,observedAt})),null,2)+'\n');

const icons=[
  ['calzado','https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/outline/shoe.svg'],
  ['perfume','https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/outline/perfume.svg'],
];
for(const [name,url] of icons){
  const response=await fetch(url);
  if(!response.ok)throw new Error(`${response.status}: ${url}`);
  const svg=(await response.text()).replace('<svg ','<svg aria-hidden="true" focusable="false" ');
  await writeFile(`public/assets/icons/${name}.svg`,svg);
}
console.log(`Catálogo sincronizado: ${products.filter(p=>p.category==='calzado').length} calzados y ${products.filter(p=>p.category!=='calzado').length} perfumes.`);
