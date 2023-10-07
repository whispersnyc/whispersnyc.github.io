var options = {
  "animate": true,
  "patternWidth": 100,
  "patternHeight": 100,
  "grainOpacity": 0.05,
  "grainDensity": 1,
  "grainWidth": 1,
  "grainHeight": 1
};
grained("#grain-container", options);


let cursor = 0; // credit Ehsan Kia
const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
  cursor = (e.keyCode == KONAMI_CODE[cursor]) ? cursor + 1 : 0;
  if (cursor == KONAMI_CODE.length) activate();
});

document.addEventListener('mousemove', (e) => {
  const x = Math.round((e.clientX / window.innerWidth) * 100);
  const y = Math.round((e.clientY / window.innerHeight) * 100);

  document.documentElement.style.setProperty('--cursor-x', `${x}%`);
  document.documentElement.style.setProperty('--cursor-y', `${y}%`);
});
