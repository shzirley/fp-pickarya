import {
  FiUser,
  FiImage,
} from "react-icons/fi"
import { LuClipboardList } from "react-icons/lu"

function ArtistDashboardSidebar({
  activeSidebar = "account",
  setActiveSidebar = () => {},
  activeOrderStatus = "artist_incoming",
  setActiveOrderStatus = () => {},
  setCurrentPage = () => {},
}) {
  return (
    <div className="w-[240px]">
      <button
        onClick={() => {
          setActiveSidebar("account")
          setCurrentPage("profile")
        }}
        className="flex items-center gap-3 text-[24px]"
      >
        <FiUser />
        <span className={activeSidebar === "account" ? "text-yellow-500" : ""}>
          Akun
        </span>
      </button>

      <button
        onClick={() => {
          setActiveSidebar("portfolio")
          setCurrentPage("profile")
        }}
        className="flex items-center gap-3 text-[24px] mt-5"
      >
        <FiImage />
        <span
          className={activeSidebar === "portfolio" ? "text-yellow-500" : ""}
        >
          Portofolio
        </span>
      </button>

      <button
        onClick={() => {
          setActiveSidebar("orders")
          setActiveOrderStatus("artist_incoming")
          setCurrentPage("profile")
        }}
        className="flex items-start gap-3 text-[24px] mt-5"
      >
        <LuClipboardList className="min-w-[24px] min-h-[24px] mt-1" />

        <div className="text-left">
          <p>
            Riwayat
            <br />
            Penjualan
          </p>

          {activeSidebar === "orders" && (
            <div className="mt-4 space-y-3 text-[20px]">
              <p
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveOrderStatus("artist_incoming")
                  setCurrentPage("profile")
                }}
                className={
                  activeOrderStatus === "artist_incoming"
                    ? "text-yellow-500 cursor-pointer"
                    : "cursor-pointer"
                }
              >
                Pesanan Masuk
              </p>

              <p
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveOrderStatus("artist_process")
                  setCurrentPage("profile")
                }}
                className={
                  activeOrderStatus === "artist_process"
                    ? "text-yellow-500 cursor-pointer"
                    : "cursor-pointer"
                }
              >
                Pesanan Diproses
              </p>

              <p
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveOrderStatus("artist_completed")
                  setCurrentPage("profile")
                }}
                className={
                  activeOrderStatus === "artist_completed"
                    ? "text-yellow-500 cursor-pointer"
                    : "cursor-pointer"
                }
              >
                Pesanan Selesai
              </p>

              <p
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveOrderStatus("artist_cancelled")
                  setCurrentPage("profile")
                }}
                className={
                  activeOrderStatus === "artist_cancelled"
                    ? "text-yellow-500 cursor-pointer"
                    : "cursor-pointer"
                }
              >
                Pesanan Batal
              </p>
            </div>
          )}
        </div>
      </button>
    </div>
  )
}

export default ArtistDashboardSidebar