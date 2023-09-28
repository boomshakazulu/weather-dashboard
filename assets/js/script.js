var APIKey = "2504341f8dff556dc719a3a0672777f0"
var textArea = document.getElementById("textArea")
var searchBtn = document.getElementById("searchBtn")
var city = textArea.value
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;


searchBtn.addEventListener("click", function() {
    var city = textArea.value.split(/\s+/).join("+")
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    fetch(queryURL).then(response => response.json()).then(data => { 
       var lat = data.coord.lat
       var lon = data.coord.lon
       console.log(data)
        getWeatherData(lat, lon) 
    })
});

function getWeatherData(lat, lon) {
    var APIReq= "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat="+lat+"&lon="+lon+"&appid="+APIKey
    fetch(APIReq).then(res => res.json()).then(data => {
        var uniqueForcastDays = [];
        var fiveDay = data.list.filter(forcast => {
            var forcastDate= new Date(forcast.dt_txt).getDate()
            if(!uniqueForcastDays.includes(forcastDate)) {
                return uniqueForcastDays.push(forcastDate)
            }
                 
    })
    console.log(fiveDay)  
    })
}