const api_search = "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=%22"

const normal_api = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1"

const image_url = "https://image.tmdb.org/t/p/w1280"

const search_container = document.getElementById("search");

const main_container = document.querySelector("#main");

const loading_container = document.querySelector("#loading-container")
let mode = 0;

let page = 1;

let last_page = 1;
let query = "";

const getData  = async ()=>{

	fetch("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1")
	.then(getData=>getData.json())
	.then(data=>{
		main_container.innerHTML = ""
		for (movie of data.results) {
			create_section(movie)
		}

	})
}




const create_section = (object)=>{
	
	const sec = document.createElement("div");
	console.log(object)
	sec.className = "container";
	sec.innerHTML = 
	`
	<img src="${image_url}${object.poster_path}" alt="">
	<div class="title-rating-conatainer">
		<div class="title">${object.original_title}</div>
		<div class="rating">${object.vote_average}</div>
	</div>
	<div class="description" >${object.overview}</div>
	`
	main_container.appendChild(sec);
}



const search = async (query)=>{
	const search_url = api_search + query;
	const getData = await fetch(search_url);
	const data = await getData.json()
	console.log(data);
	main_container.innerHTML = "";

	for (movie of data.results) {
		create_section(movie)
	}
}


search_container.addEventListener("input",()=>{
	const value = search_container.value;
	if (value == "")
	{
		main_container.innerHTML = ""
		getData()
		mode = 0;
		page = 1;
		last_page = 1;
	}
	else
	{
		main_container.innerHTML = ""
		search(value);
		mode = 1;
		page = 1;
		last_page = 1;
		query = value;
	}
})


getData()

// const body_margin = parseInt(document.body.computedStyleMap().get("margin-top").toString().slice(0,-2));
window.onscroll = ()=>{

	
	const scroll_bottom = document.documentElement.offsetHeight - (document.documentElement.scrollTop + window.innerHeight);
	if (scroll_bottom >= 0 && scroll_bottom <= 20 && page == last_page)
	{
		last_page+= 1;
		loading_container.style.visibility = "visible"
		if (mode == 0)
		{
			fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=${last_page}`)
			.then(getData=>getData.json())
			.then(data=>{
				for (movie of data.results) {
					create_section(movie);
					
				}
				page = last_page;
				loading_container.style.visibility = "hidden"

		
			})
		}
		else
		{
			fetch(`https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=%22${query}&page=${last_page}`)
			.then(getData=>getData.json())
			.then(data=>{
				for (movie of data.results) {
					create_section(movie);
				}
				page = last_page;
				loading_container.style.visibility = "hidden"
			})
		}

	}
}