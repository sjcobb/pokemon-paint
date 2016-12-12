/*
***  DRAG & DROP ***
*/

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

/*$frame = $("#frame");
$blue = $("#blue");
$red = $('<div id="red" style="width: 100px; height: 100px; background-color: red; color: white;">dropzone</div>');
$frame.contents().find("body").html($red);

var foo = {
    foo: "foo",
    bar: "bar"
};

$blue.on("dragstart", function (e) {
    var j = JSON.stringify(foo);
    e.originalEvent.dataTransfer.setData("foo", j);
});

$red.on("dragenter", function (e) {
    e.preventDefault();
});
$red.on("dragover", function (e) {
    e.preventDefault();
});
$red.on("drop", function (e) {
    var obj = JSON.parse(e.originalEvent.dataTransfer.getData("foo"));
    console.log("foo is:", obj);
});*/