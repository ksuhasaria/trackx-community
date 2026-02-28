import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR STACK:', error.stack));

    await page.goto('http://localhost:5173/map', { waitUntil: 'networkidle2' });

    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const hexBtn = btns.find(b => b.innerText.includes('HEXBIN'));
        if (hexBtn) hexBtn.click();
        console.log('Clicked hexbtn');
    });

    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'hexbin_debug.png' });
    console.log('Saved screenshot');
    await browser.close();
})();
