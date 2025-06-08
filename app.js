require('dotenv').config();

const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuid4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) =>{
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${API_KEY}`){
        return res.status(401).json({ error: 'Unauthroized'});
    }
    next();
})


app.post('/generate-image', async (req, res) => {
  const { title, image } = req.body;
  if (!title || !image) {
    return res.status(400).json({ error: 'Missing title or image URL' });
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1800, height: 1000 });

    const html = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: sans-serif;
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            .background {
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: cover;
              filter: brightness(0.6);
            }
            .title {
              position: absolute;
              width: 100%;
              top: 50%;
              transform: translateY(-50%);
              text-align: center;
              color: white;
              font-size: 60px;
              font-weight: bold;
              padding: 0 40px;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <img src="${image}" class="background" />
          <div class="title">${title}</div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const outputPath = path.join(__dirname, `output-${uuid4()}.png`);
    await page.screenshot({ path: outputPath });

    await browser.close();

    res.sendFile(outputPath, () => {
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Error generating image:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.get('/', (req, res) => {
  res.send('Image Generator is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
