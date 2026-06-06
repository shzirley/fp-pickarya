import { useState } from "react"
import { FiImage, FiArrowLeft } from "react-icons/fi"
 
// ✅ delay dan uploadImageToCloudinary sejajar, keduanya di luar component
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
 
const uploadImageToCloudinary = async (file) => {
  const CLOUD_NAME = "dbno33age"
  const UPLOAD_PRESET = "pickarya_portofolio"
 
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)
 
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  })
 
  const data = await res.json()
 
  if (data.error) {
    throw new Error("Gagal upload gambar ke server")
  }
 
  return data.secure_url
}
 
function ArtistPortfolioUploadPage({
  initialPortfolio = null,
  onUploadPortfolio = () => {},
  setCurrentPage = () => {},
}) {
  const isEditMode = Boolean(initialPortfolio)
 
  const [title, setTitle] = useState(initialPortfolio?.title || "")
  const [durationMin, setDurationMin] = useState(initialPortfolio?.durationMin || "1")
  const [durationMax, setDurationMax] = useState(initialPortfolio?.durationMax || "2")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
 
  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || [])
 
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isUnder10Mb = file.size <= 10 * 1024 * 1024
      return isImage && isUnder10Mb
    })
 
    if (validFiles.length !== files.length) {
      setErrorMessage("Beberapa file tidak bisa dipakai. Pastikan semua file berupa gambar dan maksimal 10 MB.")
    } else {
      setErrorMessage("")
    }
 
    const previews = validFiles.map((file) => URL.createObjectURL(file))
    setSelectedFiles(validFiles)
    setPreviewUrls(previews)
  }
 
  const handleDurationChange = (value, setter) => {
    const onlyNumber = value.replace(/\D/g, "")
    if (onlyNumber === "") {
      setter("")
      return
    }
    const safeNumber = Math.max(1, Number(onlyNumber))
    setter(String(safeNumber))
  }
 
  const handleBack = () => {
    setCurrentPage("profile")
  }
 
  const handleSubmit = async () => {
    const minDuration = Number(durationMin)
    const maxDuration = Number(durationMax)
    const existingPages = initialPortfolio?.pages || []
 
    if (!title || !durationMin || !durationMax) {
      setErrorMessage("Lengkapi judul dan durasi portofolio terlebih dahulu.")
      return
    }
 
    if (!isEditMode && selectedFiles.length === 0) {
      setErrorMessage("Pilih gambar portofolio terlebih dahulu.")
      return
    }
 
    if (isEditMode && existingPages.length === 0 && selectedFiles.length === 0) {
      setErrorMessage("Pilih gambar portofolio terlebih dahulu.")
      return
    }
 
    if (minDuration < 1 || maxDuration < 1) {
      setErrorMessage("Durasi minimal adalah 1 hari.")
      return
    }
 
    if (minDuration > maxDuration) {
      setErrorMessage("Durasi awal tidak boleh lebih besar dari durasi akhir.")
      return
    }
 
    setIsUploading(true)
    setUploadProgress(0)
 
    try {
      const uploadedUrls = []
 
      for (let i = 0; i < selectedFiles.length; i++) {
        const url = await uploadImageToCloudinary(selectedFiles[i])
        uploadedUrls.push(url)
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
 
        // ✅ jeda 500ms antar upload biar tidak kena rate limit
        if (i < selectedFiles.length - 1) {
          await delay(500)
        }
      }
 
      const newPages = selectedFiles.map((file, index) => ({
        id: `page-${Date.now()}-${existingPages.length + index + 1}`,
        pageNumber: existingPages.length + index + 1,
        fileName: file.name,
        imageUrl: uploadedUrls[index],
      }))
 
      const updatedPortfolio = {
        id: initialPortfolio?.id || `portfolio-${Date.now()}`,
        title,
        durationMin,
        durationMax,
        pages: [...existingPages, ...newPages],
        products: initialPortfolio?.products || [],
      }
 
      onUploadPortfolio(updatedPortfolio)
    } catch (err) {
      console.error("Upload error:", err)
      setErrorMessage("Gagal mengupload gambar. Coba lagi.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  } // ✅ kurung tutup handleSubmit
 
  return (
    <div className="px-[60px] pt-[120px] pb-[140px]">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[20px]"
      >
        <FiArrowLeft />
        Kembali
      </button>
 
      <p className="text-[32px] text-center mt-4">
        {isEditMode ? "Edit Portofolio" : "Upload Portofolio"}
      </p>
 
      <div className="flex gap-[64px] mt-[48px]">
        <label className="w-[414px] min-h-[343px] bg-[#D9D9D9] rounded-[20px] border-[3px] border-black flex flex-col items-center justify-center cursor-pointer px-6 py-8">
          <FiImage className="text-[90px]" />
 
          <p className="text-[22px] mt-6">
            {isEditMode ? "Tambah gambar di sini" : "Upload gambar di sini"}
          </p>
          <p className="text-[18px] mt-1">Bisa pilih banyak gambar</p>
          <p className="text-[18px]">Maksimal 10 MB per gambar</p>
 
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />
        </label>
 
        <div className="flex-1">
          <p className="text-[20px]">Judul</p>
 
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Masukkan judul"
            className="w-full h-[56px] border-[3px] border-black rounded-[14px] px-4 text-[20px] outline-none mt-2 placeholder:text-[#888181]"
          />
 
          <p className="text-[20px] mt-7">Estimasi durasi pembuatan</p>
 
          <div className="flex items-center gap-4 mt-2">
            <input
              value={durationMin}
              onChange={(event) =>
                handleDurationChange(event.target.value, setDurationMin)
              }
              inputMode="numeric"
              className="w-[85px] h-[56px] border-[3px] border-black rounded-[14px] text-center text-[20px] outline-none"
            />
 
            <span className="text-[20px]">-</span>
 
            <input
              value={durationMax}
              onChange={(event) =>
                handleDurationChange(event.target.value, setDurationMax)
              }
              inputMode="numeric"
              className="w-[85px] h-[56px] border-[3px] border-black rounded-[14px] text-center text-[20px] outline-none"
            />
 
            <span className="text-[20px]">hari</span>
          </div>
 
          {isEditMode && initialPortfolio?.pages?.length > 0 && (
            <div className="mt-7">
              <p className="text-[18px]">
                Portofolio saat ini: {initialPortfolio.pages.length} halaman
              </p>
            </div>
          )}
 
          {selectedFiles.length > 0 && (
            <div className="mt-7">
              <p className="text-[18px]">
                {selectedFiles.length} gambar dipilih
              </p>
 
              <div className="flex gap-3 mt-3 overflow-x-auto max-w-[650px] pb-2">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="w-[90px] h-[70px] border border-black rounded-[10px] overflow-hidden shrink-0"
                  >
                    <img
                      src={url}
                      alt={`preview-${index}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {isUploading && (
            <div className="mt-5">
              <p className="text-[16px] text-gray-600">
                Mengupload gambar... {uploadProgress}%
              </p>
              <div className="w-full h-[8px] bg-gray-200 rounded-full mt-2">
                <div
                  className="h-full bg-black rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
 
          {errorMessage && (
            <p className="text-[#FD0707] text-[16px] mt-5">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <p className="w-[412px] text-center text-[#FD0707] text-[16px] mt-3">
        *Pastikan menambahkan watermark pada portofolio
      </p>

      <div className="flex justify-end mt-[30px]">
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className={`w-[140px] h-[50px] rounded-[12px] text-[20px] text-white ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
          }`}
        >
          {isUploading ? `${uploadProgress}%` : isEditMode ? "Simpan" : "Upload"}
        </button>
      </div>
    </div>
  )
}


export default ArtistPortfolioUploadPage