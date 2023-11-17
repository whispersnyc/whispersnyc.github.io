// PASSCODE (Ehsan Kia)
let cursor = 0;
const PASSCODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  // prevent code entry in fullscreen video
  if (document.fullscreenElement) return;

  // advance cursor if key pressed
  cursor = (e.key === PASSCODE[cursor]) ? cursor + 1 : 0;

  // if reached end, show #systemd
  if (cursor === PASSCODE.length) confirmation();
});


let music = $('#music')[0];
let video = $('#secret-video')[0];
let systemdTime = 1000;
let videoLoaded = false;
let blinkInterval;


// PASSCODE PRESSED (modify to prevent confirm/active spam)
let confirmationTime, systemdContent, systemdContentCopy;
function addLines() { // fake initsystem text + blinking
  if (systemdContent.length === 0) systemdContent = systemdContentCopy.slice();
  let systemd = $("#systemd");
  systemd.append("<br>" + systemdContent.pop());
  if (!videoLoaded) setTimeout(addLines, Math.random() * 10);
  else {
    systemd.append("<br>Press enter to complete (y/n) > y");
    if (blinkInterval) clearInterval(blinkInterval);
    blinkInterval = setInterval(function() {
      if (systemd.html().endsWith("█")) {
        systemd.html(systemd.html().slice(0, -1));
      } else {
        systemd.append("█");
      }
    }, 500); // Blink every 500 milliseconds
  }
  systemd.scrollTop(systemd.prop("scrollHeight"));
}
function confirmation() { // press enter prompt
  // quit if exit fullscreen
  $(document).on('fullscreenchange', function() {
    if (!document.fullscreenElement) {
      music.pause();
      location.reload();
    }
  });

  optimize();
  openFullscreen();
  fetch('media/random.txt').then(r => r.text()).then(data => {
    systemdContent = data.split("\n").reverse();
    let systemdContentCopy = systemdContent.slice();
    confirmationTime = Date.now();
    music.load();
    video.load();
    cursor = 0;
    document.getElementById("secret-src").src = "media/city.mp4"
    document.getElementById("secret-container").style.visibility = "visible";
    document.getElementById("confirm-container").style.visibility = "visible";
    let checkInterval = setInterval(function() {
      if (video.readyState === 4 && // if video ready and N time elapsed
          Date.now() - confirmationTime > systemdTime) {
        clearInterval(checkInterval);
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
              document.getElementById("access").style.display = "block";
              setTimeout(activate, 2000);
              if (systemd.innerHTML.endsWith("█"))
                systemd.innerHTML = systemd.innerHTML.slice(0, -1);
              systemd.innerHTML += "<br><wbr>"
              systemd.scrollTop = systemd.scrollHeight;
              music.volume = 0.3;
              music.play();
            }
        })
        videoLoaded = true;
      }
    }, 100);
    addLines(0);
  });
}

function activate() { // enter pressed
  $('body').css('overflow', 'hidden');
  updateTime();
  setInterval(updateTime, 1000);
  systemd.innerHTML = "";
  document.getElementById("access").style.display = "none";
  document.getElementById("secret-container").style.display = "block";
  clearInterval(blinkInterval);

  let _confirm = document.getElementById('confirm-container');
  _confirm.style.transition = 'opacity 3s ease-out';
  _confirm.style.opacity = '0';
  _confirm.style.pointerEvents = "none";
}

// DESKTOP
function updateTime() {
  var date = new Date();
  
  var hours = date.getHours();
  var minutes = date.getMinutes();
  hours = hours < 10 ? '0'+hours : hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var day = days[date.getDay()];
  
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var month = months[date.getMonth()];
  
  var dateNumber = date.getDate();
  var ordinal = (dateNumber > 3 && dateNumber < 21) || dateNumber % 10 > 3 ? 'th' : ['st', 'nd', 'rd'][dateNumber % 10 - 1];
  
  var year = date.getFullYear();
  var formattedDate = hours + ":" + minutes + " | " + day + ", " + month + " " + dateNumber + ordinal + " " + year;
  document.getElementById("time").textContent = formattedDate;
}


$(document).ready(function() {
  //confirmation(); activate();
  $('#start').click(newWindow);
})

function newWindow() {
  // make visible clone
  var windowElement = $('.window');
  var clone = windowElement.clone();
  clone.css('display', 'block');
  $('#secret-container').append(clone);

  var titleBar = clone.find('.title-bar');
  var isDragging = false;
  var isResizing = false;
  var dragOffsetX, dragOffsetY;
  var resizeOffsetX, resizeOffsetY;
  var initialWidth, initialHeight;
  var bufferZone = 10; // The size of the buffer zone in pixels

  titleBar.on('mousedown', function(e) {
    isDragging = true;
    dragOffsetX = e.clientX - clone.offset().left;
    dragOffsetY = e.clientY - clone.offset().top;
  });

  var isResizingHorizontally = false;
  var isResizingVertically = false;

  $(window).on('mousedown', function(e) {
    var cloneOffset = clone.offset();
    var cloneWidth = clone.outerWidth();
    var cloneHeight = clone.outerHeight();

    // Check if the mouse is within the buffer zone of the window's right edge
    if (e.clientX >= cloneOffset.left + cloneWidth - bufferZone && e.clientX <= cloneOffset.left + cloneWidth + bufferZone) {
      isResizing = true;
      isResizingHorizontally = true;
      resizeOffsetX = e.clientX;
      initialWidth = cloneWidth;
    }

    // Check if the mouse is within the buffer zone of the window's bottom edge
    if (e.clientY >= cloneOffset.top + cloneHeight - bufferZone && e.clientY <= cloneOffset.top + cloneHeight + bufferZone) {
      isResizing = true;
      isResizingVertically = true;
      resizeOffsetY = e.clientY;
      initialHeight = cloneHeight;
    }
  });

  $(window).on('mousemove', function(e) {
    if (isDragging) {
      clone.css('left', e.clientX - dragOffsetX + 'px');
      clone.css('top', e.clientY - dragOffsetY + 'px');
    }

    if (isResizing) {
      if (isResizingHorizontally) {
        var dx = e.clientX - resizeOffsetX;
        var newWidth = initialWidth + dx;
        clone.css('width', newWidth + 'px');
      }

      if (isResizingVertically) {
        var dy = e.clientY - resizeOffsetY;
        var newHeight = initialHeight + dy;
        clone.css('height', newHeight + 'px');
      }
    }
  });

  $(window).on('mouseup', function() {
    isDragging = false;
    isResizing = false;
    isResizingHorizontally = false;
    isResizingVertically = false;
  });
}