/*
*** AUDIO JS ***
*/
var domready = require("domready")
var pool = require("typedarray-pool")
var pitchShift = require("pitch-shift")

function createProcessingNode(context) {
    var queue = []
    var frame_size = 1024
    var hop_size = 256
  
    var shifter = pitchShift(function(data) {
        var buf = pool.mallocFloat32(data.length)
        buf.set(data)
        queue.push(buf)
    }, function(t, pitch) {
        console.log(t, pitch)
        return 0.1 * (Math.round(t) % 15) + 0.5
    }, {
        frameSize: frame_size,
        hopSize: hop_size
    })

    //Enque some garbage to buffer stuff
    shifter(new Float32Array(frame_size))
    shifter(new Float32Array(frame_size))
    shifter(new Float32Array(frame_size))
    shifter(new Float32Array(frame_size))
    shifter(new Float32Array(frame_size))
  
    //Create a script node
    var scriptNode = context.createScriptProcessor(frame_size, 1, 1)
    scriptNode.onaudioprocess = function(e) {
        shifter(e.inputBuffer.getChannelData(0))
        var out = e.outputBuffer.getChannelData(0)
        var q = queue[0]
        queue.shift()
        out.set(q)
        pool.freeFloat32(q)
    }
  
    return scriptNode
}

var context
if (typeof AudioContext !== "undefined") {
    context = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
    context = new webkitAudioContext();
} else {
    domready(function() {
        document.querySelector(".noWebAudio").style.display = "block"
    })
    throw new Error("No WebAudio!")
}

var ondatasource = function(url, buf) {}

var dataSources = {
    "oscillator": function() { return context.createOscillator() }
}

function createFileSource(buf) {
    var ret = context.createBufferSource()
    ret.buffer = buf
    return ret
}


function loadFile(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            dataSources[url] = createFileSource.bind(undefined, buffer)
            ondatasource(url)
        }, function(err) {
            console.log("Error loading file", url, ":", err)
        })
    }
    request.send()
}

function loadFiles(list) {
    for(var i=0; i<list.length; ++i) {
        loadFile(list[i])
    }
}

loadFiles([
    "/assets/cries/mp3/001.mp3", 
    "/assets/cries/mp3/002.mp3", 
    "/assets/cries/mp3/150.mp3"
])

var prettyNames = {
    "oscillator": "Sine Wave",
    "/assets/cries/mp3/001.mp3": "Bulbasaur",
    "/assets/cries/mp3/002.mp3": "Ivysaur",
    "/assets/cries/mp3/150.mp3": "Mewtwo"
}

/*
*** CUSTOM JS ***
*/

//cryLoader();
spriteLoader();
//playAll();

domready(function() {

})

function cryLoader() {
    //NOT USED
    var i;
    for (i=1; i <= 3; i++) {
        var file_num = "00" + i;
        file_num = file_num.substr(file_num.length - 3, 3);
        audio_id = "cry-" + file_num + "";
        //load audio
        document.getElementById('cry-wrap').innerHTML += '<audio id='+ audio_id +'><source src="assets/cries/mp3/'+ file_num +'.mp3" type="audio/mpeg"></audio>';
        //load buttons
        document.getElementById('cry-wrap').innerHTML += "<button onclick='document.getElementById(\""+ audio_id +"\").play();'><img src=assets/sprites/"+ i +".png></button>";
        //load draggable images
        document.getElementById('draggable-items').innerHTML += "<img src='assets/sprites/"+ i +".png' id='"+ file_num +"' class='drag-item' draggable='true' ondragstart='drag(event)'>";
    }
}

function spriteLoader() {
    var i;
    for (i=1; i <= 3; i++) {
        var file_num = "00" + i;
        file_num = file_num.substr(file_num.length - 3, 3);
        audio_id = "cry-" + file_num + "";
        //load draggable images
        document.getElementById('draggable-items').innerHTML += "<img src='assets/sprites/"+ i +".png' id='"+ file_num +"' class='drag-item' draggable='true'>";
    }
}

