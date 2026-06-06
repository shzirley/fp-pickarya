import { IoArrowBack } from "react-icons/io5"
import ArtistCard from "../components/ArtistCard"

function LikedPortfolioPage({
  isLoggedIn,
  likedArtists = [],
  openDetail,
  setCurrentPage,
  selectedCategories = [],
  isArtistLiked = () => false,
  toggleLikedArtist = () => {},
}) {
  return (
    <div className="px-[60px] pt-[140px] pb-[80px]">
      <button
        type="button"
        onClick={() => setCurrentPage("home")}
        className="flex items-center gap-4 text-[28px] mb-10"
      >
        <IoArrowBack className="text-[28px]" />
        <span>Favorite</span>
      </button>

      {!isLoggedIn ? (
        <p className="text-[22px] text-[#666666]">
          Login terlebih dahulu untuk melihat portofolio yang disukai.
        </p>
      ) : likedArtists.length === 0 ? (
        <p className="text-[22px] text-[#666666]">
          Tidak ada portofolio yang disukai
        </p>
      ) : (
        <div className="flex gap-[32px] flex-wrap">
          {likedArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              openDetail={openDetail}
              selectedCategories={selectedCategories}
              showLikeButton
              isLiked={isArtistLiked(artist)}
              onToggleLike={toggleLikedArtist}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LikedPortfolioPage