import { FiX } from "react-icons/fi"

function RevisionBriefViewPage({
  selectedOrder,
  setCurrentPage,
}) {
  const getValidExternalLink = (link) => {
    const trimmedLink = String(link || "").trim()

    if (!trimmedLink) return ""

    const linkWithProtocol = /^https?:\/\//i.test(trimmedLink)
      ? trimmedLink
      : `https://${trimmedLink}`

    try {
      return new URL(linkWithProtocol).href
    } catch {
      return ""
    }
  }

  if (!selectedOrder) {
    return (
      <div className="px-[60px] pt-[120px] text-[20px]">
        Tidak ada pesanan yang dipilih.
      </div>
    )
  }

  const resultHref = getValidExternalLink(selectedOrder?.resultLink)
  const supportHref = getValidExternalLink(selectedOrder?.revisionSupportLink)

  return (
    <div className="min-h-screen overflow-y-auto px-[60px] pt-[145px] pb-[120px] relative">
      <button
        type="button"
        onClick={() => setCurrentPage("orderDetail")}
        className="absolute top-[150px] right-[60px] text-[30px]"
        aria-label="Tutup brief revisi"
      >
        <FiX />
      </button>

      <div className="text-center mb-10">
        <h1 className="text-[30px]">
          Brief Revisi
        </h1>

        <p className="text-[20px] mt-1">
          NO. PESANAN. {selectedOrder.id}
        </p>
      </div>

      <div className="max-w-[1160px] mx-auto">
        <div className="mb-8">
          <p className="text-[20px] mb-3">
            Hasil karya yang ingin direvisi
          </p>

          {resultHref ? (
            <a
              href={resultHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center min-w-[130px] h-[42px] border-[3px] border-black rounded-[14px] text-[19px] text-[#09027C] underline"
            >
              Lihat hasil
            </a>
          ) : (
            <p className="text-[18px] text-[#8A8A8A]">
              Link hasil belum tersedia.
            </p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-[20px] mb-3">
            Deskripsi Request revisi
          </p>

          <div className="w-full min-h-[70px] border-[3px] border-black rounded-[18px] bg-transparent px-5 py-4 text-[19px]">
            {selectedOrder?.revisionDescription || "Tidak ada deskripsi revisi."}
          </div>
        </div>

        {supportHref && (
          <a
            href={supportHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center min-w-[260px] h-[48px] border-[3px] border-black rounded-[14px] text-[19px] text-[#09027C] underline"
          >
            Gambar pendukung
          </a>
        )}
      </div>
    </div>
  )
}

export default RevisionBriefViewPage