let phonesInfo = []

const getSearchText = (searchFieldId) => {
  const searchField = document.getElementById(searchFieldId)
  const searchText = searchField.value
  searchField.value = ''
  return searchText ? searchText : -1
}

const showOrHideElement = (elementId) => {
  const element = document.getElementById(elementId)
  element.classList.contains('hidden')
    ? element.classList.remove('hidden')
    : element.classList.add('hidden')
}

const showElement = (elementId) => {
  document.getElementById(elementId).classList.remove('hidden')
}
const hideElement = (elementId) => {
  document.getElementById(elementId).classList.add('hidden')
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

const displayPhoneDetails = (phone) => {
  const { name, brand, image, releaseDate, mainFeatures, others } = phone
  const { chipSet, displaySize, memory, sensors, storage } = mainFeatures
  const NO_INFO_FOUND = 'No Info Found'

  document.getElementById('phone-image').src = image
  document.getElementById('phone-name').innerText = name
  document.getElementById('release-date').innerText = releaseDate
    ? releaseDate
    : NO_INFO_FOUND
  document.getElementById('brand').innerText = brand ? brand : NO_INFO_FOUND
  document.getElementById('chipset').innerText = chipSet
    ? chipSet
    : NO_INFO_FOUND
  document.getElementById('display-size').innerText = displaySize
    ? displaySize
    : NO_INFO_FOUND
  document.getElementById('memory').innerText = memory ? memory : NO_INFO_FOUND
  document.getElementById('storage').innerText = storage
    ? storage
    : NO_INFO_FOUND
  document.getElementById('sensors').innerText =
    sensors?.length > 0 ? sensors?.join(', ') : NO_INFO_FOUND
  const othersContainer = document.getElementById('others')
  othersContainer.innerHTML = `
    <span class="font-bold">Others:</span>
  `
  others
    ? Object.entries(others).forEach(([key, value]) => {
        const h3 = document.createElement('h3')
        h3.innerHTML = `
            ${key}: <span class='font-bold'>${
          value ? value : NO_INFO_FOUND
        }</span>
        `
        othersContainer.appendChild(h3)
      })
    : (othersContainer.innerHTML = `
        <h3>Others: <span class='font-bold'>${NO_INFO_FOUND}</span></h3>
    `)
  hideElement('spinner')
  showElement('phone-details')
}

const searchPhoneDetails = async (phoneId) => {
  showElement('spinner')
  !document.getElementById('phone-details').classList.contains('hidden') &&
    hideElement('phone-details')
  const fetchUrl = getfetchUrl(phoneId)
  const phoneDetails = await fetchPhoneInfo(fetchUrl)
  displayPhoneDetails(phoneDetails)
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
  hideElement('spinner-result')
  showElement('search-result-container')
  !showAll && phones.length > 20
    ? showElement('show-all-btn')
    : hideElement('show-all-btn')
}

const searchPhone = async () => {
  const searchText = getSearchText('search-field')
  if (searchText === -1) {
    document.getElementById(
      'error-message'
    ).innerText = `"Please Enter a Phone Name First"`
    return
  }
  document.getElementById('error-message').innerText = ''
  showElement('spinner-result')
  !document
    .getElementById('search-result-container')
    .classList.contains('hidden') && hideElement('search-result-container')
  !document.getElementById('phone-details').classList.contains('hidden') &&
    hideElement('phone-details')
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
