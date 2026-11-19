import {mkdir,writeFile} from 'node:fs/promises';
const base='https://aleph-zero.odoo.com';
const resources=[
  ['/','docs/sources/home.html'],
  ['/shop/category/calzado-1','docs/sources/calzado.html'],
  ['/shop/category/perfumes-disenador-nicho-7','docs/sources/disenador.html'],
  ['/shop/category/perfumes-arabes-6','docs/sources/arabes.html'],
  ['/shop/cart','docs/sources/carrito.html'],
  ['/web/image/website/1/logo/Aleph%20Zero?unique=7ef5395','public/assets/brand/logo-original.png'],
  ['/web/assets/1/568789c/web.assets_frontend.min.css','docs/sources/original.css'],
];
for(const [url,path]of resources){
  await mkdir(path.slice(0,path.lastIndexOf('/')),{recursive:true});
  const response=await fetch(base+url);
  if(!response.ok)throw Error(`${response.status} ${url}`);
  await writeFile(path,Buffer.from(await response.arrayBuffer()));console.log(path);
}
