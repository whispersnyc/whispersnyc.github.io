$player = $("#player");
$player.prop("volume", "0.1");

function toggle_music() {
	$note = $("#note");
	vol = $player.prop("volume");

	//if (vol == 1) $player.animate({volume: 0}, 2000, "linear");
	//else if (vol == 0) $player.animate({volume: 1}, 2000, "linear");
	$note.animate({opacity: vol==1 ? 0.2 : 0.7}, 500, "linear");
	$player.animate({volume: vol==1 ? 0 : 0.1}, 2000, "linear");
}
