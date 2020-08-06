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







/* Modal */
let receita = document.querySelectorAll(".receita")
let imgReceita = document.querySelector(".receita a .imgReceita")
const modal = document.querySelector("#modal")
let imgModal = document.querySelector("#imgModal")
const close = document.querySelector("#modal .footer a")
let srcVal="";

//console.log('1' + receita.getAttribute('class'));
for (let a = 0; a < receita.length; a++) {

    console.log('for' + a + '_' + receita[a]);
        
    receita[a].addEventListener("click", () => {
        modal.classList.remove("hide")
    })

/*       
    close[a].addEventListener("click", () => {
        modal.classList.add("hide")
    })
    */
}

/* OK
receita.addEventListener("click", () => {
    modal.classList.remove("hide")
})

close.addEventListener("click", () => {
        modal.classList.add("hide")
})
*/
close.addEventListener("click", () => {
    modal.classList.add("hide")
})

//console.log('imgReceita = ' + imgReceita.getAttribute('src'));
for (let i = 0; i < imgReceita.length; i++) {
    console.log('for');

    imgReceita[i].addEventListener('click', function(){
        
        srcVal = imgReceita[i].getAttribute('src');
        console.log('srcVal = ' + srcVal);
        imgModal.setAttribute('src', srcVal);
    });
}