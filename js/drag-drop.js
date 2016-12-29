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