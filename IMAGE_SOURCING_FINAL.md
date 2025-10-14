# Final Image Sourcing Guide for Topia Consult

## Current Status
✅ **Actual Topia logos implemented** on all pages
✅ **Service cards updated** with Unsplash image placeholders
✅ **Revenue statistics removed** from Revenue Assurance page
✅ **Professional image backgrounds** added to homepage services

## Images Currently Used (via Unsplash CDN)

### Homepage Service Cards
These are currently loading from Unsplash and working live:

1. **Digital Solutions Card**
   - Current: https://images.unsplash.com/photo-1451187580459-43490279c0fa
   - Theme: Global network/technology visualization
   - To replace: Download higher quality version or use Pexels alternative

2. **ESG Consulting Card**
   - Current: https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9
   - Theme: Green technology/solar panels
   - To replace: Search Pexels for "sustainable technology africa"

3. **Revenue Assurance Card**
   - Current: https://images.unsplash.com/photo-1460925895917-afdab827c52f
   - Theme: Analytics dashboard/charts
   - To replace: Search Pexels for "financial analytics dashboard"

4. **Commerce Solutions Card**
   - Current: https://images.unsplash.com/photo-1556742111-a301076d9d18
   - Theme: Mobile shopping/e-commerce
   - To replace: Search Pexels for "mobile payment africa"

## Recommended Next Steps for Better Images

### Option 1: Keep Unsplash (Easiest)
The current images are professional and work well. No action needed.

### Option 2: Download from Pexels (More Control)
Visit these Pexels searches and download images:

#### For Homepage Service Cards:
1. **Digital Solutions**: https://www.pexels.com/search/technology%20network/
   - Look for: Global connectivity, data centers, cloud computing
   - Download as: `service-digital.jpg`
   - Save to: `assets/images/services/`

2. **ESG Consulting**: https://www.pexels.com/search/sustainable%20technology/
   - Look for: Solar panels, green buildings, wind energy
   - Download as: `service-esg.jpg`
   - Save to: `assets/images/services/`

3. **Revenue Assurance**: https://www.pexels.com/search/business%20analytics/
   - Look for: Charts, data visualization, financial graphs
   - Download as: `service-revenue.jpg`
   - Save to: `assets/images/services/`

4. **Commerce Solutions**: https://www.pexels.com/search/mobile%20commerce/
   - Look for: Mobile payments, online shopping, digital transactions
   - Download as: `service-commerce.jpg`
   - Save to: `assets/images/services/`

### Option 3: Use African-Specific Images (Most Authentic)
For a truly African feel, search for:

1. **Lagos/Nairobi Skyline**: https://www.pexels.com/search/lagos%20nigeria/
2. **African Tech Professionals**: https://www.pexels.com/search/african%20business%20technology/
3. **African Innovation**: https://www.pexels.com/search/african%20startup/

## How to Replace Unsplash URLs with Local Images

If you download images, update `index.html` service cards:

### Current Code:
```html
<div class="service-image" style="background-image: linear-gradient(...), url('https://images.unsplash.com/...');">
```

### Replace With:
```html
<div class="service-image" style="background-image: linear-gradient(...), url('assets/images/services/service-digital.jpg');">
```

## Additional Images Needed (Future Enhancement)

### Hero Section Background (Optional)
- Search: "african city skyline night" or "modern africa technology"
- Download as: `hero-bg.jpg`
- Save to: `assets/images/hero/`
- Size: 1920x1080px minimum

### About Page Team Photos (Optional)
- Currently using placeholder gradients
- If you want real photos, save to: `assets/images/team/`
- Format: 800x800px square images

### Service Page Heroes (Optional)
Each service page can have a custom hero background:
- **Digital**: Data center, servers, cloud infrastructure
- **ESG**: Wind turbines, solar farm, green buildings
- **Revenue**: Financial district, business analytics
- **Commerce**: Shopping district, mobile payments

## Image Optimization Recommendations

Before uploading any images:
1. **Resize** to appropriate dimensions (service cards: 800x600px)
2. **Compress** using TinyPNG.com or Squoosh.app
3. **Target size**: < 200KB per image
4. **Format**: WebP for best performance, JPG as fallback

## Logo Files Already In Use
✅ **Navigation Logo**: `assets/images/resources/logo-1.png`
✅ **Footer Logo**: `assets/images/resources/logo-2.png`

These are working perfectly across all pages!

## Quick Action Checklist

If you want to improve images further:
- [ ] Visit Pexels and download 4 service card images
- [ ] Save to `assets/images/services/` folder
- [ ] Update index.html URLs from Unsplash to local paths
- [ ] Compress images to < 200KB each
- [ ] Test on live site

## Current Setup is Production-Ready!
The website is already using professional images from Unsplash CDN, which is:
- ✅ Fast (CDN delivery)
- ✅ Professional quality
- ✅ Properly licensed
- ✅ No additional work needed

You can deploy as-is, or enhance with downloaded images later!