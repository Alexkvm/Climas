
/*
document.getElementById('text').addEventListener('keyup',function(e){
    if(e.key === "Enter") {
        const inputValue = this.value;
        searchCountry();
        this.value = "";
    }
});

const searchCountry = () => {
    console.log(inputValue)
/*
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=8d962f9cbfac0dd4e9906da705f40542`)
    .then(res => res.json()).then(data =>{
        console.log(data);
    })
}
*/

const queryParamKey = 'countryName';
const star = document.querySelector('#fav');
const gridContent = document.querySelector('.gridContent');
const notFoundDiv = document.querySelector('.notFound');

//Tomamos el país del usuario como datos default de la página
const getUserCountry = async() =>{

    try{
        const res = await fetch('http://ip-api.com/json/');
        if(!res.ok) console.log("No se ha podido obtener la ubicación del usuario.");

        const data = await res.json();
        const userCountry = data.country;

        fetchApi(userCountry);
    }
    catch(error) {
        console.log("Error en conseguir la ubiación. Usando Argentina por defecto.");
        fetchApi("Argentina");
    }

}
getUserCountry();

document.querySelector('#formSearch').addEventListener("submit", (e) =>{

    e.preventDefault()
    const inputValue = document.querySelector('#input').value.trim();

    if(!inputValue){InsertCountryMessage(); return}

    try{
        fetchApi(inputValue);
    }catch(e){
        console.log("Error al abtener el país.");
    }

});


const setQueryParam = (key, value) => {

    const url = new URL(window.location);
    url.searchParams.set(key, value); // Agregar o actualizar el parámetro
    window.history.pushState({}, "", url); // Modifica la URL sin recargar

};

const getQueryParam = (key) => {

    const params = new URLSearchParams(window.location.search);
    return params.get(key);

};

const fetchApi = async (inputValue) =>{

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=8d962f9cbfac0dd4e9906da705f40542`);
        if(!res.ok) throw new Error(countryNotFoundMessage(inputValue));

        const data = await res.json();

        setQueryParam(queryParamKey, data.name)
        searchCountry(data);
    }
    catch(e){
        console.log("⚠️ Error:", e.message);
    }

}

const searchCountry = (data) =>{

    const countryData = data.name;
    const climateData = data.weather[0].main;
    const tempData = data.main.temp - 273.15;
    const tempMaxData = data.main.temp_max - 273.15;
    const tempMinData = data.main.temp_min - 273.15;

    const local = JSON.parse(localStorage.getItem("countries"));
    const itsAlreadyInLocalStorage = local?.some((country) => country === data.name); 
    // condicional ternario 
    // const pepe = local ? true : false

    // if (local) {
    //     return true
    // } else {
    //     return false
    // }
    if(itsAlreadyInLocalStorage) {
        star.classList.add('readyFav');
    } else {
        star.classList.remove('readyFav');
    }

    const countryHeader = document.querySelector('#country');
    countryHeader.textContent = countryData;

    const queryClimate = document.querySelector('#climate');
    queryClimate.textContent = `${climateData}`;
    const climateIMG = document.querySelector('.climateImg');
    climateIMG.innerHTML = `<img src="ClimateImg/${climateData}.png" alt="">`;

    const queryTemp = document.querySelector('#temp');
    queryTemp.textContent = `${Math.round(tempData)}°C`;
    const queryTempMax = document.querySelector('#tempMax');
    queryTempMax.textContent = `${Math.round(tempMaxData)}°C`;
    const queryTempMin = document.querySelector('#tempMin');
    queryTempMin.textContent = `${Math.round(tempMinData)}°C`;




}

star.addEventListener("click", ()=>{

    const countryName = getQueryParam(queryParamKey);
    star.classList.toggle("readyFav");

    if(star.classList.contains("readyFav")){
        favorite(countryName);
    }   
    if(!star.classList.contains("readyFav")){
        removeFavorite(countryName);
    }

});

const favorite = (fav) =>{

    let favorites = JSON.parse(localStorage.getItem("countries")) || [];
    if(!favorites.includes(fav)){
        favorites.push(fav);
        localStorage.setItem("countries", JSON.stringify(favorites));   
        document.querySelector('#fav').classList.add("readyFav");
    }    
    renderFavorites();

}

const removeFavorite = (remove) =>{

    const countryRemove = remove;
    let favorites = JSON.parse(localStorage.getItem("countries")) || [];

    favorites = favorites.filter(country => country !== countryRemove);

    localStorage.setItem("countries", JSON.stringify(favorites));    
    renderFavorites();
}

const renderFavorites = () => {

    const favorites = JSON.parse(localStorage.getItem("countries")) || [];
    document.querySelector('.favList').innerHTML = favorites
    .map(country => `<li class="li-item">${country}</li>`)    
    .join("");

    document.querySelectorAll('.li-item').forEach(li =>{
        li.addEventListener('click', () =>{
            const liValue = li.textContent;
            fetchApi(liValue)
        });
    });

    checkFavorites();
    
}


const checkFavorites = () =>{
    
    const favorites = JSON.parse(localStorage.getItem("countries")) || [];
    const favSection = document.querySelector('.favSection');
    
    if(favorites.length === 0) favSection.style.display = "none";
    else favSection.style.display = "block";
    
}

const countryNotFoundMessage = (inputValue) =>{

    notFoundDiv.innerHTML = `<p class="notFoundMessage">El país <span class="notFoundValue">"${inputValue}"</span> no existe.</p>`;
    notFoundDiv.classList.remove("hidden");
    setTimeout(()=>{
        notFoundDiv.classList.add("hidden");
    },3500);
    
}

const InsertCountryMessage = () =>{

notFoundDiv.innerHTML = `Por favor ingrese un país.`;
notFoundDiv.classList.remove("hidden");
setTimeout(()=>{
    notFoundDiv.classList.add("hidden");
},3500)

}




renderFavorites()



    // document.querySelector('#formSearch').addEventListener("submit", (e) =>{
    // if(e.key === "Enter") {
    //     const inputValue = input.value.trim();
    //     if(inputValue === "") {
    //         console.log("Por favor Ingrese un país.");
    //         return;
    //     }
    //     try{
    //         fetchApi(inputValue);
    //     }
    //     catch (error) {
    //         console.log("Error al obtener el país.");
    //     }
    // }
    //}


    // section.innerHTML = `
    //                 <h1 id="country">${country}</h1>
    //                 <div class="climateData">
    //                     <div class="climateBox">
    //                         <p id="climate">${data.weather[0].main}</p>
    //                         <p id="temp">${Math.round(temp) + "°C"}</p>
    //                     </div>
    //                     <div class="climateImg">
    //                         <img src="ClimateImg/Climate/cloud.png" alt="">
    //                     </div>
    //                 </div>

    //                 <div class="minmaxTemp">
    //                     <div class="max flex"><p>Temp max</p><span id="tempMax">${Math.round(tempMax)} °C</span></div>
    //                     <div class="line"></div>
    //                     <div class="min flex"><p>Temp min</p><span id="tempMin">${Math.round(tempMin)} °C</span></div>
    //                 </div>
    // `;