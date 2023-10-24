// CARD GENERATION
let card = " \
<div class=\"card\">\n\
  <div class=\"card-inner\">\n\
    <div class=\"card-front optimize glow\" id=\"%ID%\"><img src=\"media/%IMG%\"></div>\n\
    <div class=\"card-back\">\n\
      <div class=\"card-grid\">\n\
        <div class=\"video\"><i class=\"fa-solid fa-play\"></i></div>\n\
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

    // insert html
    columns[clmn].insertAdjacentHTML("beforeend",
      card.replace("%IMG%", img).replace("%ID%", id
      ).replace("%TXT%", txt).replace("%FOCUS%",
      focus.replaceAll(' ', '&nbsp')).replace("%ALPHA%",
      alpha.replaceAll(' ', '&nbsp')).replace("%BETA%",
      beta.replaceAll(' ', '&nbsp')));
    
    // add gradient style
    $('head').append($('<style>').prop('type', 'text/css'
      ).html('#'+id+"::before {background: "+bg+'}'));
    
    // add link
    const btn = $("#"+id).parent().find('.card-back .card-grid .link');
    btn.click(function() {window.open(link, '_blank')});
  }
});