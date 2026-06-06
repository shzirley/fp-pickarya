// Halaman utama untuk Buyer, menampilkan list artist

import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import ArtistCard from "../components/ArtistCard"

function BuyerHomePage({
  showFilter,
  setShowFilter,
  categories,
  selectedCategories,
  toggleCategory,
  removeCategory,

  artistLevels = [],
  selectedLevels = [],
  toggleLevel = () => {},
  removeLevel = () => {},

  filteredArtists,
  searchQuery = "",
  openDetail,
}) {
  return (
    <div className="px-[40px] pt-[130px] pb-[140px]">
      {/* FILTER */}
      <div className="flex justify-end relative">
        <button onClick={() => setShowFilter(!showFilter)}>
          <HiOutlineAdjustmentsHorizontal className="text-[38px]" />
        </button>

        {showFilter && (
          <>
            <div
              onClick={() => setShowFilter(false)}
              className="fixed inset-0 z-10"
            />

            <div className="absolute top-[60px] right-0 bg-[#F5F5F5] border shadow-lg rounded-[24px] w-[460px] p-8 z-20">
              <p className="text-[24px] text-center mb-6">
                Pilih satu atau lebih
              </p>

              <p className="text-[20px] mb-3">
                Produk
              </p>

              <div className="flex flex-wrap gap-4">
                {categories.map((category) => {
                  const selected = selectedCategories.includes(category)

                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`h-[52px] px-5 rounded-full border-[2px] text-[20px] flex items-center gap-2 ${
                        selected
                          ? "bg-white border-yellow-500 text-yellow-500"
                          : "bg-white border-black text-black"
                      }`}
                    >
                      <span>{category}</span>
                      {selected && <span>×</span>}
                    </button>
                  )
                })}
              </div>

              <p className="text-[20px] mt-6 mb-3">
                Level Artist
              </p>

              <div className="flex flex-wrap gap-4">
                {artistLevels.map((level) => {
                  const selected = selectedLevels.includes(level.value)

                  return (
                    <button
                      key={level.value}
                      onClick={() => toggleLevel(level.value)}
                      className={`h-[52px] px-5 rounded-full border-[2px] text-[20px] flex items-center gap-2 ${
                        selected
                          ? "bg-white border-yellow-500 text-yellow-500"
                          : "bg-white border-black text-black"
                      }`}
                    >
                      <span>{level.label}</span>
                      {selected && <span>×</span>}
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowFilter(false)}
                  className="bg-black text-white text-[20px] px-8 h-[50px] rounded-[12px]"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* SELECTED FILTER */}
      {(selectedCategories.length > 0 || selectedLevels.length > 0) && (
        <div className="flex gap-4 mt-6 flex-wrap">
          {selectedCategories.map((category) => (
            <button
              key={category}
              onClick={() => removeCategory(category)}
              className="h-[50px] px-5 rounded-full border-[2px] border-yellow-500 bg-white text-yellow-500 text-[20px] flex items-center gap-2"
            >
              <span>{category}</span>
              <span>×</span>
            </button>
          ))}

          {selectedLevels.map((levelValue) => {
            const level = artistLevels.find(
              (item) => item.value === levelValue
            )

            return (
              <button
                key={levelValue}
                onClick={() => removeLevel(levelValue)}
                className="h-[50px] px-5 rounded-full border-[2px] border-yellow-500 bg-white text-yellow-500 text-[20px] flex items-center gap-2"
              >
                <span>{level?.label || levelValue}</span>
                <span>×</span>
              </button>
            )
          })}
        </div>
      )}

      {/* CARDS */}
      {/* CARDS */}
{filteredArtists.length > 0 ? (
  <div className="flex gap-[32px] flex-wrap mt-8">
    {filteredArtists.map((artist) => (
      <ArtistCard
        key={artist.id}
        artist={artist}
        openDetail={openDetail}
        selectedCategories={selectedCategories}
      />
    ))}
  </div>
) : (
  <div className="mt-8 text-[22px] text-[#8A8A8A]">
    {searchQuery.trim()
      ? `Artist dengan username "${searchQuery.trim()}" tidak ditemukan`
      : "Belum ada artist yang tersedia."}
  </div>
)}
    </div>
  )
}

export default BuyerHomePage