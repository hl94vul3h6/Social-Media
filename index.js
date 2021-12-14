const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const MEDIAS_PER_PAGE = 12
const medias = []
let filteredPerson = []

const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')

function renderSocialMedia(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `
    <div class="card" style="width: 18rem;">
      <img
        src="${item.avatar}"
        class="card-img-top" alt="tomcruz" data-bs-toggle="modal" data-bs-target="#social-modal" data-id="${item.id}">
      <div class="card-body">
        <p class="card-text">${item.name} ${item.surname}
        </p>
        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML

}

function getMediasByPage(page) {
  const data = filteredPerson.length ? filteredPerson : medias
  //計算起始 index 
  const startIndex = (page - 1) * MEDIAS_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MEDIAS_PER_PAGE)
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favorites')) || []
  const person = medias.find((media) => media.id === id)
  if (list.some((person) => person.id === id)) {
    return alert('此人已經在最愛清單中!')
  }
  list.push(person)
  localStorage.setItem('favorites', JSON.stringify(list))
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MEDIAS_PER_PAGE)
  //製作 template 
  let rawHTML = ''
  
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}
function showSocialModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const modalEmail = document.querySelector('#social-email')
  const modalGender = document.querySelector('#social-gender')
  const modalAge = document.querySelector('#social-age')
  const modalRegion = document.querySelector('#social-region')
  const modalBirthday = document.querySelector('#social-birthday')
  
  modalTitle.innerHTML = ''
  modalEmail.innerHTML = ''
  modalGender.innerHTML = ''
  modalAge.innerHTML = ''
  modalRegion.innerHTML = ''
  modalBirthday.innerHTML = ''

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data
    modalTitle.innerHTML = `<div>${data.name} ${data.surname}</div>`
    modalEmail.innerHTML = `<div>email: ${data.email}</div>`
    modalGender.innerHTML = `<div>gender: ${data.gender}<div>`
    modalAge.innerHTML = `<div>age: ${data.age}</div>`
    modalRegion.innerHTML = `<div>region: ${data.region}</div>`
    modalBirthday.innerHTML = `<div>birthday: ${data.birthday}</div>`
  })


}

searchForm.addEventListener('submit', function onSearchForSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  

  if (!keyword.length) {
    return alert('請輸入有效字串!')
  }
  filteredPerson = medias.filter((media) => media.name.toLowerCase().includes(keyword))
  
  if(filteredPerson.length === 0) {
    return alert(`您輸入的關鍵字: ${keyword} 沒有符合條件的人`)
  }
  renderPaginator(filteredPerson.length)
  renderSocialMedia(getMediasByPage(1))


})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showSocialModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderSocialMedia(getMediasByPage(page))
})

axios.get(INDEX_URL).then((response) => {
  medias.push(...response.data.results)
  renderSocialMedia(medias)
  renderSocialMedia(getMediasByPage(1))
  renderPaginator(medias.length)
}).catch((err) => console.log(err))