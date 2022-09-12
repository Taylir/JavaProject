// https://pokeapi.co/api/v2/pokemon/1
let promises = [];
let pokemonWants ={};
let pokemonWantsSearch ={};
const pokemonResultsEl = document.querySelector(`#results`);
let slider = document.querySelector(`.search__slider`)



async function pokemonDisplay(filter) {
    for(let i = 1; i <= 50; i++) {
        if( promises.length < 50) {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            let data = await response.json();
            promises.push(data);
        }
    }
     pokemonWants = promises.map(data => ({
        name: data.name,
        id: data.id,
        image: data.sprites.front_default,
        type: data.types.map(type => type.type.name).join(`, `),
        stats: data.stats.map(obj => obj.base_stat).reduce((x, y) => x + y, 0),
    }));
    
    pokemonWants.push({
            name: "magikarp",
            id: 999,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png`,
            type: `divine, god`,
            stats: 999,
    })

    if(filter === `LOW_TO_HIGH`) {
        pokemonWants.sort((a, b) => a.stats - b.stats )
    }
    else if(filter === `HIGH_TO_LOW`) {
        pokemonWants.sort((a, b) => b.stats - a.stats )
    }
    else if(filter === `ALPHABETICAL`) {
        pokemonWants.sort((a, b) => {
            if(a.name < b.name){
                return -1
            }
            if(a.name > b.name){
                return 1
            }
            else {
                return 0
            }
        })}
        pokemonResultsEl.innerHTML = pokemonHtml(pokemonWants);

        pokemonSearch();
}


function pokemonSearch(event) {
    let input = event.target.value;
    input = input.toLowerCase();
    let x = pokemonWants;

    for(let i = 0; i < x.length; i++) {
        if(x[i].name.includes(input)|| x[i].type.includes(input)) {
            pokemonWantsSearch = pokemonWants.filter(poke => poke.name.includes(input) || poke.type.includes(input))
            pokemonResultsEl.innerHTML = pokemonHtml(pokemonWantsSearch);
        }
    }
}

pokemonDisplay();

function showPokeInfo(id) {
    localStorage.setItem("id", id);
    window.location.href = `${window.location.origin}/pokemon.html`
}

function filterPokemon(event) {
    pokemonDisplay(event.target.value)
}

function pokemonHtml(arr) {
    return arr.map(data => {
        return `<div class="pokemon-card__wrapper" onclick="showPokeInfo(${data.id})">
        <figure class="pokemon__img--wrapper">
        <img class="pokemon__img" src=${data.image} alt="" />
        </figure>
        <h1 class="pokemon__name">${data.name}</h1>
        <h3 class="pokemon__type">${data.type}</h3>
        <p class="pokemon__stats">
        <b> Total Stats</b><br />
        ${data.stats}
        </p>
        </div>`
    }).splice(0,50).join("")
}


