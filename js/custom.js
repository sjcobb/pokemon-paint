/*
*** CUSTOM JS ***
*/

//cryLoader();
spriteLoader();
//playAll();

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
