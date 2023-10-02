var APIKey = "2504341f8dff556dc719a3a0672777f0"
var textArea = document.getElementById("textArea")
var searchBtn = document.getElementById("searchBtn")
var cardsDiv = document.querySelector(".cardCollection")
var currentCard = document.querySelector("#currentDay")
var city = textArea.value
var historyBtns = document.querySelector(".history")
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

// generates search history buttons
var genBtn = (data) => {
    return `<button class="btn btn-secondary mt-2 w-100" type="click">${data.split("+").join(" ")}</button>`
}
//inner html of cards.
var genCard = (city, cardData, index) => {
    if (index == 0){
    return `<h3>${city.split("+").join(" ")} (${cardData.dt_txt.split(" ")[0]})</h3>   
            <div class = mainIcon>
                <img src="https://openweathermap.org/img/wn/${cardData.weather[0].icon}@4x.png" alt="weather-icon">
            </div>      
            <p>Temp: ${cardData.main.temp} °F</p>
            <p>Wind: ${cardData.wind.speed} M/S</p>
            <p>Humidity ${cardData.main.humidity}%</p>`
    }else{
    return `<div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${cardData.dt_txt.split(" ")[0]}</h5>
                        <div class="icon">
                            <img src="https://openweathermap.org/img/wn/${cardData.weather[0].icon}@4x.png" alt="weather-icon">                            
                        </div>
                        <p class="card-text">Temp: ${cardData.main.temp} °F</p>
                        <p class="card-text">Wind: ${cardData.wind.speed} M/S</p>
                        <p class="card-text">Humidity: ${cardData.main.humidity}%</p>
                    </div>
                </div>
            </div> `
}}

//on click replaces spaces in searches queries the api and returns logitude and latitude
searchBtn.addEventListener("click", function() {
    var city = textArea.value.split(/\s+/).join("+")
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    fetch(queryURL).then(response => response.json()).then(data => { 
       var lat = data.coord.lat
       var lon = data.coord.lon
        getWeatherData(city, lat, lon) 
    })
});
//grabs the info and filters it down to current + 5 day forcast
function getWeatherData(city, lat, lon) {
    var APIReq= "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat="+lat+"&lon="+lon+"&appid="+APIKey
    fetch(APIReq).then(res => res.json()).then(data => {
        var uniqueForcastDays = [];
        var fiveDay = data.list.filter(forcast => {
            var forcastDate= new Date(forcast.dt_txt).getDate()
            if(!uniqueForcastDays.includes(forcastDate)) {
                return uniqueForcastDays.push(forcastDate)
            }
                 
    })
    //zeroes out the html to avoid duplicates and other bugs
    city.value = ""
    currentCard.innerHTML = ""
    cardsDiv.innerHTML = ""


    fiveDay.forEach((cardData, index) => {
        addIndexInfo = genCard(city, cardData, index)
        if (index===0) {
            currentCard.insertAdjacentHTML("beforeend", addIndexInfo)
        }else if (index<=5) {
            cardsDiv.insertAdjacentHTML("beforeend", addIndexInfo)
        }else{
            return;
        }
        


    })

    //gathers and saves the internal storage array
    var oldHistory = JSON.parse(localStorage.getItem("searches")) || []
    var history = city
    if (!oldHistory.includes(history)){
        oldHistory.push(history)
        localStorage.setItem("searches", JSON.stringify(oldHistory))
        createButtons()
    }
    }) 
}
//generates buttons from localstorage
function createButtons(){
    searches = JSON.parse(localStorage.getItem("searches")) || []
    historyBtns.innerHTML = ""
    searches.forEach((data) =>{
        createBtn = genBtn(data)
        historyBtns.insertAdjacentHTML("beforeend", createBtn)       
    })
}


//searches from click on history items
document.addEventListener('DOMContentLoaded', function () {
    createButtons();
    $(document).on('click', '.btn-secondary', function (){
            city= this.textContent.split(/\s+/).join("+")
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
            fetch(queryURL).then(response => response.json()).then(data => { 
               var lat = data.coord.lat
               var lon = data.coord.lon
                getWeatherData(city, lat, lon) 
            })
        })
    })

