import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readFile} from 'node:fs/promises';

for(const file of ['ABRIR WEB.html','web/index.html']){
  test(`copia independiente con doble clic: ${file}`,async({page})=>{
    const errors=[],remote=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    page.on('request',request=>{if(/^https?:/.test(request.url()))remote.push(request.url());});
    await page.goto(pathToFileURL(resolve('..',file)).href);
    await expect(page.getByRole('heading',{level:1})).toContainText('Tu próximo par.');
    await page.locator('.desktop-nav').getByRole('link',{name:'Calzado',exact:true}).click();
    await page.selectOption('#marca','Reebok');
    await page.getByRole('link',{name:'Elegir Reebok Cityride Black White',exact:true}).click();
    await page.getByLabel('EU 42',{exact:true}).check();
    await page.getByRole('button',{name:'Añadir a mi selección'}).click();
    await page.locator('.selection-link').click();
    await expect(page.locator('.selection-item')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('.selection-item')).toHaveCount(1);
    await page.getByRole('link',{name:'Preparar consulta',exact:true}).click();
    await expect(page.getByLabel('Mensaje preparado')).toContainText('EU 42');
    await expect(page.getByRole('button',{name:'Envío a WhatsApp deshabilitado'})).toBeDisabled();
    await page.locator('.brand').click();
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}scrollTo(0,0);});
    const badImages=await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(image=>image.decode().catch(()=>{})));return images.filter(image=>!image.naturalWidth).map(image=>image.src);});
    expect(badImages).toEqual([]);expect(errors).toEqual([]);expect(remote).toEqual([]);
  });
}
test('todos los archivos locales existen y el paquete no requiere un servidor',async()=>{
  const html=await readFile('../ABRIR WEB.html','utf8');
  expect(html).not.toContain('type="module"');
  for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
    if(/^https?:/.test(match[1]))continue;
    await readFile(resolve('..',match[1]));
  }
});
