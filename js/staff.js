/* 
	http://www.musictheory.net/lessons/10 
	http://stackoverflow.com/questions/15839649/pass-object-through-datatransfer
	http://jsfiddle.net/aNErc/2/
*/

/*var staff = { 
    ledger-e: { whole-note1: bulbasaur, whole-note2: ivysaur, whole-note3: venusaur }, 
    ledger-g: { whole-note1: charmander, whole-note2: charmeleon, whole-note3: charizard }, 
    ledger-b: { whole-note1: squirtle, whole-note2: wartortle, whole-note3: blastoise },
    ledger-d: { whole-note1: pidgey, whole-note2: pidgeotto, whole-note3: pidgeot },
    ledger-f: { whole-note1: oddish, whole-note2: gloom, whole-note3: vileplume } 
}*/

//console.log( staff[ 'ledger-e' ][ 'whole-note2' ] );

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

	var q;
	/*for (q = 0; q < 10; i++) {

	}*/

	var q = 0;
	var i = 0;
	(function myLoop (i) {
		setTimeout(function () {
		    var temp = data[q][i];
		    console.log(temp);
		    var snd1  = new Audio();
		    var src1  = document.createElement("source");
		    src1.type = "audio/mpeg";
		    src1.src  = "assets/cries/mp3/"+ temp +".mp3";
		    snd1.appendChild(src1);
		    snd1.play();
		    if (++i < 3) {
		        myLoop(i);
		    } 
		}, 1000)
		console.log("q = "+ q );
		console.log("i = "+ i );
		q++;
	} ) (0);

    /*var grid = document.getElementById("drop-grid"),
        descendents = grid.getElementsByTagName("div");
    (function myLoop (i) {
     setTimeout(function () {
        item = descendents[i];
        item_id = item.children[0].getAttribute("id");
        audio_id = "cry-" + item_id + "";
        console.log(audio_id);
        document.getElementById(audio_id).play();
        if (item.tagName === "mewtwo") {

        }
        if (++i < descendents.length) {
            myLoop(i);
        } 
    }, 1000)
    } ) (0);*/
}

/*var snd1  = new Audio();
var src1  = document.createElement("source");
src1.type = "audio/mpeg";
src1.src  = "assets/cries/mp3/001.mp3";
snd1.appendChild(src1);

var snd2  = new Audio();
var src2  = document.createElement("source");
src2.type = "audio/mpeg";
src2.src  = "assets/cries/mp3/151.mp3";
snd2.appendChild(src2);

snd1.play(); 
snd2.play();*/