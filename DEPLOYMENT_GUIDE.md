# Deployment Guide

## Pre-Deployment Checklist

Before deploying, make sure you:

- ✅ Updated all personal information (name, social links)
- ✅ Tested with your actual API endpoints
- ✅ Verified all data displays correctly
- ✅ Tested on different screen sizes
- ✅ Updated favicon and meta tags
- ✅ Removed any console.log statements
- ✅ Checked for any browser console errors

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to preview the production build.

---

## Deployment Options

### 1. Vercel (Recommended)

**Easiest and fastest deployment for Vite projects**

#### Option A: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Option B: Deploy via Git

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Vite settings
6. Click "Deploy"

#### Environment Variables (if needed)

1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add your variables:
   - `VITE_API_BASE_URL` = your API URL

**Custom Domain**: Available in project settings

---

### 2. Netlify

**Great for static sites with continuous deployment**

#### Option A: Drag & Drop

1. Run `npm run build`
2. Visit [netlify.com](https://netlify.com)
3. Drag the `dist` folder to Netlify
4. Done!

#### Option B: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Option C: Git Integration

1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

#### Environment Variables

1. Site settings → Environment variables
2. Add your variables

**Custom Domain**: Available in domain settings

---

### 3. GitHub Pages

**Free hosting for GitHub repositories**

#### Setup

1. Install GitHub Pages package:

```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/portfolio",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/', // Your repo name
})
```

4. Deploy:

```bash
npm run deploy
```

5. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages
   - Select `gh-pages` branch
   - Save

**Note**: Environment variables aren't recommended for GitHub Pages as they'll be exposed in the client-side code.

---

### 4. Cloudflare Pages

**Fast global CDN with great performance**

1. Push code to GitHub
2. Visit [pages.cloudflare.com](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect your GitHub account
5. Select your repository
6. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
7. Click "Save and Deploy"

#### Environment Variables

1. Settings → Environment variables
2. Add your variables

---

### 5. Custom Server (VPS/Shared Hosting)

#### Using Static Files

1. Build the project:

```bash
npm run build
```

2. Upload `dist` folder contents to your server:

```bash
# Using SCP
scp -r dist/* user@server:/var/www/html/

# Using FTP
# Use FileZilla or similar
```

3. Configure your web server:

**Nginx Configuration**:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Apache Configuration** (.htaccess):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

### 6. Railway

**Simple deployment with Docker support**

1. Visit [railway.app](https://railway.app)
2. Click "New Project"
3. Connect GitHub repository
4. Railway auto-detects Vite
5. Click "Deploy"

---

### 7. Render

**Free tier available**

1. Push code to GitHub
2. Visit [render.com](https://render.com)
3. Click "New Static Site"
4. Connect repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Create Static Site"

---

## Domain Configuration

### Custom Domain Setup

1. **Purchase a domain** (Namecheap, Google Domains, etc.)

2. **Configure DNS**:

For Vercel/Netlify:
- Add A record: `@` → platform IP
- Add CNAME: `www` → `your-site.platform.app`

3. **Enable HTTPS**:
- Most platforms enable this automatically
- Wait for SSL certificate provisioning (5-10 minutes)

---

## Environment Variables

### Development (.env.local)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Production

Add environment variables in your platform's dashboard:

```env
VITE_API_BASE_URL=https://portfolio-api.ksoftdev.site/api/v1/portfolio
```

**Important**: In Vite, environment variables must be prefixed with `VITE_` to be exposed to your code.

---

## Performance Optimization

### Before Deployment

1. **Optimize Images**:
   - Use WebP format
   - Compress images (TinyPNG, ImageOptim)
   - Use appropriate sizes

2. **Remove Unused Code**:
   ```bash
   npm run build -- --mode production
   ```

3. **Check Bundle Size**:
   ```bash
   npm run build
   # Check dist folder size
   ```

### After Deployment

1. **Test Performance**:
   - [PageSpeed Insights](https://pagespeed.web.dev)
   - [GTmetrix](https://gtmetrix.com)
   - [WebPageTest](https://www.webpagetest.org)

2. **Enable Caching**:
   - Configure browser caching headers
   - Use CDN (Cloudflare)

3. **Monitor**:
   - Set up analytics (Google Analytics, Plausible)
   - Monitor errors (Sentry)

---

## Continuous Deployment

### Automatic Deployment on Git Push

Most platforms support auto-deployment:

1. Push to main/master branch
2. Platform detects changes
3. Automatically builds and deploys

### Branch Previews

Platforms like Vercel and Netlify create preview deployments for pull requests.

---

## Troubleshooting

### White Screen After Deployment

**Issue**: App works locally but shows blank page in production

**Solutions**:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check if base URL is set correctly in `vite.config.js`
4. Ensure environment variables are set

### 404 Errors on Routes

**Issue**: Direct URLs return 404

**Solution**: Configure your platform to redirect all routes to `index.html`

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** - Create `_redirects` in public folder:
```
/*    /index.html   200
```

### API CORS Errors

**Issue**: API requests blocked by CORS

**Solution**: Configure CORS on your backend to allow your domain:
```js
Access-Control-Allow-Origin: https://yourdomain.com
```

### Slow Loading

**Solutions**:
1. Enable gzip compression
2. Use a CDN
3. Optimize images
4. Code split large components
5. Lazy load images

---

## Rollback

### If Deployment Fails

**Vercel/Netlify**:
- Go to Deployments
- Find previous working version
- Click "Rollback"

**Manual**:
- Revert to previous commit
- Redeploy

---

## Post-Deployment

1. ✅ Test all links and buttons
2. ✅ Verify API data loads correctly
3. ✅ Test on multiple devices
4. ✅ Check browser compatibility
5. ✅ Set up analytics
6. ✅ Add to search console (Google, Bing)
7. ✅ Share your portfolio!

---

## Support & Resources

- [Vite Deployment Docs](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages Docs](https://pages.github.com)

---

**Need help?** Check the troubleshooting section or review platform documentation.

Good luck with your deployment! 🚀
