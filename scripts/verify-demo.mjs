import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const origin=process.env.DEMO_URL||'http://127.0.0.1:5175';
const routes=JSON.parse(fs.readFileSync(new URL('../src/route-manifest.json',import.meta.url),'utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const failures=[],errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:950}});
 await page.addInitScript(()=>sessionStorage.setItem('ingenious-signup-dismissed','true'));
 page.on('pageerror',error=>errors.push(error.message));
 for(const path of [...Object.keys(routes),'/a/account/login','/a/account/register','/pages/region','/pages/affiliate','/checkout']){
  await page.goto(origin+path,{waitUntil:'domcontentloaded'});
  await page.locator('main:not(.demo-loading)').waitFor({timeout:10000});
  const liveLinks=await page.locator('a[href]').evaluateAll(xs=>xs.map(x=>x.href).filter(x=>/^https?:\/\/(?:www\.)?(?:ingeniouslife\.com|ingenious-laboratories\.myshopify\.com|eu\.ingeniouslife\.com)(?:\/|$)/.test(x)));
  if(liveLinks.length)failures.push({path,liveLinks});
  if(await page.getByRole('heading',{name:'Page not found',exact:true}).count())failures.push({path,reason:'Missing page'});
 }
 console.log('Checked',Object.keys(routes).length+5,'direct demo routes');
 await page.goto(origin+'/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Open menu',exact:true}).click();
 await page.getByRole('navigation',{name:'Expanded navigation'}).getByRole('link',{name:'OUR STORY',exact:true}).click();
 await expect(page).toHaveURL(origin+'/pages/about-us');await page.locator('main:not(.demo-loading)').waitFor();
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('main:not(.demo-loading)').waitFor();
 await page.goto(origin+'/products/ingenious-collagen',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'View product image 2',exact:true}).click();
 await expect(page.locator('.demo-product-main-image')).toHaveAttribute('alt','Collagen+ — image 2');
 await page.getByRole('button',{name:'ADD TO BAG — £135.00',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Shopping bag'})).toBeVisible();
 await page.getByRole('button',{name:'CHECKOUT →',exact:true}).click();await expect(page).toHaveURL(origin+'/checkout');
 await page.goto(origin+'/pages/collagen-calculator',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'START THE QUIZ',exact:true}).click();
 await page.getByRole('button',{name:'Female',exact:true}).click();await page.getByRole('button',{name:'NEXT →',exact:true}).click();
 await page.getByRole('spinbutton',{name:'Age',exact:true}).fill('35');await page.getByRole('button',{name:'NEXT →',exact:true}).click();
 await page.getByRole('button',{name:'Daily or intense training',exact:true}).click();await page.getByRole('button',{name:'SEE MY MATCH →',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Your match: Active',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'DISCOVER ACTIVE',exact:true}).click();await expect(page).toHaveURL(origin+'/products/ingenious-active');
 for(const path of ['/pages/about-us','/pages/ingredients','/products/ingenious-active','/blogs/blog?page=2','/a/account/register','/pages/rewards','/pages/faqs']){
  await page.setViewportSize({width:390,height:844});await page.goto(origin+path,{waitUntil:'networkidle'});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push({path,reason:'Mobile overflow'});
 }
 console.log(JSON.stringify({failures,errors,flows:'menu, direct refresh, gallery, add to bag, local checkout, quiz and mobile passed'},null,2));
 if(failures.length||errors.length)throw new Error('Demo verification failed');
}finally{await browser.close()}
