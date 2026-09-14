const API_URL = 'https://rickandmortyapi.com/api';

const characterContainer = document.getElementById('character');
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error');

async function loadCharacter() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get('id');

    if (!id) {
        showError('Personagem não informado.');
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/character/${id}`
        );

        if (!response.ok) {
            throw new Error('Personagem não encontrado.');
        }

        const character = await response.json();

        renderCharacter(character);

    } catch (error) {

        showError(
            'Não foi possível carregar o personagem.'
        );

    } finally {

        loading.classList.add('hidden');

    }
}

function renderCharacter(character) {

    document.title =
        `${character.name} - Rick & Morty`;

    characterContainer.innerHTML = `

        <article class="character-detail">

            <div class="character-image">

                <img
                    src="${character.image}"
                    alt="${escapeHtml(character.name)}"
                >

            </div>

            <div class="character-content">

                <h1>
                    <center>
                        ${escapeHtml(character.name)}
                    </center>
                </h1>

                <div class="detail-status">

                    <span
                        class="status-dot ${getStatusClass(character.status)}"
                    ></span>

                    ${escapeHtml(character.status)}

                </div>

                <div class="details">

                    <div class="detail-item">
                        <span>Espécie</span>
                        <strong>
                            ${escapeHtml(character.species)}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Gênero</span>
                        <strong>
                            ${escapeHtml(character.gender)}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Origem</span>
                        <strong>
                            ${escapeHtml(character.origin.name)}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Localização</span>
                        <strong>
                            ${escapeHtml(character.location.name)}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span>Episódios</span>
                        <strong>
                            ${character.episode.length}
                        </strong>
                    </div>

                </div>

            </div>

        </article>

    `;
}

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

function showError(message) {

    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');

    loading.classList.add('hidden');
}

function escapeHtml(value) {

    const div = document.createElement('div');

    div.textContent = value;

    return div.innerHTML;
}

loadCharacter();