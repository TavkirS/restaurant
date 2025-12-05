# Bella Vista Restaurant - Premium Website

A fully responsive, ultra-fast, Hostinger-friendly premium restaurant website built with HTML5, Bootstrap 5, and modern web technologies. Features glassmorphism design, parallax effects, smooth animations, and complete order management system.

## 🚀 Features

### 🎨 Design & UX
- **Glassmorphism Design**: Modern frosted glass effects with backdrop blur
- **Parallax Hero**: Smooth scrolling parallax background effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Micro-interactions and CSS animations throughout
- **Gradient Styling**: Beautiful color gradients and visual effects

### 🍽️ Menu System
- **Multi-Image Galleries**: 2-3 WebP images per dish with lazy loading
- **Category Filters**: Filter by appetizers, main course, pasta, pizza, etc.
- **Veg/Non-Veg Icons**: Clear dietary indicators
- **Search Functionality**: Real-time search through menu items
- **Detailed Descriptions**: Rich descriptions and pricing for each item

### 🛒 Cart & Checkout
- **localStorage Cart**: Persistent cart that survives browser sessions
- **Real-time Calculations**: Automatic subtotal, GST, delivery fee, and total
- **Quantity Controls**: Easy add/remove items with quantity adjustments
- **Floating Cart Badge**: Always-visible cart indicator
- **WhatsApp Integration**: Direct order placement via WhatsApp

### 📱 PWA Features
- **Progressive Web App**: Installable on mobile devices
- **Offline Support**: Basic functionality works offline
- **Push Notifications**: Order status updates (framework ready)
- **App Shortcuts**: Quick access to menu and ordering

### 🔍 SEO & Performance
- **Schema.org Markup**: Rich snippets for restaurant information
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Sitemap & Robots.txt**: Proper search engine optimization
- **WebP Images**: Optimized images with lazy loading
- **Fast Loading**: Optimized for Hostinger hosting

## 📁 Project Structure

