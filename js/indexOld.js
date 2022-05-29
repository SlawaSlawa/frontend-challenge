// API: 5b4ee1ee-485b-4865-aad1-cd4d08edfee8
// https://api.thecatapi.com/v1/images/search?limit=15&page=1&order=Desc

const URL = 'https://api.thecatapi.com/v1/images/search?limit=15&order=Desc'
const tabBtns = document.querySelectorAll('.navigation__btn')
const moreBtn = document.querySelector('.more-btn')
const contentBlock = document.querySelector('.content__list')

let localArr
let dataArr
let page = 0

const init = () => {
    localStorage.getItem('likes') ? localArr = JSON.parse(localStorage.getItem('likes')) : localArr = []
    contentBlock.textContent = ''
    renderCards('all')
}

const getData = async () => {
    dataArr =  await fetch(URL + '&page=' + page)
        .then(response => response.json())
        .then(json => json)
    
    return dataArr
}

const createCard = (data) => {
    const {url, id} = data

    const card = document.createElement('li')
    card.classList.add('contenet__item')
    card.innerHTML = `
        <img src="${url}" alt="Кошка" class="content__item-img" data-id=${id}>
        <div class="content__item-icon"></div>
    `
    return card
}

const renderCards = async (flag) => {
    if (flag === 'likes') {
        contentBlock.textContent = ''

        localArr = JSON.parse(localStorage.getItem('likes'))
        if (localArr && localArr.length > 0) {
            localArr.forEach(item => {
                const card = createCard(item)
                contentBlock.append(card)
            })
        }else {
            contentBlock.textContent = 'Ещё нет любимых котиков'
        }
        
    } else if (flag === 'all'){
        console.log('all')
        const data = await getData()
        data.forEach(item => {
            const card = createCard(item)
            contentBlock.append(card)
        })
    }
}

const addToStorage = (id) => {
    console.log('add')
    dataArr.forEach(item => {
        if (item.id === id) {
            localArr.push(item)
        }        
    })
    
    localStorage.setItem('likes', JSON.stringify(localArr))
}

const deleteToStorage = (id) => {
    console.log('delete')
    localArr.forEach((item, index) => {
        if (item.id === id) {
            localArr.splice(index, 1)
        }        
    })
    
    localStorage.setItem('likes', JSON.stringify(localArr))
}

const tabsHandler = (btn) => {
    if (btn.dataset.cards === 'all') {
        renderCards('all')
    } else if (btn.dataset.cards === 'likes') {
        renderCards('likes')
    }
}

tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
        tabBtns.forEach(tabBtn => {
            tabBtn.classList.remove('active')
        })

        contentBlock.textContent = ''
        tab.classList.add('active')
        tabsHandler(tab)
        renderCards(tab.dataset.cards)
    })
})

moreBtn.addEventListener('click', () => {
    page++
    renderCards('all')
})

contentBlock.addEventListener('click', (evt) => {
    const target = evt.target
    
    if (target.classList.contains('content__item-icon')) {
        target.classList.toggle('content__item-icon--active')

        if (target.classList.contains('content__item-icon--active')) {
            addToStorage(target.previousElementSibling.dataset.id)
        } else {
            deleteToStorage(target.previousElementSibling.dataset.id)
        }
    }
})

init()