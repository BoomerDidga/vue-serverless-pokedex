# Pokemon Images Integration Guide

This guide explains how to use local Pokemon images in your Vue Serverless Pokedex.

## 🖼️ Current Setup

Your Pokedex now supports local Pokemon images with automatic fallback to online sprites. Here's what's been implemented:

### Features
- **Local Images**: High-quality Pokemon images stored in `public/Pokemon Pictures/`
- **Automatic Fallback**: If local image fails to load, falls back to official Pokemon sprites
- **Responsive Design**: Images are properly sized and styled for the card layout
- **Error Handling**: Graceful handling of missing or broken images

### Current Pokemon Images
- **#001 Bulbasaur**: `1. Bulbasaur-Pokemon-PNG-Isolated-HD.png`
- **#002 Ivysaur**: `2. ivysaur-256x256.png`

## 📁 Adding More Pokemon Images

### Method 1: Manual Addition

1. **Add Image Files**
   - Place Pokemon images in `public/Pokemon Pictures/` directory
   - Name them starting with the Pokemon number: `{number}. {name}.{extension}`
   - Examples:
     - `3. Venusaur.png`
     - `4. Charmander.jpg`
     - `25. Pikachu.png`

2. **Update the Mapping**
   - Open `netlify/functions/pokedex.js`
   - Add entries to the `localImages` object:
   ```javascript
   const localImages = {
     1: '/Pokemon Pictures/1. Bulbasaur-Pokemon-PNG-Isolated-HD.png',
     2: '/Pokemon Pictures/2. ivysaur-256x256.png',
     3: '/Pokemon Pictures/3. Venusaur.png',  // Add new entries here
     4: '/Pokemon Pictures/4. Charmander.jpg',
     // ... more Pokemon
   }
   ```

3. **Restart Development Server**
   ```bash
   npm run serve
   ```

### Method 2: Automated Script (Recommended)

1. **Add Image Files**
   - Place Pokemon images in `public/Pokemon Pictures/` directory
   - Name them starting with the Pokemon number: `{number}. {name}.{extension}`

2. **Run the Update Script**
   ```bash
   node scripts/update-pokemon-images.js
   ```

3. **Restart Development Server**
   ```bash
   npm run serve
   ```

## 🎨 Image Requirements

### Supported Formats
- PNG (recommended for transparency)
- JPG/JPEG
- GIF
- WebP

### Recommended Specifications
- **Size**: 256x256px or larger (will be resized to 120x120px in display)
- **Background**: Transparent PNG preferred
- **Quality**: High resolution for best appearance

### Naming Convention
- Start with Pokemon number followed by a period
- Examples:
  - ✅ `1. Bulbasaur.png`
  - ✅ `25. Pikachu-Electric-Type.jpg`
  - ✅ `150. Mewtwo.png`
  - ❌ `Bulbasaur.png` (missing number)
  - ❌ `001-Bulbasaur.png` (wrong format)

## 🔧 Technical Details

### How It Works
1. **Netlify Function**: `netlify/functions/pokedex.js` fetches Pokemon data and adds local image paths
2. **Vue Component**: `PokedexCard.vue` displays local images with fallback to online sprites
3. **Error Handling**: If local image fails, automatically switches to Pokemon sprite from PokeAPI

### Image Loading Priority
1. **Local Image**: Tries to load from `public/Pokemon Pictures/` first
2. **Fallback Sprite**: If local image fails, loads from `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{number}.png`

### File Structure
```
public/
  Pokemon Pictures/
    1. Bulbasaur-Pokemon-PNG-Isolated-HD.png
    2. ivysaur-256x256.png
    (add more images here)

netlify/
  functions/
    pokedex.js  (contains image mapping)

scripts/
  update-pokemon-images.js  (automation script)
```

## 🚀 Deployment Notes

When deploying to Netlify:
1. All files in `public/Pokemon Pictures/` will be served as static assets
2. The Netlify function will automatically include local image paths
3. Images will be accessible at `https://your-site.netlify.app/Pokemon Pictures/filename.png`

## 🐛 Troubleshooting

### Images Not Showing
1. Check file names start with Pokemon number
2. Verify images are in `public/Pokemon Pictures/` directory
3. Run the update script: `node scripts/update-pokemon-images.js`
4. Restart development server

### Script Not Working
1. Make sure you're in the project root directory
2. Check that `public/Pokemon Pictures/` exists
3. Verify image files have correct naming convention

### Performance Tips
- Optimize image sizes (recommend 256x256px max)
- Use PNG for Pokemon with transparent backgrounds
- Consider WebP format for smaller file sizes

## 📝 Example Usage

After adding images and running the script, your Pokedex will:
- Display high-quality local images for Pokemon you have pictures for
- Show official sprites for Pokemon without local images
- Provide smooth fallback if any image fails to load

Enjoy your enhanced Pokemon experience! 🎮✨
