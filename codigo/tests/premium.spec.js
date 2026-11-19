import {test,expect} from '@playwright/test';
test('rutas, imágenes y diseño responsive',async({page})=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:950});
  for(const route of ['/','/calzado','/perfumes','/como-comprar','/sobre-nosotros','/contacto','/redes-sociales','/catalogo','/producto/6511']){
   await page.goto('/#'+route);
   await expect(page.locator('main h1')).toBeVisible();
   for(const img of await page.locator('main img[loading="lazy"]').all())await img.scrollIntoViewIfNeeded();
   await page.locator('main img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>img.decode().catch(()=>{})));});
   const sizes=await page.evaluate(()=>({
    page:document.documentElement.scrollWidth,
    viewport:innerWidth,
    offenders:[...document.querySelectorAll('body *')].map(el=>({tag:el.tagName,cls:el.className,id:el.id,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})).filter(x=>x.left<-.5||x.right>innerWidth+.5).slice(0,8)
   }));
   expect(sizes.page,`Desbordamiento en ${route} a ${width}px: ${JSON.stringify(sizes.offenders)}`).toBeLessThanOrEqual(sizes.viewport);
   const broken=await page.locator('main img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>i.currentSrc||i.src));
   expect(broken,`Imágenes inválidas en ${route} a ${width}px`).toEqual([]);
  }
  await page.goto('/#/');
  await page.screenshot({path:`docs/checks/screenshots/premium-${width}.png`,fullPage:true});
 }
 expect(errors).toEqual([]);
});
test('filtros, búsqueda, ordenación y menú móvil',async({page})=>{
 await page.goto('/#/calzado');await page.locator('[name=brand]').selectOption('Reebok');await expect(page.locator('#results .product-card')).toHaveCount(1);await page.locator('#query').fill('inexistente');await expect(page.locator('#results')).toContainText('0 productos');await page.getByRole('button',{name:'Limpiar filtros ×'}).click();await page.locator('[name=sort]').selectOption('price-asc');const prices=await page.locator('#results .card-price strong').allTextContents();expect(prices.length).toBeGreaterThan(0);await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Menú',exact:true}).click();await expect(page.locator('header nav')).toBeVisible();await page.locator('header nav').getByRole('link',{name:'Perfumes',exact:true}).click();await expect(page).toHaveURL(/perfumes/);await page.getByRole('button',{name:'Buscar productos'}).click();await page.locator('#search input').fill('Dior');await page.locator('#search form button').click();await expect(page.locator('#results .product-card')).toHaveCount(1);
});
test('variantes, límite de stock, persistencia y checkout sin envío real',async({page})=>{
 await page.addInitScript(()=>{window.open=(url)=>{window.__requestedURL=url;return null;};});
 await page.goto('/#/producto/6511');await expect(page.locator('input[value="6511-1"]')).toBeDisabled();await page.locator('input[value="6511-2"]').check();await page.locator('[name=quantity]').fill('2');await page.getByRole('button',{name:'Añadir al carrito'}).click();await expect(page.locator('#cart')).toBeVisible();await expect(page.locator('#cart')).toContainText('45.5');await page.locator('#cart [data-act=quantity][data-delta="1"]').click();await page.reload();await page.getByRole('button',{name:'Abrir carrito'}).click();await expect(page.locator('#cart .quantity>span')).toHaveText('3');await page.locator('#cart [data-delta="1"]').click();await page.locator('#cart [data-delta="1"]').click();await expect(page.locator('#cart [data-delta="1"]')).toBeDisabled();await page.locator('#cart').getByRole('link',{name:'Proceder al pedido'}).click();await page.locator('#checkout button[type=submit]').click();expect(await page.evaluate(()=>window.__requestedURL)).toBeUndefined();await page.locator('[name=name]').fill('Cliente Prueba');await page.locator('[name=phone]').fill('+5355555555');await page.locator('[name=zone]').fill('Plaza');await page.locator('[name=address]').fill('Dirección de prueba');await page.locator('[name=notes]').fill('Solo prueba local');await page.locator('#checkout button[type=submit]').click();const url=await page.evaluate(()=>window.__requestedURL);expect(url).toContain('https://wa.me/5353755872?text=');const msg=new URL(url).searchParams.get('text');expect(msg).toContain('350.00 USD');expect(msg).toContain('EU 45.5');expect(msg).toContain('Dirección de prueba');expect(msg).toContain('No constituye reserva');await page.reload();await expect(page.locator('.summary-line')).toHaveCount(1);await page.locator('[name=delivery]').selectOption('coordinate');await expect(page.locator('#address-fields')).toBeHidden();await expect(page.locator('#checkout-total')).toContainText('+ entrega');await page.getByRole('button',{name:'Abrir carrito'}).click();await page.locator('#cart [data-act=remove]').click();await expect(page.locator('#cart')).toContainText('Tu carrito está vacío');
});
test('la tarjeta presenta compra, información y consulta',async({page})=>{
 await page.goto('/#/catalogo');
 const card=page.locator('.product-card').first();
 await expect(card.locator('.card-actions').getByRole('button',{name:/Agregar al carrito|Ver opciones/})).toBeVisible();
 await expect(card.locator('.card-actions').getByRole('link',{name:'Más información'})).toBeVisible();
 await expect(card.getByRole('button',{name:'Vista rápida'})).toHaveCount(0);
 await expect(card.getByRole('link',{name:/Consultar disponibilidad/})).toBeVisible();
});
test('Me encanta guarda favoritos y abre su sección',async({page})=>{
 await page.goto('/#/catalogo');
 await page.locator('.product-card').first().getByRole('button',{name:'Agregar a Me encanta'}).click();
 await expect(page.getByRole('button',{name:'Abrir Me encanta'}).locator('span')).toHaveText('1');
 await page.getByRole('button',{name:'Abrir Me encanta'}).click();
 await expect(page.getByRole('heading',{name:'Me encanta.'})).toBeVisible();
 await expect(page.locator('.favorites-grid .product-card')).toHaveCount(1);
});
test('agregar desde la tarjeta solicita variante antes del carrito',async({page})=>{
 await page.goto('/#/catalogo');
 await page.locator('.product-card').first().getByRole('button',{name:/Agregar al carrito|Ver opciones/}).click();
 await expect(page.locator('#product-picker')).toBeVisible();
 await page.locator('#product-picker input[name="variant"]:not([disabled])').first().check();
 await page.locator('#product-picker').getByRole('button',{name:'Agregar al carrito'}).click();
 await expect(page.locator('#cart')).toBeVisible();
 await expect(page.locator('#cart')).toContainText('Cityride Black White');
});
test('más información regresa a los filtros y posición anteriores',async({page})=>{
 await page.goto('/#/calzado');
 await page.locator('[name=brand]').selectOption('Puma');
 const target=page.locator('.product-card').nth(4);
 await target.scrollIntoViewIfNeeded();
 const previousY=await page.evaluate(()=>scrollY);
 expect(previousY).toBeGreaterThan(300);
 await target.getByRole('link',{name:'Más información'}).click();
 await expect(page.locator('.return-results')).toBeVisible();
 await page.locator('.return-results').click();
 await expect(page).toHaveURL(/#\/calzado/);
 await expect(page.locator('[name=brand]')).toHaveValue('Puma');
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(previousY-220);
});
test('versión de doble clic funciona sin servidor',async({page})=>{
 await page.goto(new URL('../../ABRIR WEB.html',import.meta.url).href);await expect(page.getByRole('heading',{name:'Tu estilo se ve. Tu esencia permanece.'})).toBeVisible();await page.goto(new URL('../../ABRIR WEB.html',import.meta.url).href+'#/perfumes');await expect(page.locator('#results .product-card')).toHaveCount(10);
});
