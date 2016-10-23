$( function() {
	
	//create a synth and connect it to the master output (your speakers)
	//var synth = new Tone.Synth().toMaster();

	$('.key').click(function(){
		//play a middle 'C' for the duration of an 8th note
		//synth.triggerAttackRelease("C4", "8n");
	});
	
	cryLoader();
	playSong();
	
} );

function cryLoader() {
	var i;
	for (i=1; i <= 5; i++) {
		var file_num = '00' + i;
		file_num = file_num.substr(file_num.length - 3, 3);
		audio_id = 'cry-' + file_num + '';
		document.getElementById('cry-wrap').innerHTML += '<audio id='+ audio_id +'><source src="assets/cries/mp3/'+ file_num +'.mp3" type="audio/mpeg"></audio>';
		document.getElementById('cry-wrap').innerHTML += "<button onclick='document.getElementById(\""+audio_id+"\").play();'><img src=assets/sprites/"+ i +".png></button>";
	}
}

function playSong() {
	$(".play").click(function(){
		(function myLoop (i) {
			setTimeout(function () {
				console.log(i);
				var file_num = '00' + i;
				file_num = file_num.substr(file_num.length - 3, 3);
				audio_id = 'cry-' + file_num + '';
				document.getElementById(audio_id).play();
				if (++i <= 5) {
					myLoop(i);
				} 
			}, 1000)
		} ) (1);
	});
}

