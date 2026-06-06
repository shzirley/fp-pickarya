import { FiHeart } from "react-icons/fi"
import { FaHeart } from "react-icons/fa"

const LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  professional: "Professional",
}

function ArtistCard({
  artist,
  openDetail,
  selectedCategories = [],
  showLikeButton = false,
  isLiked = false,
  onToggleLike = () => {},
}) {
  const artistCoverImage =
    artist.coverImageUrl ||
    artist.portfolioPages?.[0]?.imageUrl ||
    (typeof artist.portfolio?.[0] === "string" ? artist.portfolio[0] : "")

  return (
    <div
      onClick={() => openDetail(artist)}
      className="cursor-pointer"
    >

      <div className="relative w-[570px] h-[280px] border-[3px] border-black rounded-[28px] overflow-hidden bg-white">
  {showLikeButton && (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onToggleLike(artist)
      }}
      className="absolute top-5 right-5 z-10"
      aria-label="Sukai portofolio"
    >
      {isLiked ? (
        <FaHeart className="text-[28px] text-black" />
      ) : (
        <FiHeart className="text-[30px] text-black" />
      )}
    </button>
  )}

  {artistCoverImage && (
    <img
      src={artistCoverImage}
      alt={`Portofolio ${artist.name}`}
      className="w-full h-full object-contain"
    />
  )}
</div>

      <div className="mt-2 px-5 w-full">
  <div className="flex items-start justify-between w-full">
    <div className="min-w-0">
      <p className="text-[20px] font-semibold leading-[28px]">
        {artist.name}
      </p>

      <div className="flex gap-3 mt-0 flex-wrap">
        {(artist.tags || []).map((tag) => {
          const highlighted = selectedCategories.includes(tag)

          return (
            <span
              key={tag}
              className={highlighted ? "bg-yellow-500" : ""}
            >
              #{String(tag).replace("#", "").toLowerCase()}
            </span>
          )
        })}
      </div>
    </div>

    <p className="text-[18px] text-[#777777] shrink-0 text-right ml-6">
      {LEVEL_LABELS[artist.level] || artist.level}    
    </p>
  </div>
</div>

    </div>
  )
}

export default ArtistCard