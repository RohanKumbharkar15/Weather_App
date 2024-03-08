const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-access");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// initial variables
let currentTab=userTab;
const API_KEY="f0228b4b8bb510a7c8877bc92c7015dd";
currentTab.classList.add("current-tab");//its css

//ek kaam pending
getfromSessionStorage();//when we click on link and if lat and lon is'
// alredy present in our session storage then use it


userTab.addEventListener("click",()=>{
    switchTab(userTab);//pass clicked tab as input parameter
});

searchTab.addEventListener("click",()=>
{
    switchTab(searchTab);//pass clicked tab as input parameter
});

function switchTab(clickedTab)
{
    if(clickedTab !== currentTab)
    {
        currentTab.classList.remove("current-tab");//css removed
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");// again css added

        if(! searchForm.classList.contains("active"))
        {
            //kya search form wala container invisible ,if yes then make it visible
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
            pageNotFound.classList.remove("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            pageNotFound.classList.remove("active");
           // ab main your weather tab me aagaya hu toh weather bhi display karna padega,
           // so lets check for local storage first
           // for coordinates,if we have saved them there
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage()
{
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        //agar local coorrdinates nahi mile to
        grantAccessContainer.classList.add("active");
        // getLocation();
    }
    else{
        const coordinates=JSON.parse(localCoordinates);// json string converts into json object
        fetchUserWeatherInfo(coordinates);//lat and long pass kele location search karayala

    }
}
let pageNotFound=document.querySelector(".page-not-found");

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
    //make grant invisible
    grantAccessContainer.classList.remove("active");
    pageNotFound.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //api call
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data =await response.json();// converted into json format
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        if (data.cod === "404") {
            userInfoContainer.classList.remove("active");
            pageNotFound.classList.add("active");
        } else {
            renderWeatherInfo(data);
        }
    }catch(err)
    {
        loadingScreen.classList.remove("active");
        // pageNotFound.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo)
{
    //firstly , we have to fetch the elements
    let cityName=document.querySelector("[data-cityName]");
    let countryIcon=document.querySelector("[data-countryIcon]");
    let desc=document.querySelector("[data-weatherDesc]");
    let weatherIcon=document.querySelector("[data-weatherIcon]");
    let temp=document.querySelector("[data-temp]");
    let windspeed=document.querySelector("[data-windspeed]");
    let humidity=document.querySelector("[data-humidity]");
    let cloudiness=document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);
    //fetch values from weatherInfo object and
    // put in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation()
{
    if(navigator.geolocation)//if support
    {
        navigator.geolocation.getCurrentPosition(showPosition);

    }else{
        alert("Geolocation is not supported by Your Device")
    }
}
function showPosition(position)
{
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
// -----------------------------

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>
{
    e.preventDefault();//default method ko differ karo
    let cityName=searchInput.value;
    if(cityName==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    pageNotFound.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        if (data.cod === "404") {
            userInfoContainer.classList.remove("active");
            pageNotFound.classList.add("active");
        } else {
            renderWeatherInfo(data);
        }
    } catch (err) {
        loadingScreen.classList.remove("active");
        alert("Failed to fetch city");
        // pageNotFound.classList.add("active");
    }
}




