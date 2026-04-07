import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src', 'pages');
const components = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

let extractedNav = '';

for (const file of components) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the bottom navigation block
  const navMatch = content.match(/<!-- Bottom Navigation Shell -->[\s\S]*?<nav[^>]*>([\s\S]*?)<\/nav>/i) 
    || content.match(/<nav className="fixed bottom-0[\s\S]*?<\/nav>/i);

  if (navMatch) {
    if (!extractedNav) {
      extractedNav = navMatch[0]; // Save the first one we find
    }
    // Remove the nav block from the page
    content = content.replace(navMatch[0], '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed bottom nav from ${file}`);
  }
}

if (extractedNav) {
  // Update extracted nav to use Link instead of <a>
  extractedNav = extractedNav.replace(/<a /g, '<Link ');
  extractedNav = extractedNav.replace(/<\/a>/g, '</Link>');
  extractedNav = extractedNav.replace(/href="#"/g, 'to="/"'); // Defaulting to home, will fix manually later

  const newNavContent = `import React from 'react';
import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    ${extractedNav}
  );
}
`;
  const navPath = path.join(process.cwd(), 'src', 'components', 'layout', 'BottomNav.tsx');
  fs.writeFileSync(navPath, newNavContent, 'utf8');
  console.log('Successfully wrote generic BottomNav');
}
