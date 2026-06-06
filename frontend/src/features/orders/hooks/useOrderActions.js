import { ORDER_STATUS } from "../constants/orderStatus"
import { updateOrderStatus } from "../../auth/services/orderService"  // ✅ import API

import {
  getCurrentOrderDateTime,
  updateOrderById,
  updateSelectedOrderById,
} from "../utils/orderHelpers"

export function useOrderActions({
  setOrders = () => {},
  setSelectedOrder = () => {},
  setCurrentPage = () => {},
  setActiveSidebar = () => {},
  setActiveOrderStatus = () => {},
  showToast = () => {},
}) {
  const cancelOrder = async (id) => {
    const changes = {
      status: ORDER_STATUS.CANCELLED_BY_BUYER,
      cancelledAt: getCurrentOrderDateTime(),
      cancelReason: "Anda membatalkan pesanan",
    }
    await updateOrderStatus(id, 'cancel')  // ✅ simpan ke backend
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    showToast("Pesanan dibatalkan", 5000)
  }

  const rejectOrderByArtist = async (id) => {
    const changes = {
      status: ORDER_STATUS.REJECTED_BY_ARTIST,
      rejectedAt: getCurrentOrderDateTime(),
      cancelledAt: getCurrentOrderDateTime(),
    }
    await updateOrderStatus(id, 'reject')  // ✅
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    showToast("Pesanan ditolak artist", 5000)
  }

  const acceptOrderByArtist = async (id, totalPrice) => {
    const changes = {
      status: ORDER_STATUS.ACCEPTED,
      totalPrice,
      acceptedAt: getCurrentOrderDateTime(),
    }
    await updateOrderStatus(id, 'accept', { totalPrice })  // ✅
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    showToast("Harga berhasil diajukan", 5000)
  }

  const confirmPaymentByBuyer = async (id, paymentProofLink) => {
    const changes = {
      status: ORDER_STATUS.BUYER_CONFIRMED_PAYMENT,
      paymentConfirmedAt: getCurrentOrderDateTime(),
      paymentProofLink,
    }
    await updateOrderStatus(id, 'buyer-confirm-payment', { paymentProofLink })  // ✅
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    showToast("Konfirmasi pembayaran berhasil dikirim", 5000)
  }

  const uploadResultByArtist = async (id, resultLink) => {
    const changes = {
      status: ORDER_STATUS.RESULT_UPLOADED,
      resultLink,
      resultUploadedAt: getCurrentOrderDateTime(),
    }
    await updateOrderStatus(id, 'upload-result', { resultLink })  // ✅
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    showToast("Hasil karya berhasil dikirim", 5000)
  }

  const uploadRevisionByArtist = async (id, revisionLink) => {
    const changes = {
      status: ORDER_STATUS.REVISION_UPLOADED,
      revisionLink,
      revisionUploadedAt: getCurrentOrderDateTime(),
    }
    await updateOrderStatus(id, 'upload-revision', { revisionLink })  // ✅
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    showToast("Hasil revisi berhasil dikirim", 5000)
  }

  const requestRevisionByBuyer = async (id, revisionDescription, revisionSupportLink = "") => {
    const changes = {
      status: ORDER_STATUS.REVISION_REQUESTED,
      revisionDescription,
      revisionSupportLink,
      revisionRequestedAt: getCurrentOrderDateTime(),
    }
    await updateOrderStatus(id, 'request-revision', { revisionDescription, revisionSupportLink })  // ✅
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    setActiveSidebar("orders")
    setActiveOrderStatus("revision")
    showToast("Request revisi berhasil dikirim", 5000)
  }

  const completeOrderByBuyer = async (id) => {
    const changes = {
      status: ORDER_STATUS.COMPLETED,
      completedAt: getCurrentOrderDateTime(),
    }
    await updateOrderStatus(id, 'complete')  // ✅
    setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
    setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
    setActiveSidebar("orders")
    setActiveOrderStatus("completed")
    showToast("Pesanan berhasil diselesaikan", 5000)
  }

  const updatePaymentProofLink = async (id, paymentProofLink) => {
  const changes = { paymentProofLink }
  await updateOrderStatus(id, 'update-payment-proof', { paymentProofLink })  // ✅
  setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
  setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
  showToast("Link bukti pembayaran berhasil diganti", 5000)
}

  const updateResultLink = async (id, resultLink) => {
  const changes = { resultLink }
  await updateOrderStatus(id, 'update-result-link', { resultLink })  // ✅
  setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
  setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
  showToast("Link hasil pesanan berhasil diganti", 5000)
}

 const updateRevisionLink = async (id, revisionLink) => {
  const changes = { revisionLink }
  await updateOrderStatus(id, 'update-revision-link', { revisionLink })  // ✅
  setOrders((prevOrders) => updateOrderById(prevOrders, id, changes))
  setSelectedOrder((prevOrder) => updateSelectedOrderById(prevOrder, id, changes))
  showToast("Link hasil revisi berhasil diganti", 5000)
}
const formatDateTime = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-'
  const date = new Date(dateStr)
  if (isNaN(date)) return '-'
  const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${tanggal} ${jam}`
}

  return {
    cancelOrder,
    rejectOrderByArtist,
    acceptOrderByArtist,
    confirmPaymentByBuyer,
    uploadResultByArtist,
    requestRevisionByBuyer,
    completeOrderByBuyer,
    uploadRevisionByArtist,
    updatePaymentProofLink,
    updateResultLink,
    updateRevisionLink,
  }
}