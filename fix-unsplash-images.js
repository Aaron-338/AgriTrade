/**
 * Fix Unsplash Image URLs Script
 * 
 * This script replaces the broken Unsplash image URLs with working ones.
 * Run this script to update the image references in your code.
 */

const fs = require('fs');
const path = require('path');

// Define the broken image URLs and their replacements
const imageReplacements = {
  'https://images.unsplash.com/photo-1592982551635-069e7b9a171d?q=80&w=1000&auto=format&fit=crop': 
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1000&auto=format&fit=crop',
  
  'https://images.unsplash.com/photo-1623775435336-10c16d7f923d?q=80&w=1000&auto=format&fit=crop': 
    'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?q=80&w=1000&auto=format&fit=crop',
  
  'https://images.unsplash.com/photo-1599373670414-47663615fb41?q=80&w=1000&auto=format&fit=crop': 
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000&auto=format&fit=crop'
};

// Directory to search for files
const srcDir = path.join(process.cwd(), 'src');

// Function to replace image URLs in a file
function replaceImagesInFile(filePath) {
  try {
    // Check if file exists and is a file (not a directory)
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) return;
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace each broken URL with its working alternative
    Object.entries(imageReplacements).forEach(([oldUrl, newUrl]) => {
      if (content.includes(oldUrl)) {
        content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
        modified = true;
      }
    });
    
    // Write file if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated images in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to traverse directory recursively
function traverseDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    try {
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules and .next directories
        if (file === 'node_modules' || file === '.next') return;
        traverseDirectory(fullPath);
      } else if (stats.isFile() && 
                (file.endsWith('.js') || 
                 file.endsWith('.jsx') || 
                 file.endsWith('.ts') || 
                 file.endsWith('.tsx'))) {
        replaceImagesInFile(fullPath);
      }
    } catch (error) {
      console.error(`❌ Error accessing ${fullPath}:`, error.message);
    }
  });
}

// Main function
function main() {
  console.log('🔍 Searching for Unsplash image URLs to fix...');
  
  if (!fs.existsSync(srcDir)) {
    console.error(`❌ Directory not found: ${srcDir}`);
    console.log('Please run this script from the root of your project.');
    process.exit(1);
  }
  
  traverseDirectory(srcDir);
  
  console.log('✨ Image URL replacement complete!');
  console.log('Please restart your development server to see the changes.');
}

// Run the script
main(); 