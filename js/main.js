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
//inputs
let inputCountry = document.querySelector("#country")
let inputCity = document.querySelector("#city")



// let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


let interval1 = null;
let interval2 = null;
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





interval1 = setInterval(() => {
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

let PrayersNeed = ['Fajr','Dhuhr', 'Asr','Maghrib', 'Isha'];
let found = false;

for(key in data.timings){

  if(PrayersNeed.includes(key)){ 

    let hourValue = +(data.timings[key].split(":")[0]);
    let mintValue = +(data.timings[key].split(":")[1]);
    
    if(hourValue > date.getHours() || 
        (hourValue === date.getHours() && mintValue > date.getMinutes()) || 
        (hourValue === date.getHours() && mintValue === date.getMinutes() && date.getSeconds() === 0)){
      
      found = true;
          
    interval2 =  setInterval(() => {
        const timezone = data.meta.timezone;
        const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
        let date = new Date(currentTime);
        
        let remainingHour = (hourValue - date.getHours());
        let remainingMinute = (mintValue - date.getMinutes());
        let remainingSecond = 60 - date.getSeconds();
        
        if (remainingMinute < 0) {
          remainingHour -= 1;
          remainingMinute += 60;
        }
        
        if (remainingSecond === 60) {
          remainingSecond = 0;
        }
        timeRemainingHour.innerHTML = remainingHour;
        timeRemainingMinute.innerHTML = remainingMinute;
        timeRemainingSecond.innerHTML = remainingSecond;
      }, 1000);

      break;
    }
  }
}

//next pray if not found
if (!found) {
  let fajrKey = 'Fajr';
  let hourValue = +(data.timings[fajrKey].split(":")[0]) + 24;
  let mintValue = +(data.timings[fajrKey].split(":")[1]);
  
  interval2 = setInterval(() => {
    const timezone = data.meta.timezone;
    const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
    let date = new Date(currentTime);
    
    let remainingHour = (hourValue - date.getHours());
    let remainingMinute = (mintValue - date.getMinutes());
    let remainingSecond = 60 - date.getSeconds();
    
    if (remainingMinute < 0) {
      remainingHour -= 1;
      remainingMinute += 60;
    }
    
    if (remainingSecond === 60) {
      remainingSecond = 0;
    }
    
    timeRemainingHour.innerHTML = remainingHour;
    timeRemainingMinute.innerHTML = remainingMinute;
    timeRemainingSecond.innerHTML = remainingSecond;
  }, 1000);

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
  clearInterval(interval1)
  clearInterval(interval2)
  getPrayerTimes(city.value,country.value)
  localStorage.setItem("country",country.value)
  localStorage.setItem("city",city.value)
})



//reset

let reset = document.querySelector("#reset")

reset.addEventListener("click", (e)=>{
  inputCity.value = ""
  inputCountry.value = "" 
})

//localStorage


if(localStorage.getItem("country") !== "" && localStorage.getItem("city") !== ""){
  getPrayerTimes(localStorage.getItem("city"),localStorage.getItem("country"))
  inputCountry.value = localStorage.getItem("country")
  inputCity.value = localStorage.getItem("city")
}else{
  getPrayerTimes("cairo","egypt")
}



// outo complte

let countryComplete = document.querySelector("#countryList")
let cityComplete =  document.querySelector("#cityList")
async function getData(json){
  try {
    let response = await fetch(json)
    let data = await response.json()
    return data.countries  
  }catch (error) {
    console.log(error)
  }
}



  getData(`../database/contryAndCitys.json`)
  .then((data)=>{
    // country complete
    let dataArrayCountry = []

    for(let i=0;i < data.length;i++){

      dataArrayCountry.push(data[i].name_en)    
    }

    autocomplete(countryComplete,dataArrayCountry)
    return data
  })
  .then((data)=>{
    //city complete

    inputCity.addEventListener('focus',function(){
      let cityData = [] 
      for(let i=0;i<data.length;i++){
        if(data[i].name_en == inputCountry.value){
          let value = data[i].cities
          for(let i=0;i<value.length;i++){
            cityData.push(value[i].name_en)
          }
        }
      }
      autocomplete(cityComplete,cityData)
    })

  })

//autocomplete function
function autocomplete(list,datalist){
  for(let i=0;i<datalist.length;i++){
    let option = document.createElement("option")
    option.setAttribute("value",datalist[i])
    list.append(option)
  }
}