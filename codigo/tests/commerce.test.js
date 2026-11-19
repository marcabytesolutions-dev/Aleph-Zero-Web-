import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanCart,cartLines,total,orderMessage,shop,orderTotal} from '../src/lib/commerce.js';
test('descarta stock agotado y datos inválidos; limita duplicados',()=>{
 const valid={productId:'6511',variantId:'6511-2',quantity:3};
 assert.deepEqual(cleanCart([null,{...valid,quantity:-1},{...valid,variantId:'6511-1'},valid,valid]),[{...valid,quantity:5}]);
 assert.deepEqual(cleanCart({}),[]);
});
test('calcula y prepara solicitud sin modificar el carrito ni el stock',()=>{
 const cart=[{productId:'6511',variantId:'6511-2',quantity:2}],before=JSON.stringify(cart);
 assert.equal(total(cart),140);
 const msg=orderMessage(cart,{name:'Cliente',phone:'55555555',delivery:'coordinate'});
 assert.match(msg,/140.00 USD \+ entrega por confirmar/);
 assert.match(msg,/EU 45.5/);
 assert.equal(JSON.stringify(cart),before);
 assert.equal(cartLines(cart)[0].variant.stock,5);
 shop.delivery.havana=3;
 assert.equal(orderTotal(cart,'havana'),143);
 assert.match(orderMessage(cart,{name:'Cliente',phone:'55555555',delivery:'havana'}),/143.00 USD/);
 shop.delivery.havana=0;
});
