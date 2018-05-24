import Storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEACH_MAX_LENGTH = 10

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function inseartArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function saveSearch (query) {
  let searches = Storage.get(SEARCH_KEY, [])
  inseartArray(searches, query, (item) => {
    return item === query
  }, SEACH_MAX_LENGTH)
  Storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch () {
  return Storage.get(SEARCH_KEY, [])
}

export function deleteSearch (query) {
  let searches = Storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  Storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  Storage.remove(SEARCH_KEY)
  return []
}

export function savePlay (song) {
  let songs = Storage.get(PLAY_KEY, [])
  inseartArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  Storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return Storage.get(PLAY_KEY, [])
}

export function saveFavorite (song) {
  let songs = Storage.get(FAVORITE_KEY, [])
  inseartArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  Storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite (song) {
  let songs = Storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  Storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return Storage.get(FAVORITE_KEY, [])
}