```
bella-vista-restaurant/
├── index.html                 # Homepage with hero and about sections
├── menu.html                  # Menu page with filtering and cart
├── checkout.html              # Checkout page with order form
├── config.js                  # Restaurant configuration (EDIT THIS)
├── menu.json                  # Menu data (EDIT THIS)
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker for PWA
├── robots.txt                 # SEO robots file
├── sitemap.xml               # SEO sitemap
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   ├── main.js          # Core functionality
│   │   ├── cart.js          # Cart management
│   │   ├── menu.js          # Menu system
│   │   └── checkout.js      # Checkout processing
│   └── images/
│       ├── menu/            # Menu item images (ADD YOUR IMAGES HERE)
│       │   └── placeholder/ # Placeholder images
│       └── favicons/        # Favicon files (GENERATE THESE)
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Download Files
Download all files to your local computer or directly to your Hostinger hosting account.

### 2. Configure Restaurant Details
Edit `config.js` to match your restaurant information:

```javascript
const CONFIG = {
  restaurantName: "Your Restaurant Name",
  restaurantTagline: "Your Tagline",
  phone: "+91-XXXXXXXXXX",
  whatsappNumber: "91XXXXXXXXXX", // Without + or 0 prefix
  email: "orders@yourrestaurant.com",
  gstPercentage: 5, // GST rate in your area
  deliveryFee: 50, // Delivery charge in rupees
  // ... other settings
};
```

### 3. Add Menu Items
Edit `menu.json` to add your actual menu items. Each item should have:

```json
{
  "id": "unique-item-id",
  "name": "Dish Name",
  "category": "appetizers", // Must match category IDs
  "price": 250, // Price in rupees
  "veg": true, // true for veg, false for non-veg
  "description": "Detailed description of the dish",
  "images": [
    "dish-image-1.webp",
    "dish-image-2.webp",
    "dish-image-3.webp"
  ]
}
```

### 4. Add Images
Your images are already organized in the proper folder:

```
assets/images/menu/placeholder/
├── imgtwo.webp     (Used for pasta dishes)
├── imgthree.webp   (Used for pizzas)
├── imgfour.jpg     (Used for main courses & desserts)
└── imgfive.webp    (Used for appetizers & beverages)
```

**Current Image Setup:**
- ✅ Images moved to correct folder
- ✅ Menu.json updated to reference your images
- ✅ Homepage hero and preview sections updated

**For Future Image Updates:**
- Add new images to `assets/images/menu/placeholder/`
- Update `menu.json` with new image filenames
- Use WebP format for best performance (JPG also supported)
- Recommended size: 800x600px for main images

**To Replace Images Later:**
1. Add new images to the folder
2. Update the filenames in `menu.json`
3. The website will automatically use the new images

### 5. Generate Favicons
Use an online favicon generator (like [RealFaviconGenerator](https://realfavicongenerator.net/)) with your restaurant logo:

- Input: Your restaurant logo (PNG/SVG, at least 512x512px)
- Output: Place all generated files in `assets/images/favicons/`

## 🔧 Customization Guide

### Changing Colors
Edit the CSS custom properties in `assets/css/style.css`:

```css
:root {
  --primary-color: #ff6b35;    /* Change primary color */
  --secondary-color: #f7931e;  /* Change secondary color */
  --accent-color: #8338ec;     /* Change accent color */
}
```

### Adding New Categories
1. Add category to `menu.json` categories array
2. Add corresponding filter button in `menu.html`
3. Add items with the new category ID

### Modifying Pricing
Update pricing in `config.js`:
- `gstPercentage`: GST rate (usually 5% in India)
- `deliveryFee`: Fixed delivery charge
- Individual item prices in `menu.json`

### Business Hours
Update opening hours in `config.js` under `businessHours`.

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- **Mobile Phones**: 320px and up
- **Tablets**: 768px and up
- **Desktops**: 992px and up
- **Large Screens**: 1200px and up

Test on actual devices to ensure optimal experience.

## 🚀 Deployment to Hostinger

### Step 1: Upload Files
1. Log into your Hostinger control panel
2. Go to **File Manager** or use **FTP**
3. Upload all files to your `public_html` directory
4. Ensure file permissions are set correctly (755 for directories, 644 for files)

### Step 2: Domain Configuration
1. Point your domain to Hostinger nameservers
2. Set up SSL certificate (Hostinger provides free SSL)
3. Update URLs in `config.js` and HTML files if needed

### Step 3: Update SEO Information
1. Update `sitemap.xml` with your actual domain
2. Update meta tags in HTML files
3. Submit sitemap to Google Search Console

### Step 4: Test Everything
1. **Check Images:** Visit `verify-images.html` to confirm all images load
2. Test all pages load correctly
3. Test menu filtering and search
4. Test cart functionality
5. Test checkout process
6. Test WhatsApp integration
7. Test on mobile devices

## 🔧 Maintenance Tasks

### Updating Menu Items
1. Edit `menu.json`
2. Add/remove images in `assets/images/menu/`
3. Test the changes

### Changing Prices
1. Update prices in `menu.json`
2. Update delivery fees in `config.js` if needed

### Adding New Features
- All JavaScript is modular and can be extended
- Follow existing patterns for consistency
- Test thoroughly before deploying

## 🐛 Troubleshooting

### Cart Not Working
- Check browser console for JavaScript errors
- Ensure localStorage is enabled
- Clear browser cache and try again

### Images Not Loading
- Check file paths in `menu.json`
- Ensure images are in WebP format
- Verify file permissions

### WhatsApp Not Opening
- Check `whatsappNumber` in `config.js`
- Ensure number format is correct (without + or 0 prefix)

### PWA Not Installing
- Ensure SSL certificate is active
- Check manifest.json for correct paths
- Service worker should register automatically

## 📞 Support

For technical issues or customization requests:
- Check browser console for error messages
- Verify all files are uploaded correctly
- Ensure JavaScript is enabled in browser
- Test with different browsers and devices

## 📈 Performance Tips

1. **Image Optimization**: Use WebP format and compress images
2. **Minification**: Minify CSS and JS files for production
3. **Caching**: Utilize browser caching and CDN if available
4. **Lazy Loading**: Images load only when needed
5. **Code Splitting**: JavaScript is split into modules

## 🔒 Security Notes

- No sensitive data is stored on the website
- All orders go directly through WhatsApp
- SSL certificate required for PWA functionality
- Regular security updates recommended

## 📝 License

This project is provided as-is for restaurant businesses. Feel free to modify and use commercially.

---

**Built with ❤️ for restaurant owners who want beautiful, functional websites that drive orders.**
