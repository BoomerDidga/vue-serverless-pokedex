const fs = require('fs');
const path = require('path');

/**
 * Helper script to automatically update the Pokemon images mapping in the Netlify function
 * 
 * Usage:
 * 1. Add Pokemon images to public/Pokemon Pictures/ directory
 * 2. Name them with the Pokemon number at the beginning (e.g., "3. Venusaur.png")
 * 3. Run: node scripts/update-pokemon-images.js
 */

const POKEMON_PICTURES_DIR = path.join(__dirname, '../public/Pokemon Pictures');
const NETLIFY_FUNCTION_PATH = path.join(__dirname, '../netlify/functions/pokedex.js');

function extractPokemonNumber(filename) {
  // Extract number from filename like "1. Bulbasaur-Pokemon-PNG-Isolated-HD.png"
  const match = filename.match(/^(\d+)\./);
  return match ? parseInt(match[1]) : null;
}

function scanPokemonImages() {
  if (!fs.existsSync(POKEMON_PICTURES_DIR)) {
    console.error('Pokemon Pictures directory not found:', POKEMON_PICTURES_DIR);
    return {};
  }

  const files = fs.readdirSync(POKEMON_PICTURES_DIR);
  const imageMapping = {};

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      const pokemonNumber = extractPokemonNumber(file);
      if (pokemonNumber) {
        imageMapping[pokemonNumber] = `/Pokemon Pictures/${file}`;
        console.log(`Found Pokemon #${pokemonNumber}: ${file}`);
      } else {
        console.warn(`Could not extract Pokemon number from: ${file}`);
      }
    }
  });

  return imageMapping;
}

function updateNetlifyFunction(imageMapping) {
  if (!fs.existsSync(NETLIFY_FUNCTION_PATH)) {
    console.error('Netlify function not found:', NETLIFY_FUNCTION_PATH);
    return false;
  }

  let functionContent = fs.readFileSync(NETLIFY_FUNCTION_PATH, 'utf8');
  
  // Generate the new localImages object
  const localImagesCode = `const localImages = ${JSON.stringify(imageMapping, null, 2)}`;
  
  // Replace the existing localImages declaration
  const updatedContent = functionContent.replace(
    /const localImages = \{[\s\S]*?\}/,
    localImagesCode
  );

  if (updatedContent === functionContent) {
    console.error('Could not find localImages declaration to update');
    return false;
  }

  fs.writeFileSync(NETLIFY_FUNCTION_PATH, updatedContent);
  console.log('✅ Updated Netlify function with new image mappings');
  return true;
}

function main() {
  console.log('🔍 Scanning for Pokemon images...');
  const imageMapping = scanPokemonImages();
  
  const count = Object.keys(imageMapping).length;
  console.log(`\n📊 Found ${count} Pokemon images`);
  
  if (count === 0) {
    console.log('No Pokemon images found. Make sure to:');
    console.log('1. Place images in public/Pokemon Pictures/');
    console.log('2. Name them starting with the Pokemon number (e.g., "1. Bulbasaur.png")');
    return;
  }

  console.log('\n🔄 Updating Netlify function...');
  const success = updateNetlifyFunction(imageMapping);
  
  if (success) {
    console.log('\n🎉 All done! Your Pokemon images are now integrated.');
    console.log('💡 Restart your development server to see the changes.');
  } else {
    console.log('\n❌ Failed to update the Netlify function.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { scanPokemonImages, updateNetlifyFunction };
