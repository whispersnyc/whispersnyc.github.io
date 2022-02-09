var interval;
var off = true;

$player = new Audio("music.mp3");
$player.volume = 0.1;
$note = $("#note");
$note.prop("opacity", "0.2");

function toggle_music() {
	$player.play();

	vol = $player.volume;
	off = !off;
	$note.animate({opacity: off ? 0.2 : 0.7}, 500, "linear");
	//$player.animate({volume: vol==0.1 ? 0 : 0.1}, 2000, "linear");
	interval = setInterval(function () {fade(off ? 0 : 0.1)}, 200);
}

function fade(target) {
	if (Math.abs(target - vol) < 0.01) {
		vol = target;
		clearInterval(interval);
	}
	else {
		vol += Math.sign(target - vol) * 0.005;
	}
	$player.volume = vol;
}
