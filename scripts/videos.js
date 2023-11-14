// video system
var message; var message_shown = false;
const message_time = 1000;
const volume = 0.4;
var originalBg; var originalOpacity;

// revert properties
function exitHandler(video, originalOpacity, originalBg, icon, message) {
  // reset opacity/bg, set to "fill", show icon and hide msg
  $(video).css('opacity', originalOpacity);
  $(video).css('object-fit', 'cover');
  $(video).parent().css('background-color', originalBg);
  $(icon).show();
  $(message).hide();

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
  // save original properties
  const video = $(div).find('.card-video')[0];
  const icon = $(div).find('.fa-solid')[0];

  // enter fullscreen, full opacity, play video and "fit" mode
  video.parentElement.requestFullscreen();
  $(icon).hide();
  $(video).css('opacity', '1');
  video.play();
  $(video).css('object-fit', 'contain');
  //video.parentElement.style.backgroundColor = 'black';
  $(video).parent().css('background-color', 'black');
  video.volume = volume;
  
  // show instructions first time
  if (!message_shown) {
    message_shown = true;
    message = $('<div>').addClass('message').text(
      'Click anywhere to exit.');
    $(div).append(message);
    setTimeout(() => {
      message.css('opacity', '0');
    }, message_time);
  }

  // exit fullscreen if video done (triggers exit_force)
  $(video).on('ended', () => closeFullscreen() );

  // if paused, exit fullscreen pause and revert properties
  $(video).on('click', () =>
    exit_pause(video, originalOpacity, originalBg, icon, message));

  // if exited fullscreen, pause and revert fullscreen
  $(document).on('fullscreenchange', () =>
    exit_force(video, originalOpacity, originalBg, icon, message));
}