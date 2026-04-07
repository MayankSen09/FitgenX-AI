import fs from 'fs';
import path from 'path';

const mapping = {
  'home_dashboard': 'Dashboard.tsx',
  'onboarding_ai_setup': 'Onboarding.tsx',
  'profile_xp_system': 'Profile.tsx',
  'exercise_library_training': 'WorkoutPlans.tsx',
  'ai_athlete_intelligence': 'AIAssistant.tsx',
  'route_comparison_stats': 'Analytics.tsx',
  'social_feed_challenges': 'SocialFeeds.tsx'
};

const srcRoot = 'd:/stitch_fit/stitch_goals_fitness_ai_coach/stitch_goals_fitness_ai_coach';
const destRoot = path.join(process.cwd(), 'src', 'pages');

for (const [folder, targetFile] of Object.entries(mapping)) {
  const htmlPath = path.join(srcRoot, folder, 'code.html');
  if (!fs.existsSync(htmlPath)) {
    console.log(`Skipping ${htmlPath}, not found.`);
    continue;
  }
  
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract body
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : content;
  
  // Remove scripts
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Strip inline handlers
  bodyContent = bodyContent.replace(/onclick="[^"]*"/gi, '');
  bodyContent = bodyContent.replace(/onchange="[^"]*"/gi, '');

  // Clean HTML to JSX
  bodyContent = bodyContent.replace(/class="/g, 'className="');
  bodyContent = bodyContent.replace(/for="/g, 'htmlFor="');
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, ''); // just remove comments to avoid issues
  
  // SVG properties
  bodyContent = bodyContent.replace(/stroke-width="/g, 'strokeWidth="');
  bodyContent = bodyContent.replace(/stroke-linecap="/g, 'strokeLinecap="');
  bodyContent = bodyContent.replace(/stroke-linejoin="/g, 'strokeLinejoin="');
  bodyContent = bodyContent.replace(/clip-rule="/g, 'clipRule="');
  bodyContent = bodyContent.replace(/fill-rule="/g, 'fillRule="');
  bodyContent = bodyContent.replace(/stop-color="/g, 'stopColor="');
  bodyContent = bodyContent.replace(/flood-opacity="/g, 'floodOpacity="');
  
  // SVG Elements
  bodyContent = bodyContent.replace(/<lineargradient/gi, '<linearGradient');
  bodyContent = bodyContent.replace(/<\/lineargradient>/gi, '</linearGradient>');

  // Self closing
  bodyContent = bodyContent.replace(/<(img|input|hr|br)([^>]*?)(?<!\/)>/gi, '<$1$2 />');

  // Inline styles
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, styles) => {
    const styleObj = styles.split(';').filter(s => s.trim()).map(s => {
      let [key, val] = s.split(':');
      if(key && val) {
        key = key.trim().replace(/-([a-z])/g, (m, c) => c.toUpperCase());
        return `${key}: '${val.trim().replace(/'/g, '"')}'`;
      }
      return '';
    }).filter(x=>x).join(', ');
    return `style={{ ${styleObj} }}`;
  });
  
  const componentName = targetFile.replace('.tsx', '');
  const tsxTemplate = `
export default function ${componentName}() {
  return (
    <>
      ${bodyContent}
    </>
  );
}
`;

  fs.writeFileSync(path.join(destRoot, targetFile), tsxTemplate, 'utf8');
  console.log(`Converted ${folder} to ${targetFile}`);
}