function formatFile(file) {

}

function playAll() {
    //NOT USED
    document.getElementById("play-all").onclick = function() {
        (function myLoop (i) {
            setTimeout(function () {
                console.log(i);
                var file_num = "00" + i;
                file_num = file_num.substr(file_num.length - 3, 3);
                audio_id = "cry-" + file_num + "";
                document.getElementById(audio_id).play();
                if (++i <= 5) {
                    myLoop(i);
                } 
            }, 1000)
        } ) (1);
    }; 
}

/*function getDroppedItems() {
    var grid = document.getElementById("drop-grid"),
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
    } ) (0);
}*/

/* Reset */
document.getElementById("reset").onclick = function() {
    resetItems();
};
function resetItems() {
    var items = document.getElementsByClassName("drag-item");
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];  
        document.getElementById("draggable-items").appendChild(item);
    }
}

/*
***  DRAG & DROP ***
*/

var dragItems = document.getElementsByClassName('drag-item');
for (var i = 0; i < dragItems.length; i++) {
    dragItems[i].addEventListener("dragstart", function(event) {
        drag(event);
    });
}

var gridItems = document.getElementsByClassName('grid-item');
for (var i = 0; i < gridItems.length; i++) {
	gridItems[i].addEventListener("drop", function(event) {
	    drop(event);
	}, false);

	gridItems[i].addEventListener("dragover", function(event) {
	    allowDrop(event);
	});
}

function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //console.log(data);
    ev.target.appendChild(document.getElementById(data));
}
/* https://gist.github.com/WickyNilliams/9252235 */
/**
 * converts array-like object to array
 * @param  collection the object to be converted
 * @return {Array} the converted object
 */
function arrayify(collection) {
    return Array.prototype.slice.call(collection);
}

/**
 * generates factory functions to convert table rows to objects,
 * based on the titles in the table's <thead>
 * @param  {Array[String]} headings the values of the table's <thead>
 * @return {Function}      a function that takes a table row and spits out an object
 */
function factory(headings) {
    return function(row) {
        return arrayify(row.cells).reduce(function(prev, curr, i) {
            if (curr.innerHTML === "") {
                prev[headings[i]] = null;
            } else {
                //return id of pokemon sprite
                prev[headings[i]] = curr.firstChild.getAttribute("id");
            } 
            return prev;
        }, {});
    }
}

/**
 * given a table, generate an array of objects.
 * each object corresponds to a row in the table.
 * each object's key/value pairs correspond to a column's heading and the row's value for that column
 * 
 * @param  {HTMLTableElement} table the table to convert
 * @return {Array[Object]}       array of objects representing each row in the table
 */
function parseTable(table) {
    var headings = arrayify(table.tHead.rows[0].cells).map(function(heading) {
        return heading.innerText;
    });
    return arrayify(table.tBodies[0].rows).map(factory(headings));
}

/*
*** STAFF JS ***
*/

domready(function() {

})

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
document.getElementById("play").onclick = function() {
    playSong();
};
function playSong() {
	var table = document.querySelector("table");
	var data  = parseTable(table);
	//console.log(data);

	var q = 0;
	var i = 0;
	(function myLoop (i) {
		for (q = 0; q < 5; q++) {
			var temp = data[i][q];
			console.log("temp = "+ temp);
			console.log("i = "+ i );
			console.log("q = "+ q );
			if (temp != null) {
				
				//Init web audio
				var shifter = createProcessingNode(context);
				curSource = (dataSources[sourceSelect.value])();
				curSource.connect(context.destination);
				curSource.start(0);

				if (q == 2) {
					console.log("B NOTE");
				}

				var snd1  = new Audio();
				var src1  = document.createElement("source");
				src1.type = "audio/mpeg";
				src1.src  = "assets/cries/mp3/"+ temp +".mp3";
				snd1.appendChild(src1);
				snd1.play();
			}
		}

		setTimeout(function () {
		    if (++i < 5) {
		        myLoop(i);
		    } 
		}, 1000)
	} ) (0);
}