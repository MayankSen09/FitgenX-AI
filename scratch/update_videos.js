const fs = require('fs');

const file = 'e:/genx_one/src/data/exercises.ts';
let content = fs.readFileSync(file, 'utf-8');

const videoMap = {
  'barbell-row': 'https://www.youtube.com/embed/G8l_8chR5BE',
  'lat-pulldown': 'https://www.youtube.com/embed/CAwf7n6Luuc',
  'seated-cable-row': 'https://www.youtube.com/embed/GZbfZ033f74',
  'pull-ups': 'https://www.youtube.com/embed/eGo4IYcbEPI',
  'dumbbell-row': 'https://www.youtube.com/embed/pYcpY20QaE8',
  'barbell-squat': 'https://www.youtube.com/embed/gcNh17Ckjgg',
  'romanian-deadlift': 'https://www.youtube.com/embed/JCXUYuzwNrM',
  'leg-press': 'https://www.youtube.com/embed/IZxyjW7OSvc',
  'walking-lunges': 'https://www.youtube.com/embed/L8fvypPrzzs',
  'leg-curl': 'https://www.youtube.com/embed/1Tq3QdYUuHs',
  'calf-raises': 'https://www.youtube.com/embed/gwLzBJYoWlI',
  'barbell-curl': 'https://www.youtube.com/embed/kwG2ipFRgfo',
  'hammer-curls': 'https://www.youtube.com/embed/zC3nLlEvin4',
  'tricep-dips': 'https://www.youtube.com/embed/2z8JmcrW-As',
  'overhead-tricep-extension': 'https://www.youtube.com/embed/nRiJVZDpdL0',
  'rope-pushdown': 'https://www.youtube.com/embed/2-LAMcpzODU',
  'plank': 'https://www.youtube.com/embed/ASdvN_XEl_c',
  'hanging-leg-raise': 'https://www.youtube.com/embed/Pr1ieGZ5atk',
  'russian-twists': 'https://www.youtube.com/embed/wkD8rjkodUI',
  'bicycle-crunches': 'https://www.youtube.com/embed/9FGilxCbdz8',
  'dead-bugs': 'https://www.youtube.com/embed/4XLEnwUr1d8',
  'burpees': 'https://www.youtube.com/embed/dZgVxmf6jkA',
  'mountain-climbers': 'https://www.youtube.com/embed/nmwgirgXLYM',
  'jump-squats': 'https://www.youtube.com/embed/QQmXQ7O0E2s',
  'kettlebell-swings': 'https://www.youtube.com/embed/YSxHifyI6s8',
  'box-jumps': 'https://www.youtube.com/embed/52r_Ul5k03g',
  'dumbbell-flys': 'https://www.youtube.com/embed/eozdVDA78K0',
  'cable-crossover': 'https://www.youtube.com/embed/taI4XduLpTk',
  'push-ups': 'https://www.youtube.com/embed/IODxDxX7oi4',
  'face-pulls': 'https://www.youtube.com/embed/rep-qVOkqgk',
  'arnold-press': 'https://www.youtube.com/embed/6Z15_WdXmVw'
};

for (const [id, url] of Object.entries(videoMap)) {
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?icon:\\s*'[\\w_]+')(,)`, 'g');
  content = content.replace(regex, (match, p1, p2) => {
    if (match.includes('videoUrl')) return match; // already added
    return `${p1},\n    videoUrl: '${url}?autoplay=0&loop=1'`;
  });
}

fs.writeFileSync(file, content, 'utf-8');
console.log('Updated videos');
