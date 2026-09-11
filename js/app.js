const API_URL = 'https://rickandmortyapi.com/api';

const charactersContainer = document.getElementById('characters');
const paginationContainer = document.getElementById('pagination');
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const apiStatus = document.getElementById('apiStatus');

let currentPage = 1;
let currentSearch = '';

async function getCharacters(page = 1, name = '') {

    showLoading();

    let url = `${API_URL}/character?page=${page}`;

    if (name.trim() !== '') {
        url += `&name=${encodeURIComponent(name.trim())}`;
    }

    try {

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    info: {
                        pages: 0
                    },
                    results: []
                };
            }

            throw new Error('Erro ao consultar a API.');
        }

        return await response.json();

    } catch (error) {

        showError(
            'Não foi possível conectar à API do Rick and Morty.'
        );

        throw error;

    } finally {

        hideLoading();

    }
}

async function loadCharacters(page = 1, name = '') {

    try {

        const data = await getCharacters(page, name);

        currentPage = page;
        currentSearch = name;

        renderCharacters(data.results);
        renderPagination(data.info);

        apiStatus.textContent = 'API online';

    } catch (error) {

        charactersContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        apiStatus.textContent = 'API offline';
    }
}

function renderCharacters(characters) {

    if (!characters.length) {

        charactersContainer.innerHTML = `
            <div class="empty">
                <h2>Nenhum personagem encontrado</h2>
                <p>Tente pesquisar por outro nome.</p>
            </div>
        `;

        return;
    }

    charactersContainer.innerHTML = characters.map(character => {

        const statusClass = getStatusClass(character.status);

        return `
            <a
                href="character.html?id=${character.id}"
                class="character-card"
            >

                <img
                    src="${character.image}"
                    alt="${escapeHtml(character.name)}"
                    loading="lazy"
                >

                <div class="character-info">

                    <h2>
                        ${escapeHtml(character.name)}
                    </h2>

                    <div class="status">
                        <span class="status-dot ${statusClass}"></span>

                        ${escapeHtml(character.status)}
                    </div>

                    <p>
                        ${escapeHtml(character.species)}
                    </p>

                </div>

            </a>
        `;

    }).join('');
}

function renderPagination(info) {

    if (!info || !info.pages || info.pages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let html = '';

    if (currentPage > 1) {

        html += `
            <button onclick="changePage(${currentPage - 1})">
                ← Anterior
            </button>
        `;
    }

    html += `
        <span>
            Página ${currentPage} de ${info.pages}
        </span>
    `;

    if (currentPage < info.pages) {

        html += `
            <button onclick="changePage(${currentPage + 1})">
                Próxima →
            </button>
        `;
    }

    paginationContainer.innerHTML = html;
}

function changePage(page) {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    loadCharacters(page, currentSearch);
}

searchForm.addEventListener('submit', function(event) {

    event.preventDefault();

    const name = searchInput.value.trim();

    loadCharacters(1, name);
});

function getStatusClass(status) {

    switch (status.toLowerCase()) {

        case 'alive':
            return 'alive';

        case 'dead':
            return 'dead';

        default:
            return 'unknown';
    }
}

function showLoading() {

    loading.classList.remove('hidden');
    errorContainer.classList.add('hidden');
}

function hideLoading() {

    loading.classList.add('hidden');
}

function showError(message) {

    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
}

function escapeHtml(value) {

    const div = document.createElement('div');

    div.textContent = value;

    return div.innerHTML;
}

loadCharacters();