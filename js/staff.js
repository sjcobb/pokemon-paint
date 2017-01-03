/*
*** STAFF JS ***
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
        //console.log(t, pitch)
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
  
    //Create a script node, parameters: bufferSize, numberOfInputChannels, numberOfOutputChannels
    //bufferSize: controls how frequently the audioprocess event is dispatched, balance between latency and audio quality
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
    //"oscillator": function() { return context.createOscillator() }
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
    //console.log("request: " + request);
    request.send();
}

function loadFiles(list) {
    for(var i=0; i<list.length; ++i) {
        loadFile(list[i])
    }
}

loadFiles([
    "/assets/cries/mp3/001.mp3", 
    "/assets/cries/mp3/002.mp3",
    "/assets/cries/mp3/003.mp3",
    "/assets/cries/mp3/150.mp3"
])

var prettyNames = {
    "/assets/cries/mp3/001.mp3": "Bulbasaur",
    "/assets/cries/mp3/002.mp3": "Ivysaur",
    "/assets/cries/mp3/003.mp3": "Venusaur",
    "/assets/cries/mp3/150.mp3": "Mewtwo"
}

domready(function() {

	//Init web audio
	var shifter = createProcessingNode(context);

	var playing = false;
	var useFilter = true;
	var curSource = null;

	/**
	 * Play song
	 */
	document.getElementById("play").onclick = function() {
	    playSong();
	};
	document.getElementById("pausePlay").onclick = function() {
	    pauseSong();
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
				//console.log("temp = "+ temp);
				//console.log("i = "+ i );
				//console.log("q = "+ q );
				if (temp != null) {

					var crySrc = "/assets/cries/mp3/"+ temp +".mp3";
					//console.log("CRY SOURCE: "+ crySrc);
					
					ondatasource = function(url) {
					    
					}

					ondatasource(crySrc);

					if(playing) {
					    curSource.disconnect(0);
					    curSource.stop(0);
					    curSource = null;
					    playing = false;
					} else {
					    curSource = (dataSources[crySrc])();
					    curSource.connect(shifter);
					    shifter.connect(context.destination);
					    if(!curSource.start) {
					        curSource.noteOn(0);
					    } else {
					        curSource.start(0);
					    }
					    curSource.loop = true;
					    playing = true;
					    pausePlay.value = "Pause";
					}

					if (q == 2) {
						console.log("B NOTE");
					}

				}
			}

			setTimeout(function () {
			    if (++i < 5) {
			        myLoop(i);
			    } 
			}, 1000)
		} ) (0);
	}
	function pauseSong() {
		curSource.disconnect(0);
	}
})

