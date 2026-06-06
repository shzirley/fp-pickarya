import { useState } from "react"

function RevisionBriefPage({
  selectedOrder,
  setCurrentPage,
  requestRevisionByBuyer,
}) {
  const [revisionDescription, setRevisionDescription] = useState("")
  const [supportLink, setSupportLink] = useState("")
  const [error, setError] = useState("")

  const getValidExternalLink = (link) => {
  const trimmedLink = String(link || "").trim()

  if (!trimmedLink) return ""

  if (/\s/.test(trimmedLink)) return ""

  const linkWithProtocol = /^https?:\/\//i.test(trimmedLink)
    ? trimmedLink
    : `https://${trimmedLink}`

  try {
    const url = new URL(linkWithProtocol)
    const hostname = url.hostname.toLowerCase()

    if (!hostname.includes(".")) return ""

    return url.href
  } catch {
    return ""
  }
}

  if (!selectedOrder) {
    return (
      <div className="px-[60px] pt-[120px] text-[22px]">
        Tidak ada pesanan yang dipilih.
      </div>
    )
  }

  const resultHref = getValidExternalLink(selectedOrder?.resultLink)
  const supportHref = getValidExternalLink(supportLink)

  const handleSubmitRevision = () => {
    if (!revisionDescription.trim()) {
      setError("Deskripsi revisi wajib diisi.")
      return
    }

    if (supportLink.trim() && !supportHref) {
  setError("Masukkan link gambar pendukung yang valid. Pastikan akses file sudah dibuka.")
  return
}

    requestRevisionByBuyer(
      selectedOrder._id || selectedOrder.id,
      revisionDescription.trim(),
      supportHref
    )

    setRevisionDescription("")
    setSupportLink("")
    setError("")
    setCurrentPage("orderDetail")
  }

  return (
    <div className="px-[60px] pt-[110px] pb-[80px]">
      <div className="text-center mb-8">
        <h1 className="text-[30px]">Brief Revisi</h1>
        <p className="text-[20px] mt-1">
          NO. PESANAN. {selectedOrder._id || selectedOrder.id}
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

          <textarea
            value={revisionDescription}
            onChange={(event) => setRevisionDescription(event.target.value)}
            placeholder="Masukkan deskripsi request revisi"
            className="w-full h-[150px] border-[3px] border-black rounded-[18px] bg-transparent px-5 py-4 text-[19px] outline-none resize-none placeholder:text-[#8A8A8A]"
          />
        </div>

        <div className="mb-4">
  <p className="text-[20px] mb-2">
    Tambahkan link G-drive gambar pendukung
  </p>

  <input
    type="text"
    value={supportLink}
    onChange={(event) => setSupportLink(event.target.value)}
    placeholder="Masukkan link"
    className="w-full h-[52px] border-[3px] border-black rounded-[16px] bg-transparent px-5 text-[19px] outline-none placeholder:text-[#8A8A8A]"
  />

  <p className="text-[17px] text-[#8A8A8A] mt-2">
  Pastikan link benar dan akses file sudah dibuka.
</p>

</div>

        {error && (
          <p className="text-[17px] text-red-500 mt-3">
            {error}
          </p>
        )}

        <div className="flex justify-center gap-6 mt-14">
          <button
            type="button"
            onClick={() => setCurrentPage("orderDetail")}
            className="w-[150px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmitRevision}
            className="w-[150px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  )
}

export default RevisionBriefPage