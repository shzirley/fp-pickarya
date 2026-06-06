import { FiUser } from "react-icons/fi"

function ProfileAvatar({
  imageUrl = "",
  sizeClass = "w-[140px] h-[140px]",
  iconClass = "text-[70px]",
}) {
  return (
    <div
      className={`${sizeClass} rounded-full bg-[#D9D9D9] overflow-hidden flex items-center justify-center shrink-0`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Foto profil"
          draggable={false}
          className="w-full h-full object-cover object-center select-none"
        />
      ) : (
        <FiUser className={`${iconClass} text-black`} />
      )}
    </div>
  )
}

export default ProfileAvatar