let music = document.getElementById('music')
let video = document.getElementById('secret-video');
let systemdTime = 1000;
let videoLoaded = false;

// FULLSCREEN
var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}
document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        music.pause();
        location.reload();
    }
});

let blinkInterval;

function addLines() {
  if (systemdContent.length === 0) systemdContent = systemdContentCopy.slice();
  let systemd = document.getElementById("systemd");
  systemd.innerHTML += "<br>" + systemdContent.pop();
  if (!videoLoaded) setTimeout(addLines, Math.random() * 10);
  else {
    systemd.innerHTML += "<br>Press enter to complete (y/n) > y";
    if (blinkInterval) clearInterval(blinkInterval);
    blinkInterval = setInterval(function() {
      if (systemd.innerHTML.endsWith("█")) {
        systemd.innerHTML = systemd.innerHTML.slice(0, -1);
      } else {
        systemd.innerHTML += "█";
      }
    }, 500); // Blink every 500 milliseconds
  }
  systemd.scrollTop = systemd.scrollHeight;
}
// PASSCODE PRESSED (modify to prevent confirm/active spam)
let confirmationTime, systemdContent, systemdContentCopy;
function confirmation() { // press enter prompt
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
    updateTime();
    systemd.innerHTML = "";
    document.getElementById("access").style.display = "none";
    document.getElementById("secret-container").style.display = "block";

    let _confirm = document.getElementById('confirm-container');
    _confirm.style.transition = 'opacity 3s ease-out';
    _confirm.style.opacity = '0';
    _confirm.style.pointerEvents = "none";
}

// DESKTOP
function updateTime() {
    let date = new Date();
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let day = days[date.getDay()];
    
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let month = months[date.getMonth()];
    
    let dateNumber = date.getDate();
    let ordinal = (dateNumber > 3 && dateNumber < 21) || dateNumber % 10 > 3 ? 'th' : ['st', 'nd', 'rd'][dateNumber % 10 - 1];
    
    let year = date.getFullYear();
    let formattedDate = `${hours}:${minutes} | ${day}, ${month} ${dateNumber}${ordinal} ${year}`;
    setInterval(updateTime, 1000); // update the time every second
    document.getElementById("time").textContent = formattedDate;
}

