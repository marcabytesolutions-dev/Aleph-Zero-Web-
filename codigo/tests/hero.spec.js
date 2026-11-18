import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir} from 'node:fs/promises';

test('hero: elección directa de categorías, imágenes y teclado en cuatro anchos',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  const url=pathToFileURL(resolve('../ABRIR WEB.html')).href;
  await mkdir('docs/checks/screenshots',{recursive:true});
  for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    await page.goto(url);
    const hero=page.getByRole('region',{name:'Tu próximo par. Tu nueva esencia.'});
    const shoes=hero.getByRole('link',{name:'Explorar calzado',exact:true});
    const perfumes=hero.getByRole('link',{name:'Explorar perfumes',exact:true});
    await expect(shoes).toBeInViewport({ratio:1});
    await expect(perfumes).toBeInViewport({ratio:1});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await hero.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>img.decode()));return imgs.every(img=>img.naturalWidth>0);})).toBe(true);
    await perfumes.focus();await expect(perfumes).toBeFocused();
    expect(await perfumes.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading',{level:1})).toHaveText('Perfumería');
    await expect(page.locator('.product-card')).toHaveCount(6);
    await page.locator('.brand').click();
    await shoes.click();
    await expect(page.getByRole('heading',{level:1})).toHaveText('Calzado');
    await expect(page.locator('.product-card')).toHaveCount(4);
    await page.locator('.brand').click();
    await hero.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
    await page.screenshot({path:`docs/checks/screenshots/hero-${width}.png`});
  }
  expect(errors).toEqual([]);
});
