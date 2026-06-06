import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

function ArtistPortfolioSlider({
  pages = [],
  currentIndex = 0,
  setCurrentIndex = () => {},
  className = "",
}) {
  const hasPages = pages.length > 0
  const currentPage = hasPages ? pages[currentIndex] : null
  const isFirstPage = currentIndex === 0
  const isLastPage = currentIndex === pages.length - 1

  const goPrev = () => {
    if (!hasPages || isFirstPage) return
    setCurrentIndex((prev) => prev - 1)
  }

  const goNext = () => {
    if (!hasPages || isLastPage) return
    setCurrentIndex((prev) => prev + 1)
  }

  return (
    <div
      className={`relative w-[534px] h-[243px] border-[3px] border-black rounded-[20px] overflow-hidden bg-white ${className}`}
    >
      {currentPage?.imageUrl && (
        <img
          src={currentPage.imageUrl}
          alt={`Halaman portofolio ${currentPage.pageNumber}`}
          className="w-full h-full object-contain"
        />
      )}

      {!isFirstPage && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-black/10 flex items-center justify-center"
        >
          <FiChevronLeft className="text-[26px]" />
        </button>
      )}

      {!isLastPage && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-black/10 flex items-center justify-center"
        >
          <FiChevronRight className="text-[26px]" />
        </button>
      )}

      {hasPages && (
        <div className="absolute right-4 bottom-3 bg-white/80 px-3 py-1 rounded-full text-[16px]">
          {currentIndex + 1} / {pages.length}
        </div>
      )}
    </div>
  )
}

export default ArtistPortfolioSlider