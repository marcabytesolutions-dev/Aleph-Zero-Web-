import test from 'node:test';
import assert from 'node:assert/strict';
import products from '../src/catalog.json' with {type:'json'};
import {filterProducts,sanitizeSelection,selectionLines,totalsFor,buildMessage,priceLabel,variantLabel} from '../src/domain.js';
test('búsqueda por nombre y marca, filtros combinados y orden',()=>{
  assert.equal(filterProducts(products,{q:'VERSACE'}).length,1);
  assert.equal(filterProducts(products,{category:'calzado',brand:'Reebok',size:'39',price:'75'}).length,1);
  assert.equal(filterProducts(products,{category:'arabes',volume:'100',concentration:'Eau de parfum',price:'50'}).length,3);
  assert.equal(filterProducts(products,{q:'inexistente'}).length,0);
  const sorted=filterProducts(products,{sort:'price-desc'});
  assert.equal(sorted[0].brand,'Xerjoff');
});
test('variantes separadas, cantidades válidas y datos corruptos',()=>{
  const base={productId:'6511',variantId:'6511-1',quantity:1};
  const sanitized=sanitizeSelection([base,{...base,quantity:2},{...base,variantId:'6511-2',quantity:1},{...base,quantity:-2},{...base,variantId:'bad'},{...base,productId:'none'}],products);
  assert.equal(sanitized.length,2);assert.equal(sanitized[0].quantity,3);
  assert.equal(sanitizeSelection(null,products).length,0);
  assert.equal(sanitizeSelection([{...base,quantity:500}],products)[0].quantity,99);
  assert.equal(selectionLines(sanitized,products)[1].variant.size,'45.5');
});
test('cálculos por moneda, decimales y precios pendientes',()=>{
  const lines=[{quantity:3,variant:{price:0.1,currency:'USD'}},{quantity:1,variant:{price:12,currency:'EUR'}},{quantity:2,variant:{price:null,currency:'USD'}},{quantity:1,variant:{price:20,currency:null}}];
  assert.deepEqual(totalsFor(lines),{totals:{USD:.3,EUR:12},unknown:3});
  assert.equal(priceLabel({price:null,currency:'USD'}),'Precio por confirmar');
  assert.equal(priceLabel({price:0,currency:'USD'}),'0,00 USD');
});
test('mensaje completo con referencias, variantes, enlace y subtotal parcial',()=>{
  const lines=selectionLines([{productId:'6511',variantId:'6511-2',quantity:2}],products);
  const message=buildMessage(lines,'Playa');
  for(const text of ['EU 45.5','Blanco / negro','Cantidad: 2','140,00 USD','Referencia:','https://aleph-zero.odoo.com/','Municipio de entrega: Playa','no reserva existencias'])assert.ok(message.includes(text),text);
  const unknown=[{...lines[0],variant:{...lines[0].variant,price:null}}];
  assert.match(buildMessage(unknown),/No hay un total completo/);
  assert.doesNotMatch(buildMessage(unknown),/0,00 USD/);
  assert.equal(variantLabel(products.find(p=>p.id==='3656').variants[0]),'90 ml · Parfum');
});
test('integridad y trazabilidad de muestra, sin existencias inventadas',()=>{
  assert.equal(products.length,10);assert.equal(products.filter(p=>p.category==='calzado').length,4);
  for(const p of products){assert.ok(p.sourceUrl.startsWith('https://aleph-zero.odoo.com/shop/'));assert.equal(p.observedAt,'2026-11-14');for(const v of p.variants){assert.equal(v.availability,'confirmar');assert.equal(v.currency,'USD');assert.ok(v.sourceUrl);}}
});
