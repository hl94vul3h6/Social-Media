const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const medias = JSON.parse(localStorage.getItem('favorites')) || []

const dataPanel = document.querySelector('#data-panel')

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
        <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML

}

// function addToFavorite(id) {
//   const list = JSON.parse(localStorage.getItem('favorites')) || []
//   const person = medias.find((media) => media.id === id)
//   if (list.some((person) => person.id === id)) {
//     return alert('此人已經在最愛清單中!')
//   }
//   list.push(person)
//   localStorage.setItem('favorites', JSON.stringify(list))
// }

function showSocialModal(id) {
  const modalEmail = document.querySelector('#social-email')
  const modalGender = document.querySelector('#social-gender')
  const modalAge = document.querySelector('#social-age')
  const modalRegion = document.querySelector('#social-region')
  const modalBirthday = document.querySelector('#social-birthday')

  modalEmail.innerHTML = ''
  modalGender.innerHTML = ''
  modalAge.innerHTML = ''
  modalRegion.innerHTML = ''
  modalBirthday.innerHTML = ''

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data
    modalEmail.innerHTML = `<div>email: ${data.email}</div>`
    modalGender.innerHTML = `<div>gender: ${data.gender}<div>`
    modalAge.innerHTML = `<div>age: ${data.age}</div>`
    modalRegion.innerHTML = `<div>region: ${data.region}</div>`
    modalBirthday.innerHTML = `<div>birthday: ${data.birthday}</div>`
  })


}

// searchForm.addEventListener('submit', function onSearchForSubmitted(event) {
//   event.preventDefault()
//   const keyword = searchInput.value.trim().toLowerCase()

//   let filteredPerson = []

//   if (!keyword.length) {
//     return alert('請輸入有效字串!')
//   }
//   filteredPerson = medias.filter((media) => media.name.toLowerCase().includes(keyword))
  
//   if(filteredPerson.length === 0) {
//     return alert(`您輸入的關鍵字: ${keyword} 沒有符合條件的人`)
//   }

//   renderSocialMedia(filteredPerson)


// })

function removeFromFavorite(id) {
  if (!medias || !medias.length) return
  const personIndex = medias.findIndex((media) => media.id === id)

  medias.splice(personIndex,1)

  localStorage.setItem('favorites', JSON.stringify(medias))

  renderSocialMedia(medias)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showSocialModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

axios.get(INDEX_URL).then((response) => {
  // medias.push(...response.data.results)
  renderSocialMedia(medias)
}).catch((err) => console.log(err))