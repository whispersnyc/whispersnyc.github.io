// video system
var message; let message_shown = false;

// revert properties
function exitHandler(video, originalOpacity, originalBg, icon, message) {
  // reset opacity/bg, set to "fill", show icon and hide msg
  $(video).css('opacity', originalOpacity);
  $(video).css('object-fit', 'cover');
  video.parentElement.style.backgroundColor = originalBg;
  $(icon).show();
  message.hide();

  // prevent redundant execution
  $(document).off('fullscreenchange');
  $(video).off('click');
}
// executed when fullscreen closed (video end/escape key/f11)
function exit_force(video, originalOpacity, originalBg, icon, message) {
  if (!document.fullscreenElement) {
    video.pause();
    exitHandler(video, originalOpacity, originalBg, icon, message);
  }
}
// executed when clicked
function exit_pause(video, originalOpacity, originalBg, icon, message) {
  if (document.fullscreenElement) {
    closeFullscreen();
    exitHandler(video, originalOpacity, originalBg, icon, message);
  }
}

function play(div) {
  // show instructions first time
  if (!message_shown) {
    message = $('<div>').addClass('message').text('Click anywhere to exit.');
    $(div).append(message);
    setTimeout(() => {
      message.css('opacity', '0');
    }, 2000);
    message_shown = true;
  }

  // save original properties
  const video = $(div).find('.card-video')[0];
  const originalOpacity = $(video).css('opacity');
  const originalBg = video.parentElement.style.backgroundColor;
  const icon = $(div).find('.fa-solid')[0];

  // enter fullscreen, full opacity, play video and "fit" mode
  $(icon).hide();
  video.parentElement.requestFullscreen();
  $(video).css('opacity', 1);
  video.play();
  $(video).css('object-fit', 'contain');
  video.parentElement.style.backgroundColor = 'black';
  video.volume = 0.4;

  // exit fullscreen if video done (triggers exit_force)
  video.addEventListener('ended', () => {closeFullscreen()});

  // if exited fullscreen, pause and revert fullscreen
  $(document).on('fullscreenchange', () =>
    exit_force(video, originalOpacity, originalBg, icon, message));

  // if paused, exit fullscreen pause and revert properties
  $(video).on('click', () =>
    exit_pause(video, originalOpacity, originalBg, icon, message));
}