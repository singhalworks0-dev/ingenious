import {chromium} from '@playwright/test';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,200))});
await page.goto('http://127.0.0.1:5174',{waitUntil:'networkidle'});await page.screenshot({path:'local-desktop.png'});console.log('errors',errors);console.log('main',await page.locator('main').boundingBox());
await page.getByRole('link',{name:'Shop now for Collagen+',exact:true}).click();await page.getByRole('button',{name:'ADD TO BAG',exact:false}).click();console.log('bag works',await page.getByRole('dialog',{name:'Shopping bag'}).isVisible());await page.getByRole('button',{name:'Close bag'}).click();
await page.getByRole('tab',{name:'Active',exact:true}).click();console.log('active tab',await page.getByRole('tab',{name:'Active',exact:true}).getAttribute('aria-selected'));
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5174',{waitUntil:'networkidle'});await page.screenshot({path:'local-mobile.png',fullPage:true});console.log('mobile overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await browser.close();


