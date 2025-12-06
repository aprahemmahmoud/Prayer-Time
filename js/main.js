  // set the data

// Prayer-times
let fajr = document.querySelector(".fajr .Prayer-time")
let dhuhr = document.querySelector(".dhuhr .Prayer-time")
let asr = document.querySelector(".asr .Prayer-time")
let maghrib = document.querySelector(".maghrib .Prayer-time")
let isha = document.querySelector(".isha .Prayer-time")
// data
let gregorian = document.querySelector(".date .gregorian")
let hijri = document.querySelector(".date .hijri")



// let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;



function getPrayerTimes(city,country){
fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`)
.then(res => res.json())
.then(data => data.data)
.then((data)=>{

  //set times
  fajr.innerText = data.timings.Fajr
  dhuhr.innerText = data.timings.Dhuhr
  asr.innerText = data.timings.Asr
  maghrib.innerText = data.timings.Maghrib
  isha.innerText = data.timings.Isha
  //set date
  gregorian.innerText = data.date.gregorian.date
  hijri.innerText = `${data.date.hijri.date}هـ`

  return data
}).then((data)=>{
  // set date right now
let hourNow = document.querySelector('.time-now .hour');
let minuteNow = document.querySelector('.time-now .minute');
let secondNow = document.querySelector('.time-now .second');

setInterval(() => {
const timezone = data.meta.timezone;
const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
let date = new Date(currentTime);
  hourNow.innerHTML = date.getHours();
  minuteNow.innerHTML = date.getMinutes();
  secondNow.innerHTML = date.getSeconds();
}, 1000);

return data
})
.then((data)=>{

const timezone = data.meta.timezone;
const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
let date = new Date(currentTime);

  //time remaining
  let timeRemainingHour = document.querySelector(".time-remaining .hour")
  let timeRemainingMinute = document.querySelector(".time-remaining .minute")
  let timeRemainingSecond = document.querySelector(".time-remaining .second")
  for(key in data.timings){
    let hourValue = +(data.timings[key].split(":")[0]) 
    let mintValue = +(data.timings[key].split(":")[1])
    if(hourValue >= date.getHours() && mintValue >= date.getMinutes()){
      let second = date.getSeconds()
      setInterval(() => {
        const timezone = data.meta.timezone;
        const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
        let date = new Date(currentTime);
        timeRemainingHour.innerHTML = (hourValue - date.getHours());
        timeRemainingMinute.innerHTML = (mintValue - date.getMinutes());
        timeRemainingSecond.innerHTML = date.getSeconds();
        }, 1000);

      break;
    }
  }
})
.catch(err => console.log(err)) 
}




// submit
let form = document.querySelector("form")
let country = document.querySelector("#country")
let city = document.querySelector("#city")

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  getPrayerTimes(city.value,country.value)
  localStorage.setItem("country",country.value)
  localStorage.setItem("city",city.value)
})



if(localStorage.getItem("country") !== null && localStorage.getItem("city") !== null){
  getPrayerTimes(localStorage.getItem("city"),localStorage.getItem("country"))
}else{
  getPrayerTimes("cairo","egypt")
}



// outo complte

let countryComplete = document.querySelector("#country")
let cityComplete =  document.querySelector("#city")
async function getData(json){
  try {
    let response = await fetch(json)
    let data = await response.json()
    return data.countries  
  }catch (error) {
    console.log(error)
  }
}


countryComplete.addEventListener('keyup',(e)=>{
  getData(`../database/contryAndCitys.json`).then((data)=>{
    for(let i=0;i < data.length;i++){
      console.log(data[i])
      console.log(data[i].name_en)
    }
    // return data[i].name_en
  })
})

