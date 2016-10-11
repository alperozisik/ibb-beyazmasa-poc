module.exports.slider = Device.deviceOS === "Android"?
    "slider.png": "Slider.png";
    
    
var iOSConfig = {
    slider: "Slider.png"
};

var androidConfig = {
    slider: "slider.png"
};

if(Device.deviceOS === "iOS") {
    module.exports = iOSConfig;
} else {
    module.exports = androidConfig;
}