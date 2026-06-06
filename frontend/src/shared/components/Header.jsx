import {
  FiSearch,
  FiHeart,
  FiUser,
} from "react-icons/fi"

const AUTH_PAGES = [
  "login",
  "signupAccount",
  "signupRole",
  "signupBuyerUsername",
  "signupArtistLevel",
  "signupArtistUsername",
]

function Header({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  role = "buyer",
  setActiveSidebar = () => {},
  setActiveOrderStatus = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const isAuthPage = AUTH_PAGES.includes(currentPage)

  const roleLabel =
    role === "artist" ? "Artist" : "Buyer"

  const handleLogoClick = () => {
    if (isLoggedIn && role === "artist") {
      setCurrentPage("profile")
      setActiveSidebar("account")
      setActiveOrderStatus("artist_incoming")
      return
    }

    setCurrentPage("home")
  }

  const openProfile = () => {
    setCurrentPage("profile")
    setActiveSidebar("account")

    if (role === "artist") {
      setActiveOrderStatus("artist_incoming")
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full h-[100px] bg-white z-30 flex items-center justify-between px-[40px] shadow-md">
      <button
        onClick={handleLogoClick}
        className="flex items-center gap-3"
      >
        <span className="text-[36px] text-black leading-none">
          PICKARYA
        </span>

        {isLoggedIn && (
          <>
            <span className="text-[24px] text-[#8A8A8A] leading-none">
              ·
            </span>

            <span className="text-[20px] text-[#8A8A8A] leading-none mt-[2px]">
              {roleLabel}
            </span>
          </>
        )}
      </button>

      {currentPage === "home" && role === "buyer" && (
        <div className="w-[420px] h-[45px] border-[3px] border-black rounded-full flex items-center px-4">
          <FiSearch className="text-[22px]" />

          <input
  type="text"
  placeholder="Cari username Artist"
  value={searchQuery}
  onChange={(event) => setSearchQuery(event.target.value)}
  className="ml-3 flex-1 outline-none text-[18px]"
/>
        </div>
      )}

      <div className="flex items-center gap-5">
        {!isLoggedIn && !isAuthPage && (
          <button
            onClick={() => setCurrentPage("login")}
            className="text-[20px] whitespace-nowrap"
          >
            LOG IN
          </button>
        )}

        {isLoggedIn && (
          <>
            {role === "buyer" && (
              <button
  type="button"
  onClick={() => setCurrentPage("likedPortfolio")}
>
  <FiHeart className="text-[28px]" />
</button>
            )}

            <button onClick={openProfile}>
              <FiUser className="text-[28px]" />
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header