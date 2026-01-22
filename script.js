const API_URL = 'https://pokeapi.co/api/v2';

// ==========================================
// 1. LOGIKA HALAMAN LIST
// ==========================================
if (document.getElementById('page-list')) {
    const container = document.getElementById('pokemon-container');
    const btnLoad = document.getElementById('btn-load');
    let offset = 0;
    const limit = 24;

    async function getPokemon() {
        try {
            const response = await axios.get(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
            if(offset === 0) container.innerHTML = ''; 
            renderList(response.data.results);
        } catch (error) { console.error(error); }
    }

    function renderList(list) {
        list.forEach(pokemon => {
            const id = pokemon.url.split('/')[6];
            const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            
            container.innerHTML += `
                <div class="col card-item">
                    <div class="card card-pokemon h-100 p-3 text-center" onclick="window.location.href='detail.html?id=${id}'">
                        <span class="position-absolute top-0 start-0 m-2 badge bg-light text-dark border">#${id}</span>
                        <img src="${image}" class="poke-img-list mx-auto" loading="lazy">
                        <h6 class="card-title text-capitalize fw-bold mb-0">${pokemon.name}</h6>
                    </div>
                </div>`;
        });
    }

    btnLoad.addEventListener('click', () => {
        offset += limit;
        getPokemon();
    });

    // Fitur Search (Filter Tampilan)
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        const keyword = e.target.value.toLowerCase();
        document.querySelectorAll('.card-item').forEach(card => {
            const name = card.querySelector('h6').innerText.toLowerCase();
            if(name.includes(keyword)) {
                card.classList.remove('d-none');
                card.classList.add('d-block');
            } else {
                card.classList.add('d-none');
                card.classList.remove('d-block');
            }
        });
    });

    getPokemon();
}

// ==========================================
// 2. LOGIKA HALAMAN DETAIL
// ==========================================
if (document.getElementById('page-detail')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) window.location.href = 'list.html';

    async function getDetail() {
        try {
            const response = await axios.get(`${API_URL}/pokemon/${id}`);
            const data = response.data;
            
            document.getElementById('poke-img').src = data.sprites.other['official-artwork'].front_default;
            document.getElementById('poke-name').innerText = data.name;
            document.getElementById('poke-height').innerText = (data.height / 10) + " m";
            document.getElementById('poke-weight').innerText = (data.weight / 10) + " kg";

            document.getElementById('poke-types').innerHTML = data.types.map(t => 
                `<span class="badge bg-primary me-1 px-3 py-2 rounded-pill text-capitalize">${t.type.name}</span>`
            ).join('');

            document.getElementById('stats-container').innerHTML = data.stats.map(s => {
                let colorClass = 'bg-danger';
                if (s.base_stat >= 80) colorClass = 'bg-success';
                else if (s.base_stat >= 50) colorClass = 'bg-warning';

                return `
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span class="small fw-bold text-uppercase">${s.stat.name}</span>
                            <span class="fw-bold">${s.base_stat}</span>
                        </div>
                        <div class="progress" style="height: 10px;">
                            <div class="progress-bar ${colorClass}" style="width: ${Math.min(s.base_stat, 100)}%"></div>
                        </div>
                    </div>`;
            }).join('');
        } catch (err) {
            document.getElementById('poke-name').innerText = "Error Data!";
        }
    }

    getDetail();
}

// ==========================================
// 3. LOGIKA HALAMAN CATEGORY
// ==========================================
if (document.getElementById('page-category')) {
    const container = document.getElementById('pokemon-container');
    const title = document.getElementById('category-title');

    window.getByType = async function(type) {
        title.innerText = `Kategori: ${type.toUpperCase()}`;
        container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>';

        try {
            const response = await axios.get(`${API_URL}/type/${type}`);
            renderCategory(response.data.pokemon);
        } catch (error) {
            container.innerHTML = '<p class="text-center text-danger">Gagal memuat data.</p>';
        }
    }

    function renderCategory(list) {
        container.innerHTML = '';
        const limitedList = list.slice(0, 24); 

        if(limitedList.length === 0) {
            container.innerHTML = '<div class="col-12 text-center alert alert-warning">Tidak ada pokemon.</div>'; return;
        }

        limitedList.forEach(item => {
            const pokemon = item.pokemon;
            const id = pokemon.url.split('/')[6];
            const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            container.innerHTML += `
                <div class="col">
                    <div class="card card-pokemon h-100 p-3 text-center" onclick="window.location.href='detail.html?id=${id}'">
                        <img src="${image}" class="poke-img-list mx-auto" loading="lazy">
                        <h6 class="card-title text-capitalize fw-bold mb-0">${pokemon.name}</h6>
                    </div>
                </div>`;
        });
    }
}