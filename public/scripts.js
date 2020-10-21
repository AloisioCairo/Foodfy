/* Membros - Lógica do menu ativo */
const currentPage = location.pathname
const menuItens = document.querySelectorAll("header .links a")

for (item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add('active')
    }
}

function paginate (selectedPage, totalPages){    
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
        if (String(page).includes("...")){
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

// Função para adicionar um novo componente input para os ingredientes
function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}
  
document
    .querySelector(".add-ingrediente")
    .addEventListener("click", addIngredient);


// Função para adicionar um novo componente input para os modos de preparo
function addModoPreparo() {
    const modosPreparo = document.querySelector("#modosPreparo");
    const fieldContainer = document.querySelectorAll(".modoPreparo");
    
    // Realiza um clone do último modo de prepato adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
    
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
    
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    modosPreparo.appendChild(newField);
}
        
document
    .querySelector(".add-modo-preparo")
    .addEventListener("click", addModoPreparo);






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