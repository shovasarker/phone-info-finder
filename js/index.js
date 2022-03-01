let phonesInfo = []

const getSearchText = (searchFieldId) => {
  const searchField = document.getElementById(searchFieldId)
  const searchText = searchField.value
  searchField.value = ''
  return searchText ? searchText : -1
}

//getting Dynamic url from parameters
const getfetchUrl = (searchId, search = false) => {
  const baseUrl = 'https://openapi.programming-hero.com/api/phone'
  return (fetchUrl = `${baseUrl}${search ? 's?search=' : '/'}${searchId}`)
}

const fetchPhoneInfo = async (fetchUrl) => {
  try {
    const res = await fetch(fetchUrl)
    const result = await res.json()
    console.log(result)
    return result.data
  } catch (error) {
    console.log(error)
  }
}

const searchPhoneDetails = (phoneId) => {
  const fetchUrl = getfetchUrl(phoneId)
  console.log(fetchUrl)
}

// const removeChilds = (container) => {
//   console.log(container.childNodes)
//   container?.childNodes?.forEach((child) => container?.removeChild(child))
// }

const displayPhoneInfo = (phones, showAll = false) => {
  const cardContainer = document.getElementById('card-container')
  //   removeChilds(cardContainer)
  cardContainer.textContent = ''
  let filteredPhones = []
  filteredPhones = showAll ? phones : phones?.filter((phone, i) => i < 20)
  console.log(phones)
  console.log(filteredPhones)
  filteredPhones.forEach((phone) => {
    const { brand, image, phone_name, slug } = phone
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
            <div class='card__img-container'>
                <img src="${image}" alt='Picture of ${phone_name}' />
            </div>
            <h2 class='card__title'>${phone_name}</h2>
            <h4 class='card__brand-name'>${brand}</h4>
            <button class='custom-btn' onclick="searchPhoneDetails('${slug}')">View Details</button>
        `
    cardContainer.appendChild(div)
  })
  !showAll && phones.length > 20
    ? document.getElementById('show-all-btn').classList.remove('hidden')
    : document.getElementById('show-all-btn').classList.add('hidden')
}

const searchPhone = async () => {
  const searchText = getSearchText('search-field')
  if (searchText === -1) {
    //display error message
    return
  }
  const fetchUrl = getfetchUrl(searchText?.toLowerCase(), true)
  phonesInfo = await fetchPhoneInfo(fetchUrl)
  const heading = document.getElementById('search-result-header')
  phonesInfo.length > 0
    ? (heading.innerText = `Search Result For "${searchText}"`)
    : (heading.innerText = `No Result Found For "${searchText}"`)

  displayPhoneInfo(phonesInfo)
}

const showAllSearchResults = () => {
  displayPhoneInfo(phonesInfo, true)
}
