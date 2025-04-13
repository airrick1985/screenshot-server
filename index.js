const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/screenshot', async (req, res) => {
  const { url, fileName = "screenshot.png" } = req.body;
  if (!url) return res.status(400).send('Missing URL');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);

    const image = await page.screenshot({ fullPage: true });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(image);
  } catch (err) {
    console.error('截圖錯誤：', err);
    res.status(500).send('截圖失敗');
  } finally {
    await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
