/* Phone Search result Stored Globaly for Accessing 
Later to display all the results */
let phonesInfo = []

// Function for getting the searchText from the inpuit field
const getSearchText = (searchFieldId) => {
  const searchField = document.getElementById(searchFieldId)
  const searchText = searchField.value
  searchField.value = ''
  return searchText ? searchText : -1
}

// Functions for Show or hide any element
//-------------------------------------
const showElement = (elementId) => {
  document.getElementById(elementId).classList.remove('hidden')
}
const hideElement = (elementId) => {
  document.getElementById(elementId).classList.add('hidden')
}
//-----------------------------------------

//getting Dynamic url from parameters
const getfetchUrl = (searchId, search = false) => {
  const baseUrl = 'https://openapi.programming-hero.com/api/phone'
  return (fetchUrl = `${baseUrl}${search ? 's?search=' : '/'}${searchId}`)
}

//Function for fetching Data from the Api
const fetchPhoneInfo = async (fetchUrl) => {
  try {
    const res = await fetch(fetchUrl)
    const result = await res.json()
    return result.data
  } catch (error) {
    console.log(error)
  }
}

//Function for Displaying Phone Details
const displayPhoneDetails = (phone) => {
  //destructuring all the info the phone object
  const { name, brand, image, releaseDate, mainFeatures, others } = phone
  const { chipSet, displaySize, memory, sensors, storage } = mainFeatures
  const NO_INFO_FOUND = 'No Info Found'

  //Displaying information to the dom
  document.getElementById('phone-details-header').innerText = `${name} Details`
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

  //Hiding Spinner and Showing Phone details
  hideElement('spinner')
  showElement('phone-details')
}

//Searching for Phone Details
const searchPhoneDetails = async (phoneId) => {
  //Scrolling To the Top of the page
  window.scrollTo(0, 0)
  //Showing Spinner and Hiding any Previous Details
  showElement('spinner')
  !document.getElementById('phone-details').classList.contains('hidden') &&
    hideElement('phone-details')
  //creating and fetching data from the api
  const fetchUrl = getfetchUrl(phoneId)
  const phoneDetails = await fetchPhoneInfo(fetchUrl)
  displayPhoneDetails(phoneDetails)
}

//Function for Displaying Phone Search Result to the dom
const displayPhoneInfo = (phones, showAll = false) => {
  const cardContainer = document.getElementById('card-container')
  //Emptying or removing any previous children from the card container
  cardContainer.textContent = ''

  //filtering phone to show only 20 search results
  let filteredPhones = []
  filteredPhones = showAll ? phones : phones?.filter((phone, i) => i < 20)
  //Looping through the results and append each child to the cardContainer
  filteredPhones.forEach((phone) => {
    const { brand, image, phone_name, slug } = phone
    const div = document.createElement('div')
    div.classList.add('card')
    //an arrow right svg is added to the button
    div.innerHTML = `
            <div class='card__img-container'>
                <img src="${image}" alt='Picture of ${phone_name}' />
            </div>
            <h2 class='card__title'>${phone_name}</h2>
            <h4 class='card__brand-name'>${brand}</h4>
            <button class='custom-btn' onclick="searchPhoneDetails('${slug}')">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-3 h-3 inline-block ml-1 mb-0.5 fill-white ">
            <path d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"/>
            </svg>
            </button>
        `
    cardContainer.appendChild(div)
  })

  //hiding spinner and showing search results
  hideElement('spinner-result')
  showElement('search-result-container')

  //hiding or showing show all button
  !showAll && phones.length > 20
    ? showElement('show-all-btn')
    : hideElement('show-all-btn')
}

//function for searching phone results
const searchPhone = async () => {
  const searchText = getSearchText('search-field')
  //checking if the search string is empty or not
  if (searchText === -1) {
    //displaying error message to the dom
    document.getElementById(
      'error-message'
    ).innerText = `"Please Enter a Phone Name First"`
    return
  }
  //removing error message on non-empty search string
  document.getElementById('error-message').innerText = ''

  //showing spinner and hiding any previous results or phone details
  //---------------------------
  showElement('spinner-result')
  !document
    .getElementById('search-result-container')
    .classList.contains('hidden') && hideElement('search-result-container')
  !document.getElementById('phone-details').classList.contains('hidden') &&
    hideElement('phone-details')
  //----------------------------
  //Creating url and Fetching data from the api
  const fetchUrl = getfetchUrl(searchText?.toLowerCase(), true)
  phonesInfo = await fetchPhoneInfo(fetchUrl)
  const heading = document.getElementById('search-result-header')
  heading.innerText = `${
    phonesInfo.length > 0 ? 'Search Result For' : 'No Result Found For'
  } "${searchText}"`

  displayPhoneInfo(phonesInfo)
}

//function for displaying all the results to the dom
const showAllSearchResults = () => {
  displayPhoneInfo(phonesInfo, true)
}
//function for hiding phone details
const hidePhoneDetails = () => {
  hideElement('phone-details')
}
