import OrderCard from "../../orders/components/OrderCard"
import OrderDetailPage from "../../orders/pages/OrderDetailPage"

import {
  BUYER_STATUS_GROUPS,
  ARTIST_STATUS_GROUPS,
} from "../../orders/constants/orderStatus"

function ProfileOrders({
  role = "buyer",
  currentArtist = null,
  currentPage = "profile",
  selectedOrder = null,
  activeOrderStatus = "waiting",
  setCurrentPage = () => {},
  orders = [],
  cancelOrder = () => {},
  rejectOrderByArtist = () => {},
  acceptOrderByArtist = () => {},
  confirmPaymentByBuyer = () => {},
  uploadResultByArtist = () => {},
  uploadRevisionByArtist = () => {},
  requestRevisionByBuyer = () => {},
  completeOrderByBuyer = () => {},
  updatePaymentProofLink = () => {},
  updateResultLink = () => {},
  updateRevisionLink = () => {},
  setSelectedOrder = () => {},
}) {
  const statusGroups =
    role === "artist" ? ARTIST_STATUS_GROUPS : BUYER_STATUS_GROUPS

  const defaultStatus = role === "artist" ? "artist_incoming" : "waiting"

  const currentStatusGroup =
    statusGroups[activeOrderStatus] || statusGroups[defaultStatus]

  const safeOrders = Array.isArray(orders) ? orders : []

  const visibleOrders =
    role === "artist"
      ? safeOrders.filter(
          (order) =>
            order?.artistId === currentArtist?.id ||
            order?.artist === currentArtist?.name
        )
      : safeOrders

  const filteredOrders = visibleOrders.filter((order) =>
    currentStatusGroup.includes(order?.status)
  )

  const emptyOrderText = {
    waiting: "Tidak ada pesanan yang menunggu persetujuan",
    unpaid: "Tidak ada pesanan yang belum dibayar",
    process: "Tidak ada pesanan yang sedang diproses",
    revision: "Tidak ada pesanan revisi",
    completed: "Tidak ada pesanan yang selesai",
    cancelled: "Tidak ada pesanan yang dibatalkan",

    artist_incoming: "Tidak ada pesanan masuk",
    artist_process: "Tidak ada pesanan yang sedang diproses",
    artist_completed: "Tidak ada pesanan yang selesai",
    artist_cancelled: "Tidak ada pesanan yang batal",
  }

  const currentEmptyOrderText =
    emptyOrderText[activeOrderStatus] || "Tidak ada pesanan"

  if (currentPage === "orderDetail") {
    return (
      <OrderDetailPage
        role={role}
        selectedOrder={selectedOrder}
        setCurrentPage={setCurrentPage}
        cancelOrder={cancelOrder}
        rejectOrderByArtist={rejectOrderByArtist}
        acceptOrderByArtist={acceptOrderByArtist}
        confirmPaymentByBuyer={confirmPaymentByBuyer}
        uploadResultByArtist={uploadResultByArtist}
        uploadRevisionByArtist={uploadRevisionByArtist}
        requestRevisionByBuyer={requestRevisionByBuyer}
        completeOrderByBuyer={completeOrderByBuyer}
        updatePaymentProofLink={updatePaymentProofLink}
        updateResultLink={updateResultLink}
        updateRevisionLink={updateRevisionLink}
      />
    )
  }

  return (
    <div className="space-y-5">
      {filteredOrders.length === 0 ? (
        <div className="border-[3px] border-[#D9D9D9] h-[160px] flex items-center justify-center text-[20px]">
          {currentEmptyOrderText}
        </div>
      ) : (
        filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            role={role}
            order={order}
            cancelOrder={cancelOrder}
            setSelectedOrder={setSelectedOrder}
            setCurrentPage={setCurrentPage}
          />
        ))
      )}
    </div>
  )
}

export default ProfileOrders