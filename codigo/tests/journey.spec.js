import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
async function capture(page,path){
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}scrollTo(0,0);});
  await page.locator('main img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
  await page.screenshot({path,fullPage:true});
}
const errors=[];
test.beforeEach(async({page})=>{
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
});
test.afterEach(()=>{expect(errors.splice(0)).toEqual([]);});
test('recorrido completo: categoría, filtros, variantes, persistencia y consulta copiada',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Tu próximo par.');
  await page.locator('.desktop-nav').getByRole('link',{name:'Calzado',exact:true}).click();
  await page.selectOption('#marca','Reebok');
  await page.selectOption('#talla','42');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('link',{name:'Elegir Reebok Cityride Black White',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('Cityride Black White');
  await page.getByLabel('EU 42',{exact:true}).check();
  await page.getByRole('button',{name:'Añadir a mi selección'}).click();
  await page.getByLabel('EU 45.5',{exact:true}).check();
  await page.getByRole('button',{name:'Añadir a mi selección'}).click();
  await page.locator('.selection-link').click();
  await expect(page.locator('.selection-item')).toHaveCount(2);
  await page.getByRole('button',{name:'Aumentar cantidad de Cityride Black White'}).first().click();
  await expect(page.locator('.total-row')).toContainText('210,00 USD');
  await page.reload();
  await expect(page.locator('.selection-item')).toHaveCount(2);
  await expect(page.locator('.quantity-control input').first()).toHaveValue('2');
  await page.getByLabel('Municipio de entrega').fill('Playa');
  await page.getByRole('link',{name:'Preparar consulta',exact:true}).click();
  const message=page.getByLabel('Mensaje preparado');
  await expect(message).toContainText('Municipio de entrega: Playa');
  await expect(message).toContainText('Subtotal referencial: 210,00 USD');
  await expect(page.getByRole('button',{name:'Envío a WhatsApp deshabilitado'})).toBeDisabled();
  await page.getByRole('button',{name:'Copiar mensaje'}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('EU 45.5');
  await page.getByRole('link',{name:'Editar mi selección'}).click();
  await page.getByRole('button',{name:'Eliminar Cityride Black White'}).first().click();
  await expect(page.locator('.selection-item')).toHaveCount(1);
  await page.getByRole('button',{name:'Eliminar Cityride Black White'}).click();
  await expect(page.getByRole('heading',{name:'Tu próxima elección empieza aquí.'})).toBeVisible();
});
test('búsqueda, filtros combinados, orden, limpieza y ruta inválida',async({page})=>{
  await page.goto('/#/catalogo?categoria=perfumeria');
  await page.selectOption('#ml','100');
  await page.selectOption('#concentracion','Eau de parfum');
  await page.selectOption('#precio','50');
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.selectOption('#orden','price-asc');
  await expect(page.locator('.product-card').first().locator('.price')).toHaveText('35,00 USD');
  await page.getByRole('searchbox',{name:'Buscar por nombre o marca'}).fill('nada-de-esto');
  await expect(page.getByRole('heading',{name:'No encontramos esa combinación.'})).toBeVisible();
  await page.getByRole('button',{name:'Limpiar búsqueda y filtros'}).click();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await page.getByRole('searchbox',{name:'Buscar por nombre o marca'}).fill('versace');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button',{name:'Quitar filtro versace'}).click();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await page.getByRole('button',{name:'Buscar productos',exact:true}).click();
  await page.getByRole('searchbox',{name:'Nombre del producto o marca'}).fill('Naxos');
  await page.getByRole('button',{name:'Buscar en el catálogo'}).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.goto('/#/producto/no-existe');
  await expect(page.getByRole('heading',{name:'Volvamos a explorar.'})).toBeVisible();
});
test('estados de error de imagen, almacenamiento corrupto y teclado',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('aleph-zero-selection-v1','corrupto'));
  await page.route('**/images/product-3656.webp',route=>route.abort());
  // El fallo de carga provocado no debe convertirse en un error de aplicación.
  page.removeAllListeners('console');
  await page.goto('/#/producto/3656');
  await expect(page.locator('.detail-photo .image-fallback')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button',{name:'Buscar productos',exact:true}).click();
  await expect(page.locator('#search-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#search-dialog')).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Buscar productos',exact:true})).toBeFocused();
});
test('rutas y anchos 360, 390, 768 y 1440 sin desbordamiento; capturas',async({page})=>{
  await mkdir('docs/checks/screenshots',{recursive:true});
  for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    for(const route of ['/#/','/#/catalogo?categoria=calzado','/#/producto/6511','/#/seleccion','/#/propuesta']){
      await page.goto(route);await page.locator('main').waitFor();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${route}`).toBe(true);
      await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
    }
    await page.goto('/');
    await capture(page,`docs/checks/screenshots/inicio-${width}.png`);
    if(width<768){
      await page.getByRole('button',{name:'Abrir menú'}).click();
      await page.locator('.mobile-nav').getByRole('link',{name:'Calzado',exact:true}).click();
      await page.locator('.filters summary').click();
      await page.selectOption('#marca','Puma');
      await expect(page.locator('.filters')).toHaveAttribute('open','');
      await page.selectOption('#precio','75');
      await expect(page.locator('.product-card')).toHaveCount(2);
    }
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  expect(await page.locator('.button').first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
});
test('selección y mensaje poblados en los cuatro anchos, foco y contraste de texto',async({page})=>{
  await page.goto('/#/producto/6511');
  await page.getByLabel('EU 42',{exact:true}).focus();
  await page.keyboard.press('Space');
  await expect(page.getByLabel('EU 42',{exact:true})).toBeChecked();
  await page.locator('.add-button').focus();
  await page.keyboard.press('Enter');
  await page.locator('.selection-link').click();
  await page.locator('#increase-6511-1').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#increase-6511-1')).toBeFocused();
  for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    for(const route of ['/#/seleccion','/#/consulta']){
      await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${route}`).toBe(true);
      if([390,1440].includes(width))await capture(page,`docs/checks/screenshots/${route.includes('consulta')?'consulta':'seleccion'}-${width}.png`);
    }
  }
  await page.goto('/');
  const contrast=await page.evaluate(()=>{
    const styles=getComputedStyle(document.documentElement);
    const rgb=hex=>hex.trim().replace('#','').match(/../g).map(n=>parseInt(n,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
    const luminance=hex=>rgb(hex).reduce((n,c,i)=>n+c*[.2126,.7152,.0722][i],0);
    const pairs=[['burdeos / fondo','--wine','--paper'],['texto secundario / fondo','--muted','--paper'],['texto secundario / crema','--muted','--cream'],['botón blanco / burdeos','#ffffff','--wine']];
    return pairs.map(([name,a,b])=>{const l1=luminance(a.startsWith('--')?styles.getPropertyValue(a):a),l2=luminance(b.startsWith('--')?styles.getPropertyValue(b):b);return {name,ratio:(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)};});
  });
  for(const pair of contrast)expect(pair.ratio,pair.name).toBeGreaterThanOrEqual(4.5);
  await writeFile('docs/checks/contrast.json',JSON.stringify(contrast,null,2));
  await page.goto('/#/catalogo');
  await capture(page,'docs/checks/screenshots/catalogo-1440.png');
  await page.setViewportSize({width:390,height:1000});await page.goto('/#/producto/6511');
  await capture(page,'docs/checks/screenshots/producto-390.png');
});
test('fallo de persistencia recuperable y cantidad inválida',async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError');};});
  await page.goto('/#/producto/3656');
  await page.getByRole('button',{name:'Añadir a mi selección'}).click();
  await page.locator('.selection-link').click();
  await expect(page.getByText('El navegador no permite guardar la selección.',{exact:false})).toBeVisible();
  await page.locator('.quantity-control input').fill('0');
  await page.locator('.quantity-control input').press('Tab');
  await expect(page.locator('.quantity-control input')).toHaveValue('1');
  await expect(page.locator('.total-row')).toContainText('125,00 USD');
});
