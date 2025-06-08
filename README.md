# 🖼️ wp-post2image

**wp-post2image** is a Node.js-based image generation service designed to work with a WordPress plugin. When a post is published, the plugin sends the title and featured image to this service, which returns a stylized 9:5 promotional image suitable for social media.

---

## 🚀 Features

- Converts WordPress post data into promotional images
- Clean, darkened background with centered headline text
- Output resolution: **1800x1000** (ideal 9:5 ratio)
- Secured with API key authentication
- Ready to deploy on platforms like [Render](https://render.com)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/wp-post2image.git
cd wp-post2image
npm install
