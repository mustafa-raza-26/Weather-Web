let input = document.getElementById('input');
let cross = document.getElementById('cross');
let display = document.getElementById('display');
let feels = document.getElementById('feel');
let win = document.getElementById('wind');
let humidity = document.getElementById('humidi');
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

window.onload = function () {
  input.value = "Islamabad";
  getWeather();
};

async function getWeather(){
  let location = document.getElementById("input").value.toLowerCase();
  if(location === "") return alert("Please enter a city name");

  let geoAPI = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}`);
  let geoData = await geoAPI.json();

  if(!geoData.results || geoData.results.length === 0){
    alert('City is not found.....');
    return;
  }
  
  let lat = geoData.results[0].latitude;
  let lon = geoData.results[0].longitude;

  // Step 2: Fetch weather info
  let weatherAPI = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,precipitation`);
  let weatherData = await weatherAPI.json();

  let temp = weatherData.current.temperature_2m;
  let feel = weatherData.current.apparent_temperature;
  let nfeel = Math.ceil(feel)

  let rain = weatherData.current.precipitation;
  let wind = weatherData.current.wind_speed_10m;
  let humidi = weatherData.current.relative_humidity_2m; 

  
  let nTemp = Math.ceil(temp)

  if (nTemp >=30) {
    currentWeather.innerText = "Hot Weather";
  }
  else if (nTemp >= 20 && nTemp < 30) {
    currentWeather.innerText = "Warm Weather";
  }
  else if (nTemp < 20) {
    currentWeather.innerText = "Cold Weather";
  }
  else{
    currentWeather.innerText = "Invalid"
  }

  // Step 3: Display results
  display.innerHTML = `<h1>${nTemp}<sup>o</sup>C</h1>`;
  feels.innerHTML = `${nfeel}<sup>o</sup>C`;
  precipetation.innerText = `${rain} mm`;
  win.innerText = `${wind} Km/h`;
  humidity.innerText = `${humidi}%`;



  let hourlyApi = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m`);
  let hourlyJson = await hourlyApi.json();

  let hourlyData = hourlyJson.hourly;
  let hours = hourlyData.time;
  let temps = hourlyData.temperature_2m;
  
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