define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var messages = require('./messages');

    // Load library/vendor modules using
    // full IDs, like:
    var print = require('print');

    print(messages.getHello());

    /*** CRY SHIFT ***/
    //Create a pitch shifting object
    var shifter = require("pitchshift")(
        function onData(frame) {
        //Play / write out frame.  Called whenver data is ready
        },
        function onTune(t, pitch) {

        console.log("Got pitch ", pitch, " at time ", t)

        //This is the amount to scale the sample by
        return 1.0
        })

    //Feed some data to the shifter
    shifter(new Float32Array([1, 1, 0, 1, 0, 0, 0 /* ... etc */ ]))
});