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
