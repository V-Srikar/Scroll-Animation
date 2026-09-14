const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Wait a moment for rendering
  await new Promise(r => setTimeout(r, 1000));
  
  const metrics = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    const footerRect = footer ? footer.getBoundingClientRect() : null;
    return {
      bodyScrollHeight: document.body.scrollHeight,
      bodyOffsetHeight: document.body.offsetHeight,
      htmlScrollHeight: document.documentElement.scrollHeight,
      footerBottom: footerRect ? footerRect.bottom + window.scrollY : null,
    };
  });
  
  console.log(metrics);
  await browser.close();
})();
