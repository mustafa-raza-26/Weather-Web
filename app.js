let input = document.getElementById('input');
let cross = document.getElementById('cross');

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
  let cityName = document.getElementById("city").value;
  if(cityName === "") return alert("Please enter a city name");

  // Step 1: Get Latitude & Longitude using geocoding API
  let geoAPI = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
  let geoData = await geoAPI.json();

  if(!geoData.results){
    document.getElementById("result").innerHTML = "<h3>City not found.</h3>";
    return;
  }

  let lat = geoData.results[0].latitude;
  let lon = geoData.results[0].longitude;

  // Step 2: Fetch weather info
  let weatherAPI = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`);
  let weatherData = await weatherAPI.json();

  let temp = weatherData.current.temperature_2m;
  let wind = weatherData.current.wind_speed_10m;

  // Step 3: Display results
  document.getElementById("result").innerHTML = `
    <div class="card bg-secondary p-3">
      <h2>${geoData.results[0].name}</h2>
      <p><strong>Temperature:</strong> ${temp}°C</p>
      <p><strong>Wind Speed:</strong> ${wind} km/h</p>
    </div>
  `;
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