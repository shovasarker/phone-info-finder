const getSearchText = (searchFieldId) => {
  const searchField = document.getElementById(searchFieldId)
  const searchText = searchField.value
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
    return result.data
  } catch (error) {
    console.log(error)
  }
}

const displayPhoneInfo = (phones) => {}

const searchPhone = async () => {
  const searchText = getSearchText('search-field')
  if (searchText === -1) {
    //display error message
    return
  }
  const fetchUrl = getfetchUrl(searchText, true)
  const data = await fetchPhoneInfo(fetchUrl)
  displayPhoneInfo(data)
}
