const formulario = document.getElementById("formulario");
const titulo = document.getElementById("titulo");
const tipo = document.getElementById("tipo");
const status = document.getElementById("status");
const imagem = document.getElementById("imagem");
const cards = document.getElementById("cards");
const buscar = document.getElementById("buscar");
const botaoAdicionar = document.getElementById("adicionar");
const cancelarEdicao = document.getElementById("cancelarEdicao");

let filmes_series = [];
let filmeEditando = null;

const filmesSalvos = localStorage.getItem("filmes_series");

botaoAdicionar.addEventListener("click", () => {
    formulario.style.display = "flex";
});

cancelarEdicao.addEventListener("click", () => {
    formulario.reset();
    document.querySelectorAll('input[name="avaliacao"]')
        .forEach((estrela) => {
            estrela.checked = false;
        });

    filmeEditando = null;
    formulario.style.display = "none";

});

function mostrarCards(lista = filmes_series) {
    cards.innerHTML = "";
    lista.forEach((filme) => {
        cards.innerHTML += `
            <div class="card">
                <img src="${filme.imagem || 'https://placehold.co/380x570?text=Sem+Imagem'}" alt="Poster">
                <div class="card-conteudo">
                    <h3>${filme.titulo}</h3>
                    <p class="estrelas">${"★".repeat(filme.avaliacao)}</p>
                    <p class="tipo">${filme.tipo}</p>
                    <span class="status">${filme.status}</span>
                    <div class="card-botoes">
                        <button 
                            class="editar"
                            onclick="editarFilme(${filme.id})"
                        >Editar</button>

                        <button 
                            class="excluir"
                            onclick="excluirFilmeSerie(${filme.id})"
                        >Excluir</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function excluirFilmeSerie(id) {
    filmes_series = filmes_series.filter(
        (filme) => filme.id !== id
    );
    localStorage.setItem("filmes_series", JSON.stringify(filmes_series));
    mostrarCards();
}

function editarFilme(id) {
    const filme = filmes_series.find(
        (filme) => filme.id === id
    );

    titulo.value = filme.titulo;
    tipo.value = filme.tipo;
    status.value = filme.status;
    imagem.value = filme.imagem;

    const estrela = document.querySelector(`input[name="avaliacao"][value="${filme.avaliacao}"]`);

    if (estrela) {
        estrela.checked = true;
    }

    filmeEditando = id;
    formulario.style.display = "flex";
}

if (filmesSalvos) {
    filmes_series = JSON.parse(filmesSalvos);
    mostrarCards();
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const avaliacao = document.querySelector(
        'input[name="avaliacao"]:checked'
    );

    const novoFilme = {
        id: Date.now(),
        titulo: titulo.value,
        tipo: tipo.value,
        status: status.value,
        imagem: imagem.value,
        avaliacao: avaliacao ? Number(avaliacao.value) : 0
    };

    if (filmeEditando) {

        const index = filmes_series.findIndex(
            (filme) => filme.id === filmeEditando
        );

        filmes_series[index] = {
            ...novoFilme,
            id: filmeEditando
        };

        filmeEditando = null;

    } else {
        filmes_series.push(novoFilme);
    }

    localStorage.setItem("filmes_series", JSON.stringify(filmes_series));

    mostrarCards();
    formulario.reset();

    document.querySelectorAll('input[name="avaliacao"]')
        .forEach((estrela) => {
            estrela.checked = false;
        });

    formulario.style.display = "none";
});

buscar.addEventListener("input", () => {
    const texto = buscar.value.toLowerCase();
    const filmesFiltrados = filmes_series.filter((filme) => {
        return filme.titulo.toLowerCase().includes(texto);
    });
    mostrarCards(filmesFiltrados);
});