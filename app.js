let input = document.getElementById('input');
let cross = document.getElementById('cross');
let display = document.getElementById('display');
let win = document.getElementById('wind');
let precipetation = document.getElementById('preci');
let currentWeather = document.getElementById('day');




input.addEventListener('input', function(){
  if (input.value !== '') {
    cross.style.display = 'block'
  }
})
cross.addEventListener('click', function() {
  input.value = ''
  cross.style.display = 'none';
})


async function getWeather(){
  let location = document.getElementById("input").value;
  if(location === "") return alert("Please enter a city name");

  // Step 1: Get Latitude & Longitude using geocoding API
  let geoAPI = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
  let geoData = await geoAPI.json();

  if(!geoData.results || geoData.results.length === 0){
    console.log('City is not found.....');
    return;
  }
  
  let lat = geoData.results[0].latitude;
  let lon = geoData.results[0].longitude;

  // Step 2: Fetch weather info
  let weatherAPI = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`);
  let weatherData = await weatherAPI.json();
  console.log(weatherData);
  
  let time = weatherData.current.time
  let temp = weatherData.current.temperature_2m;
  let wind = weatherData.current.wind_speed_10m;
  let rain = weatherData.current.precipitation; 
  console.log(rain);
  
  let nTemp = Math.ceil(temp)

  if (nTemp >=30) {
    currentWeather.innerText = "Hot Weather";
    console.log("Hot Weather");
  }
  else if (nTemp >= 20 && nTemp < 30) {
    currentWeather.innerText = "Warm Weather";
    console.log("Warm Weather");
  }
  else if (nTemp < 20) {
    currentWeather.innerText = "Cold Weather";
  }
  else{
    currentWeather.innerText = "Invalid"
  }

  // Step 3: Display results
  display.innerHTML = `<h1>${nTemp}<sup>o</sup>C</h1>`;
  win.innerText = `${wind} Km/h`;
  precipetation.innerText = `${rain}`



  let hourlyApi = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m`);
  let hourlyJson = await hourlyApi.json();

  let hourlyData = hourlyJson.hourly;
  let hours = hourlyData.time;
  let temps = hourlyData.temperature_2m;
  console.log(temps);
  

  let hourlyDiv = document.getElementById('box');
  hourlyDiv.innerHTML = "";
  
  for(let i = 0; i < 12; i++){
    let timeText = hours[i].slice(11,16);

    if (i === 0) {
      timeText = 'Now'
    }
    hourlyDiv.innerHTML += `
      <div class="cd">
      <p>${timeText}</p>
      <h3>${Math.round(Math.ceil(temps[i]))}°C</h3>
      </div>
    `;
  }

  let dailyAPI = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
  let dailyData = await dailyAPI.json();
  console.log(dailyData);

let days = dailyData.daily.time;
let maxTemp = dailyData.daily.temperature_2m_max;
let minTemp = dailyData.daily.temperature_2m_min;

function getDayName(dateString){
  let date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

let dailyDiv = document.getElementById('box1');
dailyDiv.innerHTML = ""; 

for(let i = 0; i < 7; i++){
  dailyDiv.innerHTML += `
    <div class="cd">
      <p>${getDayName(days[i])}</p>
      <p>${Math.round(maxTemp[i])}°C ${Math.round(minTemp[i])}°C</p>
    </div>
  `;
}



}

// let input = document.getElementById('input');
// let display = document.getElementById('main');

// async function fetchData() {
//     const API = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input.value}`)
//     const data = await API.json()
//     const weather = data.results[0]
    
//     // for (let i = 0; i < data.results.length; i++) {
//     //     let weather = data.results[i]
        
//         display.innerHTML += `
//             <div id="box">
//                 <h4>Name: ${weather.name}</h4>
//                 <p>Latitude: ${weather.latitude} <br></p>
//                 <p>Longitude: ${weather.longitude} <br></p>
//                 <p>Country_code: ${weather.country_code} <br></p>
//                 <p>Timezone: ${weather.timezone} <br></p>
//                 <p>Country: ${weather.country} <br></p>
//                 <p>Province: ${weather.admin1} <br></p>
//             </div>`
        
//     // }
// }