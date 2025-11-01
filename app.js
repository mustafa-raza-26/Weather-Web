let input = document.getElementById('input');
let cross = document.getElementById('cross');
let display = document.getElementById('display');
let win = document.getElementById('wind');
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
  let nTemp = Math.ceil(temp)

  // Step 3: Display results
  display.innerHTML = `
    <h1>${nTemp}<sup>o</sup>C</h1>
    <h2>${time}</h2>
  `;
  
  win.innerText = `
  ${wind} Km/h
  `

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