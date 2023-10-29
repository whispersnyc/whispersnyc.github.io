// CARD GENERATION
let card = " \
<div class=\"card\">\n\
  <div class=\"card-inner\">\n\
    <div class=\"card-front optimize glow\" id=\"%ID%\"><img src=\"media/%IMG%\"></div>\n\
    <div class=\"card-back\">\n\
      <div class=\"card-grid\">\n\
        <div class=\"video\" onclick=\"play(this)\">\n\
          <video class=\"card-video\">\n\
            <source src=\"media/%VID%\" type=\"video/mp4\" onclick=\"full()\">\n\
          </video>\n\
          <i class=\"fa-solid fa-play\"></i>\n\
        </div>\n\
        <div class=\"text\">\n\
          %TXT%<br><br>\n\
          <em>Focus:</em> %FOCUS%<br>\n\
          <em>Alpha:</em> %ALPHA%<br>\n\
          <em>Beta:</em> %BETA%\n\
        </div>\n\
        <div class=\"link\" data-url=\"%LINK%\">\n\
          <i class=\"fa-solid fa-arrow-right-from-bracket\"></i></div>\n\
      </div>\n\
    </div>\n\
  </div>\n\
</div>";


var inserted = 0;
const columns = $("#columns").children();
$.get("cards.md", function(cards) {
  // split into cards
  cards = cards.trim().split("\n\n\n");

  // card loop
  for (var c in cards) {
    // parse data
    const cardInfo = cards[c].split("\n");
    const [id, img, vid] = cardInfo[1].split(" | ");
    const link = cardInfo[2]; const bg = cardInfo[3];
    const [focus, alpha, beta] = cardInfo.pop().split(" | ");
    const txt = cardInfo.slice(5).join("<br>");
    const clmn = ++inserted % 2 ? 1 : 2;

    // insert html (highly compatible version)
    columns[clmn].insertAdjacentHTML("beforeend",
      card.replace("%IMG%", img).replace("%ID%", id
      ).replace("%TXT%", txt).replace("%FOCUS%",
      focus.replaceAll(' ', '&nbsp')).replace("%ALPHA%",
      alpha.replaceAll(' ', '&nbsp')).replace("%BETA%",
      beta.replaceAll(' ', '&nbsp')).replace("%VID%", vid));

    // add gradient style
    $('head').append($('<style>').prop('type', 'text/css'
      ).html('#'+id+"::before {background: "+bg+'}'));
    
    // add link
    const btn = $("#"+id).parent().find('.link');
    if (link != "N/A") {
      btn.click(function() {window.open(link, '_blank')});
    } else {
      btn.find('i').attr("class", "fa-regular fa-clock");
      btn.addClass("nopointer");
    }
  }
  
  // insert last card
  columns[++inserted % 2 ? 1 : 2].insertAdjacentHTML(
  "beforeend", " \
  <div class=\"card\" id=\"this\"> \
    <div class=\"card-inner\"> \
      <div class=\"card-front\"> \
        <img src=\"media/this2.png\"> \
      </div> \
      <div class=\"card-back\"> \
          <div class=\"text\">\
            But there's more than meets the eye...\
          </div>\
          <div class=\"link\">\
            <i class=\"fa-regular fa-eye\"></i> \
          </div>\
      </div> \
    </div> \
  </div>"
  )

  // last card link
  $('#this').find('.link').click(() => {
    window.open('https://github.com/rakinishraq/rakinishraq.github.io',
    '_blank');
  });

  // last card hover darken effect
  $('#this').hover( 
    function() {$('body').css('background-color', 'black')},
    function() {$('body').css('background-color', '')}
  );
  
  // optimize for mobile after cards are loaded
  if (isMobile) optimize();
});