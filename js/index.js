const URL = 'https://api.thecatapi.com/v1/images/search?limit=15&order=Desc'

const tabBtns = document.querySelectorAll('.navigation__btn')
const moreBtn = document.querySelector('.more-btn')
const contentBlock = document.querySelector('.content__list')


const dataArr = []
const dataLikesArr = []

let tabBtn = 'all'
let page = 0

const getData = async () => {
    await fetch(URL + '&page=' + page)
        .then(response => response.json())
        .then(json => {
            json.forEach(item => dataArr.push(item))
            return dataArr
        })

        return dataArr
}

const getLocalStorage = () => {
    if (localStorage.getItem('likes') && localStorage.getItem('likes').length > 0) {
        const likesArr = JSON.parse(localStorage.getItem('likes'))

        likesArr.forEach(item => {
            dataLikesArr.push(item)
        })
    }
}

const addToLocalStorage = (id) => {
    dataArr.forEach(item => {
        if (item.id === id) {
            dataLikesArr.push(item)
        }
    })
    
    localStorage.setItem('likes', JSON.stringify(dataLikesArr))
}

const deleteToLocalStorage = (id) => {
    dataLikesArr.forEach((item, index) => {
        if (item.id === id) {
            dataLikesArr.splice(index, 1)
        }
    })
    
    localStorage.setItem('likes', JSON.stringify(dataLikesArr))
}

const tabsHandler = () => {
    tabBtns.forEach(tab => {
        tab.addEventListener('click', () => {
            tabBtns.forEach(tab => {
                tab.classList.remove('active')
            })
            tab.classList.add('active')

            if (tab.dataset.category === 'likes') {
                tabBtn = 'likes'
                renderLikesCards()
                moreBtn.style.display = 'none'
            }

            if (tab.dataset.category === 'all') {
                tabBtn = 'all'
                renderCards()
                moreBtn.style.display = 'block'
            }
        })
    })
}

const createCard = (card, like) => {
    const {url, id} = card
    const liElem = document.createElement('li')
    liElem.classList.add('contenet__item')

    liElem.innerHTML = `
        <img src="${url}" alt="Кошка" class="content__item-img" data-id=${id}>
        <div class="content__item-icon ${like ? 'content__item-icon--active' : ''}" data-like="${like}"></div>
    `
    return liElem
}

const renderCards = () => {
    contentBlock.textContent = ''
    let flag = true

    dataArr.forEach(card => {
        for (let i = 0; i < dataLikesArr.length; i++) {
            if (dataLikesArr[i].id === card.id) {
                contentBlock.append(createCard(card, true))
                flag = false
                break
            } else {
                flag = true
            }
        }
        
        if (flag) {
            contentBlock.append(createCard(card, false))
        }
    })
}

const renderLikesCards = () => {
    contentBlock.textContent = ''
    dataLikesArr.forEach(card => contentBlock.append(createCard(card, true)))
}

const likesHandler = (evt) => {
    const target = evt.target

    if (target.classList.contains('content__item-icon')) {
        const id = target.closest('.contenet__item').querySelector('.content__item-img').dataset.id

        if (target.dataset.like === 'true') {
            target.dataset.like = false
            target.classList.remove('content__item-icon--active')
            deleteToLocalStorage(id)

            if (tabBtn === 'likes') {
                renderLikesCards()
            }
            
        } else {
            target.dataset.like = true
            target.classList.add('content__item-icon--active')
            addToLocalStorage(id)
        }
    }
}

const init = async () => {
    await getData()
    getLocalStorage()
    tabsHandler()
    renderCards()
}

moreBtn.addEventListener('click', async () => {
    page++
    await getData()
    renderCards()
})

contentBlock.addEventListener('click', (evt) => {
    likesHandler(evt)
})

init()