/**
 * Generate musical staff
 */
function generateStaff() {
	var table = document.querySelector("table");
	var data  = parseTable(table);
	console.log(data);
}

/**
 * Play song
 */
function playSong() {
	var table = document.querySelector("table");
	var data  = parseTable(table);
	console.log(data);

	var q = 0;
	var i = 0;
	(function myLoop (i) {
		for (q = 0; q < 5; q++) {
			var temp = data[i][q];
			console.log(temp);
			var snd1  = new Audio();
			var src1  = document.createElement("source");
			src1.type = "audio/mpeg";
			src1.src  = "assets/cries/mp3/"+ temp +".mp3";
			snd1.appendChild(src1);
			snd1.play();
			console.log("i = "+ i );
			console.log("q = "+ q );
		}

		setTimeout(function () {
		    if (++i < 5) {
		        myLoop(i);
		    } 
		}, 1000)
	} ) (0);
}