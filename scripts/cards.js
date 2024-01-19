// CARD GENERATION
let card = " \
<div class=\"card\" onmouseover=\"loadVideo(this, '%VID%')\">\n\
  <div class=\"card-inner\">\n\
    <div class=\"card-front optimize glow\" id=\"%ID%\">\n\
      <img src=\"media/%IMG%\">\n\
      <i class=\"%ICON_CLASS%\"></i>\n\
    </div>\n\
    <div class=\"card-back\">\n\
      <div class=\"card-grid\">\n\
        <div class=\"video\" onclick=\"play(this)\">\n\
          <video src=\"%SRC%\" muted class=\"card-video\" onclick=\"full()\">\n\
          </video>\n\
          <i class=\"fa-solid fa-play\"></i>\n\
        </div>\n\
        <div class=\"text\">\n\
          %TXT%<br><br>\n\
          <em>Focus:</em> %FOCUS%<br>\n\
          <em>Alpha:</em> %ALPHA%<br>\n\
          <em>Beta:</em> %BETA%\n\
        </div>\n\
        <div class=\"link\" onclick=\"openLink('%LINK%')\">\n\
          <i class=\"%LINK_ICON%\"></i>\n\
        </div>\n\
      </div>\n\
    </div>\n\
  </div>\n\
</div>";

function loadVideo(element, videoFile) {
  const video = $(element).find('.card-video');
  if (!video.attr('src')) {
    video.attr('src', 'media/'+videoFile);
    video[0].load();
  }
}

const columns = $("#columns").children();
const lazy_load = false;
function processData(cards) {
  // split into cards
  var cards = cards.trim().split("\n\n\n");
  var clmnHTML = [[], [], []];
  var clmn;

  // card loop
  for (var c in cards) {
    // skip invalid blocks like top
    if (cards[c][0] != '*') continue

    // parse data
    const cardInfo = cards[c].split("\n");
    const [id, img, vid, icon] = cardInfo[1].split(" | ");
    const link = cardInfo[2]; const bg = cardInfo[3];
    const [focus, alpha, beta] = cardInfo.pop().split(" | ");
    const txt = cardInfo.slice(5).join("<br>");
    const link_icon = link == "N/A" ? "fa-regular fa-clock" :
      "fa-solid fa-arrow-right-from-bracket"
    const src = !lazy_load ? "media/"+vid : ""
    clmn = c % 3;

    // create html (highly compatible version)
    clmnHTML[clmn].push(
      card.replace("%IMG%", img).replace("%ID%", id
      ).replace("%TXT%", txt).replace("%FOCUS%",
      focus.replaceAll(' ', '&nbsp')).replace("%ALPHA%",
      alpha.replaceAll(' ', '&nbsp')).replace("%BETA%",
      beta.replaceAll(' ', '&nbsp')).replace("%VID%", vid
      ).replace("%ICON_CLASS%", icon).replace("%LINK%", link
      ).replace("%LINK_ICON%", link_icon).replace("%SRC%", src)
    );

    // add gradient style
    $('head').append($('<style>').prop('type', 'text/css'
      ).html('#'+id+"::before {background: "+bg+'}'));
  }

  // push to DOM all at once
  for (let i = 0; i < clmnHTML.length; i++) {
    $(`#col${i}`).html(clmnHTML[i].join(''));
  }
  clmnHTML = null; card = null;
  
  // save original values
  const $video = $('video').first()
  originalOpacity = $video.css('opacity');
  originalBg = $video.parent().css('background-color');

  // optimize for mobile after cards are loaded
  if (isMobile) optimize();
};


$.ajax({
  url: 'cards.txt',
  type: 'HEAD',
  error: function() {
    // debug cards.txt not found, use gist
    $.get('https://gist.github.com/rakinishraq/5ce3b34e8e99d9c4b9e269229b6e5f34/raw/', processData);
  },
  success: function() {
    // use local cards.txt
    $.get('cards.txt', processData);
  }
});


function openLink(url) {
  if (url == 'N/A') return;
  window.open(url, '_blank');
}