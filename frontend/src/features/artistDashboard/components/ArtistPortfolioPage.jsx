import { useState } from "react"
import { FiClock, FiTrash2, FiX } from "react-icons/fi"
import ArtistPortfolioSlider from "./ArtistPortfolioSlider"

function ArtistPortfolioPage({
  portfolio = null,
  onUploadClick = () => {},
  onDeleteClick = () => {},
  onDeleteProduct = () => {},
  onPublishClick = () => {},
  onAddProductClick = () => {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const pages = portfolio?.pages || []
  const products = portfolio?.products || []
  const hasPortfolio = pages.length > 0
  const canPublish = hasPortfolio && products.length > 0

  if (!hasPortfolio) {
    return (
      <>
        <p className="text-[28px]">Portofolio Artist</p>

        <div className="min-h-[260px] flex items-center justify-center text-center text-[20px]">
          <p>
            Yah, belum ada Portofolio nih.. 😔🥀
            <br />
            Yuk upload portofolio untuk menarik pelanggan!
          </p>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={onUploadClick}
            className="w-[140px] h-[50px] bg-black text-white rounded-[12px] text-[20px]"
          >
            Upload
          </button>
        </div>
      </>
    )
  }

  const durationText =
    portfolio.durationMin && portfolio.durationMax
      ? `${portfolio.durationMin}-${portfolio.durationMax} hari`
      : "-"

  return (
    <>
      {showDeletePopup && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F5F5] rounded-[18px] p-8 z-50 shadow-lg">
            <p className="text-[20px] text-center">
              Apakah Anda yakin ingin menghapus portofolio ini beserta
              produknya?
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="w-[100px] h-[42px] border border-black rounded-[10px] text-[20px]"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeletePopup(false)
                  onDeleteClick()
                }}
                className="w-[100px] h-[42px] bg-black text-white rounded-[10px] text-[20px]"
              >
                Hapus
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between items-center">
        <p className="text-[28px]">Portofolio Artist</p>

        <button
          onClick={() => setShowDeletePopup(true)}
          className="w-[42px] h-[42px] flex items-center justify-center rounded-full hover:bg-black/5"
          aria-label="Hapus portofolio"
          title="Hapus portofolio"
        >
          <FiTrash2 className="text-[24px]" />
        </button>
      </div>

      <div className="flex gap-[24px] mt-8">
        <ArtistPortfolioSlider
          pages={pages}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />

        <div className="pt-1">
          <p className="text-[24px]">{portfolio.title || "Portoku 1"}</p>

          <div className="flex items-center gap-2 mt-2">
            <FiClock className="text-[18px]" />
            <span className="text-[20px]">{durationText}</span>
          </div>

          {portfolio?.isPublished && (
            <p className="text-[16px] text-green-600 mt-3">
              Sudah dipublikasikan
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <p className="text-[20px]">Produk</p>

          <button
            onClick={onAddProductClick}
            className="w-[34px] h-[34px] bg-black text-white rounded-full text-[26px] leading-none flex items-center justify-center"
            aria-label="Tambah produk"
            title="Tambah produk"
          >
            +
          </button>
        </div>

        <div className="w-[534px] min-h-[59px] border-[3px] border-black rounded-[14px] px-4 py-3 mt-2">
          {products.length === 0 ? (
            <p className="text-[#A4A1A1] text-[20px]">-</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative flex items-center gap-5 pr-10"
                >
                  <div className="w-[120px] h-[58px] rounded-[14px] border-[3px] border-black overflow-hidden bg-white">
                    {product.coverImageUrl && (
                      <img
                        src={product.coverImageUrl}
                        alt={product.tag}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="text-[20px] leading-tight">
                    <p>
                      #
                      {String(product.tag)
                        .replace("#", "")
                        .toLowerCase()}
                    </p>
                    <p>
                      Rp{Number(product.priceMin).toLocaleString("id-ID")} - Rp
                      {Number(product.priceMax).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[28px] h-[28px] flex items-center justify-center rounded-full hover:bg-black/5"
                    aria-label="Hapus produk"
                    title="Hapus produk"
                  >
                    <FiX className="text-[22px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {products.length === 0 && (
          <p className="text-[#FD0707] text-[16px] mt-2">
            Belum ada produk
          </p>
        )}
      </div>

      <div className="flex flex-col items-end mt-8">
        <button
          onClick={onPublishClick}
          disabled={!canPublish}
          className={
            canPublish
              ? "w-[180px] h-[50px] bg-black text-white rounded-[12px] text-[20px]"
              : "w-[180px] h-[50px] bg-[#D9D9D9] text-[#777777] rounded-[12px] text-[20px] cursor-not-allowed"
          }
        >
          {portfolio?.isPublished ? "Update Publikasi" : "Publikasikan"}
        </button>

        {!canPublish && (
          <p className="text-[14px] text-[#777777] mt-2">
            Tambahkan produk dulu sebelum publikasi
          </p>
        )}
      </div>
    </>
  )
}

export default ArtistPortfolioPage