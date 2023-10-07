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

document.addEventListener('mousemove', (e) => { // Math.round
  const influence = 5; // 50 = 1:1
  const x = ((e.clientX / window.innerWidth) * 2.0 - 1.0) * influence;
  const y = ((e.clientY / window.innerHeight) * 2.0 - 1.0) * influence;

  document.documentElement.style.setProperty('--gradient-x', `${x}%`);
  document.documentElement.style.setProperty('--gradient-y', `${y}%`);
  //console.log(x, y)
});
