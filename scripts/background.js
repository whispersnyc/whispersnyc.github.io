let freeze_gradient = false;
const lerp = (start, end, factor) => start + (end - start) * factor;
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

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

const move_speed = 0.1; const flicker_speed = 0.01;
const flicker_start = 0.2; const flicker_end = 0.5;
let targetX = 0; let targetY = 0;
let currentX = 0; let currentY = 0;
let currentOpacity1 = 0.3; let currentOpacity2 = 0.3;
let targetOpacity1 = 0.3; let targetOpacity2 = 0.3;


// GRADIENT
const updateGradient = () => {
  const element = $('html')[0];
  currentX = lerp(currentX, targetX, move_speed);
  currentY = lerp(currentY, targetY, move_speed);

  currentOpacity1 = lerp(currentOpacity1, targetOpacity1, flicker_speed);
  currentOpacity2 = lerp(currentOpacity2, targetOpacity2, flicker_speed);
  if (Math.abs(currentOpacity1 - targetOpacity1) < 0.01)
      targetOpacity1 = randomBetween(flicker_start, flicker_end);
  if (Math.abs(currentOpacity2 - targetOpacity2) < 0.01)
      targetOpacity2 = randomBetween(flicker_start, flicker_end);

  $(element).css('--gradient-x', currentX + '%');
  $(element).css('--gradient-y', currentY + '%');
  $(element).css('--gradient-opacity1', currentOpacity1);
  $(element).css('--gradient-opacity2', currentOpacity2);
  if (!freeze_gradient) requestAnimationFrame(updateGradient);
}

$(document).on('mousemove', (e) => {
  const influence = 5;
  targetX = ((e.clientX / window.innerWidth) * 2.0 - 1.0) * influence;
  targetY = ((e.clientY / window.innerHeight) * 2.0 - 1.0) * influence;
});


function optimize() {
  freeze_gradient = true;
  grained("#grain", {"animate": false, "grainOpacity": 0});
  $('.optimize').each(function() {
      if (disableAnimations) $(this).addClass('disable-animations');
      if (disableBlur) $(this).addClass('disable-blur');
      $(this).removeClass('glow');
  });
}

if (!isMobile || !disableGrain) grained("#grain", grainOptions);
updateGradient();

// OPTIMIZE OPTION
if (!isMobile) {
  $('#para').append('<br><br><span id="extra-text"><p>This page has lots of subtle effects so if your device is lagging, <a href="#" id="optimize-link">click me to disable them</a>.</p></span>');
}

$('#optimize-link').click(function(e) {
  e.preventDefault();
  optimize();
  $('#extra-text').html('<p>If you want to re-enable them, \
  <a href="#" id="refresh-link">click me or refresh</a>.</p>');
});

$(document).on('click', '#refresh-link', function(e) {
  e.preventDefault();
  location.reload();
});