/*
*** CUSTOM JS ***
*/

cryLoader();
playSong();
//getDroppedItems();

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

function formatFile(file) {

}

function playSong() {
    document.getElementById("play-all").onclick = function() {
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
    };
}

function getDroppedItems() {

    var grid = document.getElementById("drop-grid"),
        descendents = grid.getElementsByTagName("div");
    //console.log(grid);
    //console.log(descendents);

    (function myLoop (i) {
        setTimeout(function () {
            item = descendents[i];
            item_id = item.children[0].getAttribute('id');
            audio_id = 'cry-' + item_id + '';
            console.log(audio_id);
            document.getElementById(audio_id).play();

            if (item.tagName === 'mew') {

            }

            if (++i < descendents.length) {
                myLoop(i);
            } 
        }, 1000)
    } ) (0);

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