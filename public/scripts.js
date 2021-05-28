
// Função para adicionar um novo componente input para os ingredientes
console.log(".add-ingrediente")
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

console.log("1__.add-ingrediente")



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

console.log("2__.add-modo-preparo")

/* Membros - Lógica do menu ativo */
const currentPage = location.pathname
const menuItens = document.querySelectorAll("header .links a")

for (item of menuItens) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add('active')
    }
}



const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event))
            return

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file) /* Carrega todas as imagens para dentro de um array */

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image() // Tem a mesma função de criar a tag <img>
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()

            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton()) // Adc. o botão de remover a imagem

        return div // Retorna a <div> com a imagem
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
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



// Altera a imagem principal da receita na página "show.njk" de receitas do paínel administrativo
const alteraImagemGaleria = {
    galeria: document.querySelector('.recipe .galeriaImgReceita > img'),
    previews: document.querySelectorAll('.recipe .galeriaImgReceita .previewImgReceita img'),
    alteraImage(e) {
        const { target } = e

        alteraImagemGaleria.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        alteraImagemGaleria.galeria.src = target.src
    }
}



// Função para mostrar/esconder os itens da receita
function mostrarEsconderItemReceita() {
    const buttons = document.querySelectorAll('.buttonIngrediente')
    const infos = document.querySelectorAll('.itemIngredienteReceita')

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






// // Função para adicionar um novo componente input para os ingredientes
// console.log(".add-ingrediente")
// function addIngredient() {
//     const ingredients = document.querySelector("#ingredients");
//     const fieldContainer = document.querySelectorAll(".ingredient");

//     // Realiza um clone do último ingrediente adicionado
//     const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

//     // Não adiciona um novo input se o último tem um valor vazio
//     if (newField.children[0].value == "") return false;

//     // Deixa o valor do input vazio
//     newField.children[0].value = "";
//     ingredients.appendChild(newField);
// }

// document
//     .querySelector(".add-ingrediente")
//     .addEventListener("click", addIngredient);

// console.log("1__.add-ingrediente")



// // Função para adicionar um novo componente input para os modos de preparo
// function addModoPreparo() {
//     const modosPreparo = document.querySelector("#modosPreparo");
//     const fieldContainer = document.querySelectorAll(".modoPreparo");

//     // Realiza um clone do último modo de prepato adicionado
//     const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

//     // Não adiciona um novo input se o último tem um valor vazio
//     if (newField.children[0].value == "") return false;

//     // Deixa o valor do input vazio
//     newField.children[0].value = "";
//     modosPreparo.appendChild(newField);
// }

// document
//     .querySelector(".add-modo-preparo")
//     .addEventListener("click", addModoPreparo);

// console.log("2__.add-modo-preparo")



































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