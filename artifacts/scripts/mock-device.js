// mock-device.js
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

const deviceName = "MQ_DEVICE";
let message = "test-message";

// 1. Publish random number every 15 seconds
schedule('*/59 * * * * *', ()=>{
    let body = {
        "name": deviceName,
        "cmd": "randfloat32",
        "randfloat32": getRandomFloat(25,29).toFixed(1)
    };
    publish( 'DataTopic', JSON.stringify(body));
});

// 2. Receive the reading request, then return the response
// 3. Receive the put request, then change the device value
subscribe( "CommandTopic" , (topic, val) => {
    console.log(topic);
    console.log(val);
    var data = val;
    if (data.method == "set") {
        message = data[data.cmd]
    }else{
        switch(data.cmd) {
            case "ping":
              data.ping = "pong";
              break;
            case "message":
              data.message = message;
              break;
            case "randfloat32":
                data.randfloat32 = getRandomFloat(25,29).toFixed(1);
                break;
        case "randfloat64":
                data.randfloat64 = getRandomFloat(10,1).toFixed(5);                                                                                                                                         
                break;
          }
    }
    publish( "ResponseTopic", JSON.stringify(data));
});