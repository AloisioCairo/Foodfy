
/* Membros - Lógica do menu ativo */
const currentPage = location.pathname
const menuItens = document.querySelectorAll("header .links a")

for (item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add('active')
    }
}

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) { // Está aplicado filtro/pesquisa na tela
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}




// Função para mostrar/esconder os itens da receita
function mostrarEsconderItemReceita() {
    const buttons = document.querySelectorAll('.buttonIngrediente')
    const infos = document.querySelectorAll('#itemIngredienteReceita')

    for (let button of buttons) {
        button.addEventListener('click', function () {

            if (button.innerHTML === 'ESCONDER') {
                button.innerHTML = 'MOSTRAR'
            } else {
                button.innerHTML = 'ESCONDER'
            }
        })
    }

    for (const button in buttons) {
        buttons[button].addEventListener('click', function () {
            if (infos[button].classList.contains('hide')) {
                infos[button].classList.remove('hide')
            } else {
                infos[button].classList.add('hide')
            }
        })
    }
}

document
    .querySelector(".ingrediente")
    .addEventListener("click", mostrarEsconderItemReceita);



// Função para mostrar/esconder os modos de preparo da receita
function mostrarEsconderModoPreparoReceita() {
    const buttons = document.querySelectorAll('.buttonModoPreparo')
    const infos = document.querySelectorAll('.itemModoPreparoReceita')

    for (let button of buttons) {
        button.addEventListener('click', function () {

            if (button.innerHTML === 'ESCONDER') {
                button.innerHTML = 'MOSTRAR'
            } else {
                button.innerHTML = 'ESCONDER'
            }
        })
    }

    for (const button in buttons) {
        buttons[button].addEventListener('click', function () {
            if (infos[button].classList.contains('hide')) {
                infos[button].classList.remove('hide')
            } else {
                infos[button].classList.add('hide')
            }
        })
    }
}

document
    .querySelector(".modoPreparo")
    .addEventListener("click", mostrarEsconderModoPreparoReceita);


// Função para mostrar/esconder as informações adicionais da receita
function mostrarEsconderInfoAdcReceita() {
    const buttons = document.querySelectorAll('.buttonInfoAdicional')
    const infos = document.querySelectorAll('.dados')

    for (let button of buttons) {
        button.addEventListener('click', function () {

            if (button.innerHTML === 'ESCONDER') {
                button.innerHTML = 'MOSTRAR'
            } else {
                button.innerHTML = 'ESCONDER'
            }
        })
    }


    for (const button in buttons) {
        buttons[button].addEventListener('click', function () {
            if (infos[button].classList.contains('hide')) {
                infos[button].classList.remove('hide')
            } else {
                infos[button].classList.add('hide')
            }
        })
    }

}

document
    .querySelector(".InformacaoAdicional")
    .addEventListener("click", mostrarEsconderInfoAdcReceita);




/* Modal
const receita = document.querySelectorAll(".receita")
const modal = document.querySelector("#modal")
const close = document.querySelector("#modal .footer a")

for (let a = 0; a < receita.length; a++) {
    receita[a].addEventListener("click", () => {
        modal.classList.remove("hide")
    })
}

close.addEventListener("click", () => {
    modal.classList.add("hide")
})

let imgReceita = document.querySelectorAll(".imgReceita")
let tituloReceita = document.querySelectorAll(".tituloReceita")
let autorReceita = document.querySelectorAll(".autorReceita")

let imgModal = document.querySelector("#imgModal")
let tituloModal = document.querySelector("#modal h1")
let autorModal = document.querySelector("#modal .autorReceita")

for (let i = 0; i < receita.length; i++) {
    imgReceita[i].addEventListener('click', function(){

        imgModal.setAttribute('src', imgReceita[i].getAttribute('src'));
        tituloModal.innerHTML = tituloReceita[i].innerHTML;
        autorModal.innerHTML = autorReceita[i].innerHTML;
    });
}
*/