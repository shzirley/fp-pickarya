export function getUserDisplayName(user, fallbackName = "") {
  return user?.username || user?.name || fallbackName
}

export function getCurrentBuyerName(currentUser, defaultBuyer) {
  return getUserDisplayName(currentUser, defaultBuyer.name)
}

export function getCurrentArtistInfo({
  role = "buyer",
  currentUser = null,
  artists = [],
  defaultArtist,
}) {
  if (role !== "artist") {
    return defaultArtist
  }

  const artistName = getUserDisplayName(currentUser, defaultArtist.name)

  const matchedArtist = artists.find((artist) => artist.name === artistName)

  return {
    id: matchedArtist?.id || defaultArtist.id,
    name: artistName,
  }
}