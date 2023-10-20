// CARD GENERATION
function addStyle(rule) {
  let css = document.createElement('style');
  css.type = 'text/css';
  if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
  else css.appendChild(document.createTextNode(rule)); // Support for the rest
  document.getElementsByTagName("head")[0].appendChild(css);
}

var inserted = 0;
var columns = document.getElementById("columns").children;
fetch('index.md').then(r => r.text()).then(index => {
  fetch('card.html').then(r => r.text()).then(card => {
    index = index.trim().split("\r\n\r\n\r\n");
    for (var line in index) { // source's cards loop
      const cardInfo = index[line].split("\r\n");
      const [id, img, vid] = cardInfo[1].split(" | ");
      const link = cardInfo[2]; const bg = cardInfo[3];
      const [focus, alpha, beta] = cardInfo.pop().split(" | ");
      const txt = cardInfo.slice(5).join("<br>");
      const clmn = ++inserted % 2 ? 1 : 2;
      columns[clmn].insertAdjacentHTML("beforeend",
        card.replace("%IMG%", img).replace("%ID%", id
        ).replace("%TXT%", txt).replace("%FOCUS%", focus
        ).replace("%ALPHA%", alpha.replaceAll(' ', '&nbsp')
        ).replace("%BETA%", beta.replaceAll(' ', '&nbsp')));
      addStyle('#'+id+"::before {background: "+bg+'}');
      ((link) => {
        const btn = document.getElementById(id).parentElement.querySelector('.card-back .card-grid .link');
        btn.addEventListener('click', () => {
          window.open(link, '_blank');
        });
      })(link);
    }
  });
});


// KONAMI CODE (Ehsan Kia)
let cursor = 0;
const PASSCODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', (e) => {
  cursor = (e.key === PASSCODE[cursor]) ? cursor + 1 : 0;
  if (cursor === PASSCODE.length) activate();
});

// BACKGROUND SETTINGS
let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
let disableAnimations = true;
let disableBlur = true;
let disableGrain = true;

var grainOptions = {
  "animate": true,
  "patternWidth": 100,
  "patternHeight": 100,
  "grainOpacity": 0.05,
  "grainDensity": 1,
  "grainWidth": 1,
  "grainHeight": 1
};

// GRADIENT
const move_speed = 0.1; const flicker_speed = 0.01;
const flicker_start = 0.2; const flicker_end = 0.5;
let targetX = 0; let targetY = 0;
let currentX = 0; let currentY = 0;
let currentOpacity1 = 0.3; let currentOpacity2 = 0.3;
let targetOpacity1 = 0.3; let targetOpacity2 = 0.3;

const lerp = (start, end, factor) => start + (end - start) * factor;
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

updated = false;
const updateGradient = () => {
  if (isMobile) { // update once if mobile, always on pc
    if (disableAnimations && !updated) updated = true
    else return
  }

  const element = document.documentElement;
  currentX = lerp(currentX, targetX, move_speed);
  currentY = lerp(currentY, targetY, move_speed);

  currentOpacity1 = lerp(currentOpacity1, targetOpacity1, flicker_speed);
  currentOpacity2 = lerp(currentOpacity2, targetOpacity2, flicker_speed);
  if (Math.abs(currentOpacity1 - targetOpacity1) < 0.01)
    targetOpacity1 = randomBetween(flicker_start, flicker_end);
  if (Math.abs(currentOpacity2 - targetOpacity2) < 0.01)
    targetOpacity2 = randomBetween(flicker_start, flicker_end);

  element.style.setProperty('--gradient-x', `${currentX}%`);
  element.style.setProperty('--gradient-y', `${currentY}%`);
  element.style.setProperty('--gradient-opacity1', `${currentOpacity1}`);
  element.style.setProperty('--gradient-opacity2', `${currentOpacity2}`);
  requestAnimationFrame(updateGradient);
}

document.addEventListener('mousemove', (e) => {
  const influence = 5;
  targetX = ((e.clientX / window.innerWidth) * 2.0 - 1.0) * influence;
  targetY = ((e.clientY / window.innerHeight) * 2.0 - 1.0) * influence;
});

updateGradient()


// OPTIMIZATION
if (!isMobile || !disableGrain) grained("#grain", grainOptions);
if (isMobile) {
  let optimizeElements = document.querySelectorAll('.optimize');
  optimizeElements.forEach(element => {
    if (disableAnimations) element.classList.add('disable-animations');
    if (disableBlur) element.classList.add('disable-blur');
    element.classList.remove('glow'); // Remove the 'glow' class
  });
}

