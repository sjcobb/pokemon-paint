/*
***  AUDIO ***
*/

var snd1  = new Audio();
var src1  = document.createElement("source");
src1.type = "audio/mpeg";
src1.src  = "assets/cries/mp3/001.mp3";
snd1.appendChild(src1);

var snd2  = new Audio();
var src2  = document.createElement("source");
src2.type = "audio/mpeg";
src2.src  = "assets/cries/mp3/151.mp3";
snd2.appendChild(src2);

//snd1.play(); 
//snd2.play();