import { useRef, useState } from "react"
import { FiMoreVertical, FiEdit2 } from "react-icons/fi"
import ProfileAvatar from "../../../shared/components/ProfileAvatar"

function ProfileAccount({
  role = "buyer",
  currentUser = null,
  phone = "",
  setPhone = () => {},
  gender = "",
  setGender = () => {},
  profilePhotoUrl = "",
  profilePhotoPosition = { x: 0, y: 0 },
  setProfilePhotoUrl = () => {},
  setProfilePhotoPosition = () => {},
  showToast = () => {},
  setShowDeletePopup = () => {},
  setShowLogoutPopup = () => {},
}) {
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const fileInputRef = useRef(null)

const handleProfilePhotoChange = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  if (!file.type.startsWith("image/")) {
    showToast("File harus berupa gambar")
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    setProfilePhotoUrl(reader.result)
    setProfilePhotoPosition({ x: 0, y: 0 })
    showToast("Foto profil berhasil dipasang")
  }

  reader.readAsDataURL(file)
  event.target.value = ""
}

  const profileUsername =
    currentUser?.username || currentUser?.name || "unainaina"

  const profileEmail = currentUser?.email || "Email"
  const profilePhone = currentUser?.phone || "-"
  const profileBank =
   currentUser?.bankName && currentUser?.bankAccount
    ? `${currentUser.bankName} - ${currentUser.bankAccount}`
    : "-"

  const artistLevelLabel =
    {
      beginner: "Beginner",
      intermediate: "Intermediate",
      professional: "Professional",
    }[currentUser?.artistLevel] || currentUser?.artistLevel

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-[28px]">Profil Akun</p>

        <div className="relative">
          <button
            onClick={() => setShowAccountMenu((prev) => !prev)}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Menu akun"
          >
            <FiMoreVertical className="text-[24px]" />
          </button>

          {showAccountMenu && (
            <div className="absolute right-0 top-[42px] w-[170px] bg-white border border-[#D9D9D9] rounded-[12px] shadow-md overflow-hidden z-20">
              <button
                onClick={() => {
                  setShowAccountMenu(false)
                  setShowLogoutPopup(true)
                }}
                className="w-full px-4 py-3 text-left text-[18px] hover:bg-[#F5F5F5]"
              >
                Log out
              </button>

              <button
                onClick={() => {
                  setShowAccountMenu(false)
                  setShowDeletePopup(true)
                }}
                className="w-full px-4 py-3 text-left text-[18px] text-red-600 hover:bg-[#F5F5F5]"
              >
                Hapus Akun
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-[40px] mt-10">
        <div className="flex flex-col items-center">
          <div className="relative w-[140px] h-[140px]">
  <div>
  <ProfileAvatar
    imageUrl={profilePhotoUrl}
    sizeClass="w-[140px] h-[140px]"
    iconClass="text-[70px]"
  />
</div>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleProfilePhotoChange}
    className="hidden"
  />

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="absolute bottom-0 right-0 w-[38px] h-[38px] rounded-full bg-black flex items-center justify-center"
    aria-label="Edit foto profil"
  >
    <FiEdit2 className="text-white text-[18px]" />
  </button>
</div>

          <p className="text-[24px] mt-4">{profileUsername}</p>

          {role === "artist" && artistLevelLabel && (
            <p className="text-[18px] mt-1 text-[#666666]">
              Level: {artistLevelLabel}
            </p>
          )}
        </div>

        <div className="flex-1">
          <p className="text-[20px]">Email</p>

          <input
            value={profileEmail}
            readOnly
            className="w-full h-[56px] border-[3px] border-black rounded-[14px] px-4 text-[20px] outline-none mt-2"
          />

          <div className="mt-7">
  <p className="text-[20px]">
    Nomor Telepon
  </p>

  <div className="w-full h-[56px] border-[3px] border-black rounded-[14px] px-4 text-[20px] mt-2 flex items-center bg-transparent">
    {profilePhone}
  </div>
</div>

       {role === "artist" && (
  <div className="mt-5">
    <p className="text-[20px]">
      Rekening pembayaran
    </p>

    <div className="w-full h-[56px] border-[3px] border-black rounded-[14px] px-4 text-[20px] mt-2 flex items-center bg-transparent">
      {profileBank}
    </div>
  </div>
)}
        </div>
      </div>
    </>
  )
}

export default ProfileAccount