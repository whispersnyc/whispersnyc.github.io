// Define your boolean variables
let disableAnimations = true;
let disableBlur = true;
let disableGrain = true;
let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

var grainOptions = {
  "animate": true,
  "patternWidth": 100,
  "patternHeight": 100,
  "grainOpacity": 0.05,
  "grainDensity": 1,
  "grainWidth": 1,
  "grainHeight": 1
};


let cursor = 0; // credit Ehsan Kia
const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
  cursor = (e.keyCode == KONAMI_CODE[cursor]) ? cursor + 1 : 0;
  if (cursor == KONAMI_CODE.length) activate();
});

// Define the gradient end coordinates
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

document.querySelectorAll('div[data-url]').forEach(div => {
  div.addEventListener('click', () => {
    window.open(div.getAttribute('data-url'), '_blank');
  });
});


if (!isMobile || !disableGrain) grained("#grain", grainOptions);
if (isMobile) {
  let optimizeElements = document.querySelectorAll('.optimize');
  optimizeElements.forEach(element => {
    if (disableAnimations) element.classList.add('disable-animations');
    if (disableBlur) element.classList.add('disable-blur');
    element.classList.remove('glow'); // Remove the 'glow' class
  });
}