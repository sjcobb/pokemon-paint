/*
*** CRY SHIFTER ***
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

domready(function() {

    //Init web audio
    var shifter = createProcessingNode(context)

    var pausePlay = document.getElementById("pausePlay")
    var sourceSelect = document.getElementById("audioSource")
    var applyShift = document.getElementById("applyShift")

    var playing = false
    var useFilter = true
    var curSource = null
  
    ondatasource = function(url) {
        var opt = document.createElement("option")
        opt.text = prettyNames[url]
        opt.value = url
        sourceSelect.add(opt)
    }

    sourceSelect.remove(0)
    for(var id in dataSources) {
        ondatasource(id)
    }
  
    pausePlay.addEventListener("click", function() {
        if(playing) {
            curSource.disconnect(0)
            if(useFilter) {
                shifter.disconnect(0)
            }
            if(!curSource.start) {
                curSource.noteOff(0)
            } else {
                curSource.stop(0)
                curSource.noteOff(0)
            }
            curSource = null
            playing = false
            pausePlay.value = "Play"
        } else {
            curSource = (dataSources[sourceSelect.value])()
            if(useFilter) {
                curSource.connect(shifter)
                shifter.connect(context.destination)
            } else {
                curSource.connect(context.destination)
            }
            if(!curSource.start) {
                curSource.noteOn(0)
            } else {
                curSource.start(0)
            }
            curSource.loop = true
            playing = true
            pausePlay.value = "Pause"
        }
    })
  
  
    applyShift.addEventListener("change", function() {
        useFilter = !!applyShift.checked
        if(playing) {
            curSource.disconnect(0)
            if(useFilter) {
                curSource.connect(shifter)
                shifter.connect(context.destination)
            } else {
                shifter.disconnect(0)
                curSource.connect(context.destination)
            }
        }
    })
})

/*
*** CUSTOM JS ***
*/

//cryLoader();
playSong();

function cryLoader() {
    var i;
    for (i=1; i <= 9; i++) {
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

function formatFile(file) {

}

function playSong() {
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

function getDroppedItems() {
    var grid = document.getElementById("drop-grid"),
        descendents = grid.getElementsByTagName("div");

    (function myLoop (i) {
        setTimeout(function () {
            item = descendents[i];
            item_id = item.children[0].getAttribute("id");
            audio_id = "cry-" + item_id + "";
            console.log(audio_id);
            document.getElementById(audio_id).play();

            if (item.tagName === "mew") {

            }

            if (++i < descendents.length) {
                myLoop(i);
            } 
        }, 1000)
    } ) (0);
}

function resetItems() {
    var items = document.getElementsByClassName("drag-item");
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];  
        document.getElementById("draggable-items").appendChild(item);
    }
}

/*** DRAG & DROP ***/
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

/* http://www.musictheory.net/lessons/10 */

var staff = { 
    fred: { apples: 2, oranges: 4, bananas: 7, melons: 0 }, 
    mary: { apples: 0, oranges: 10, bananas: 0, melons: 0 }, 
    sarah: { apples: 0, oranges: 0, bananas: 0, melons: 5 } 
}

console.log( staff[ 'fred' ][ 'apples' ] );
