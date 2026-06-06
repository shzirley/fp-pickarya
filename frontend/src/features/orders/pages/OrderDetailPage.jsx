import { useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { LuClipboardList } from "react-icons/lu"
import {
  FiX,
  FiDollarSign,
  FiEdit2,
  FiRefreshCcw,
  FiCheck,
} from "react-icons/fi"
import qrisPickarya from "../../../assets/qris-pickarya.jpeg"
import { ORDER_STATUS } from "../constants/orderStatus"
function OrderDetailPage({
  role = "buyer",
  selectedOrder,
  setCurrentPage,
  cancelOrder,
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
}) {
  const [showPricePopup, setShowPricePopup] = useState(false)
  const [finalPriceInput, setFinalPriceInput] = useState("0")
  const [showUploadPopup, setShowUploadPopup] = useState(false)
  const [uploadMode, setUploadMode] = useState("result")
  const [gdriveLink, setGdriveLink] = useState("")
  const [uploadLinkError, setUploadLinkError] = useState("")

  const [showPaymentProofPopup, setShowPaymentProofPopup] = useState(false)
  const [paymentProofLink, setPaymentProofLink] = useState("")
  const [paymentProofError, setPaymentProofError] = useState("")
  const [isEditingUploadLink, setIsEditingUploadLink] = useState(false)
  const [isEditingPaymentProof, setIsEditingPaymentProof] = useState(false)
  const ADMIN_WHATSAPP_LINK = "https://wa.me/6282228874637"

  const formatDateTime = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-'
  const date = new Date(dateStr)
  if (isNaN(date)) return '-'
  const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${tanggal} ${jam}`
}

  if (!selectedOrder) {
    return (
      <div className="p-10 text-center">
        Tidak ada order dipilih
      </div>
    )
  }

  const id = selectedOrder?._id || selectedOrder?.id
  const artist = selectedOrder?.artist || "Unknown Artist"
  const buyer = selectedOrder?.buyer || "Unknown Buyer"
  const displayName = role === "artist" ? buyer : artist

  const product = selectedOrder?.product || "Unknown Product"
  const productCoverImageUrl = selectedOrder?.productCoverImageUrl || ""
  const price = selectedOrder?.priceRange || selectedOrder?.price || "-"
  const totalPrice = selectedOrder?.totalPrice || price
  const quantity = selectedOrder?.quantity || 1
  const description = selectedOrder?.description || "-"
  const status = selectedOrder?.status || ORDER_STATUS.WAITING

 
  

  const createdAt = formatDateTime(selectedOrder?.createdAt)
  const cancelledAt = formatDateTime(selectedOrder?.cancelledAt)
  const acceptedAt = formatDateTime(selectedOrder?.acceptedAt)
  const paymentConfirmedAt = formatDateTime(selectedOrder?.paymentConfirmedAt)
  const processedAt = formatDateTime(selectedOrder?.processedAt)
  const resultUploadedAt = formatDateTime(selectedOrder?.resultUploadedAt)
  const revisionRequestedAt = formatDateTime(selectedOrder?.revisionRequestedAt)
  const revisionUploadedAt = formatDateTime(selectedOrder?.revisionUploadedAt)  
  const completedAt = formatDateTime(selectedOrder?.completedAt || selectedOrder?.approvedAt)
  

 

  const isCancelled =
    status === ORDER_STATUS.CANCELLED_BY_BUYER ||
    status === ORDER_STATUS.REJECTED_BY_ARTIST ||
    status === "cancelled"

  const isRejectedByArtist =
    status === ORDER_STATUS.REJECTED_BY_ARTIST

  const isCancelledByBuyer =
    status === ORDER_STATUS.CANCELLED_BY_BUYER ||
    status === "cancelled"

  const isAccepted =
    status === ORDER_STATUS.ACCEPTED

  const isBuyerConfirmedPayment =
    status === ORDER_STATUS.BUYER_CONFIRMED_PAYMENT

  const isUnpaid =
    isAccepted ||
    isBuyerConfirmedPayment

  const isProcessed =
    status === ORDER_STATUS.PAID_CONFIRMED

  const isResultUploaded =
    status === ORDER_STATUS.RESULT_UPLOADED

  const isRevisionRequested =
    status === ORDER_STATUS.REVISION_REQUESTED

  const isRevisionUploaded =
    status === ORDER_STATUS.REVISION_UPLOADED

  const isCompleted =
    status === ORDER_STATUS.COMPLETED ||
    status === ORDER_STATUS.APPROVED_BY_BUYER

  const canCancel =
    status === ORDER_STATUS.WAITING ||
    status === "waiting"

  const cancelSubtitle = isRejectedByArtist
    ? role === "artist"
      ? "Anda menolak pesanan"
      : "Artist menolak pesanan"
    : isCancelledByBuyer
      ? role === "artist"
        ? "Buyer membatalkan pesanan"
        : "Anda membatalkan pesanan"
      : "Pesanan dibatalkan"

  const priceNumber =
    Number(finalPriceInput.replace(/\D/g, "")) || 0

  const receivedAmount = priceNumber - priceNumber * 0.1

  const formatRupiah = (number) => {
    return `Rp${Number(number).toLocaleString("id-ID")}`
  }

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

  const DummyQR = () => {
  return (
    <img
      src={qrisPickarya}
      alt="QRIS pembayaran"
      className="w-[270px] h-[270px] object-contain"
    />
  )
}

  const handlePriceChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "")

    if (!onlyNumbers) {
      setFinalPriceInput("0")
      return
    }

    setFinalPriceInput(
      Number(onlyNumbers).toLocaleString("id-ID")
    )
  }

  const handleAcceptOrder = () => {
  if (priceNumber <= 0) return
    acceptOrderByArtist(id, priceNumber)
    setShowPricePopup(false)
    setFinalPriceInput("0")
    setCurrentPage("profile")
  }

  const openUploadPopup = (mode, currentLink = "", isEditing = false) => {
  setUploadMode(mode)
  setGdriveLink(currentLink || "")
  setUploadLinkError("")
  setIsEditingUploadLink(isEditing)
  setShowUploadPopup(true)
}

  const openPaymentProofPopup = (currentLink = "", isEditing = false) => {
  setPaymentProofLink(currentLink || "")
  setPaymentProofError("")
  setIsEditingPaymentProof(isEditing)
  setShowPaymentProofPopup(true)
}

  const handleUploadResult = () => {
  const validLink = getValidExternalLink(gdriveLink)

  if (!validLink) {
    setUploadLinkError("Masukkan link yang valid. Pastikan akses file sudah dibuka.")
    return
  }

  if (uploadMode === "revision") {
    if (isEditingUploadLink) {
      updateRevisionLink(id, validLink)
    } else {
      uploadRevisionByArtist(id, validLink)
    }
  } else {
    if (isEditingUploadLink) {
      updateResultLink(id, validLink)
    } else {
      uploadResultByArtist(id, validLink)
    }
  }

  setShowUploadPopup(false)
  setUploadMode("result")
  setGdriveLink("")
  setUploadLinkError("")
  setIsEditingUploadLink(false)
}

  const handleSubmitPaymentProof = () => {
  const validLink = getValidExternalLink(paymentProofLink)

  if (!validLink) {
    setPaymentProofError("Masukkan link bukti pembayaran yang valid. Pastikan akses file sudah dibuka.")
    return
  }

  if (isEditingPaymentProof) {
    updatePaymentProofLink(id, validLink)
  } else {
    confirmPaymentByBuyer(id, validLink)
  }

  setShowPaymentProofPopup(false)
  setPaymentProofLink("")
  setPaymentProofError("")
  setIsEditingPaymentProof(false)
}

  const headerStatus = isCancelled
    ? "Dibatalkan"
    : isCompleted
      ? "Selesai"
      : isRevisionRequested || isRevisionUploaded
        ? "Revisi"
        : isProcessed || isResultUploaded
          ? "Diproses"
          : isUnpaid
            ? "Belum Dibayar"
            : "Menunggu persetujuan"

  const hasAcceptedAt = Boolean(selectedOrder?.acceptedAt)
  const hasPaymentConfirmedAt = Boolean(selectedOrder?.paymentConfirmedAt)
  const hasProcessedAt = Boolean(selectedOrder?.processedAt)
  const hasResultUploadedAt = Boolean(selectedOrder?.resultUploadedAt)

  const TimelineMarker = ({
    type = "icon",
    active = false,
    icon,
  }) => {
    if (type === "dot") {
      return (
        <div className="w-[42px] flex justify-center flex-shrink-0">
          <div
            className={
              active
                ? "w-[16px] h-[16px] rounded-full bg-yellow-500 mt-3"
                : "w-[16px] h-[16px] rounded-full bg-[#9E9E9E] mt-3"
            }
          />
        </div>
      )
    }

    return (
      <div
        className={
          active
            ? "w-[42px] h-[42px] rounded-full border-[3px] border-yellow-500 text-yellow-500 flex items-center justify-center flex-shrink-0 bg-[#F5F5F5]"
            : "w-[42px] h-[42px] rounded-full border-[3px] border-[#9E9E9E] text-[#9E9E9E] flex items-center justify-center flex-shrink-0 bg-[#F5F5F5]"
        }
      >
        {icon}
      </div>
    )
  }

  const TimelineStep = ({ step }) => {
    const textColor = step.active
      ? "text-yellow-500"
      : "text-[#9E9E9E]"

    return (
      <div className="relative z-10 flex gap-6">
        <TimelineMarker
          type={step.type}
          active={step.active}
          icon={step.icon}
        />

        <p className="w-[215px] text-[20px] whitespace-nowrap mt-2 text-black">
          {step.date}
        </p>

        <div className="flex-1 mt-2 min-w-0">
          <p
            className={
              step.bold === false
                ? `text-[20px] leading-[24px] ${textColor}`
                : `text-[20px] font-semibold leading-[24px] ${textColor}`
            }
          >
            {step.title}
          </p>

          {step.subtitles?.map((subtitle) => (
            <p
              key={subtitle}
              className={`text-[20px] leading-[24px] mt-[2px] ${textColor}`}
            >
              {subtitle}
            </p>
          ))}

          {step.linkText && (
  <a
    href={step.linkHref || "#"}
    target={step.linkHref ? "_blank" : undefined}
    rel={step.linkHref ? "noreferrer" : undefined}
    onClick={(e) => {
      if (step.linkOnClick) {
        e.preventDefault()
        step.linkOnClick()
        return
      }

      if (!step.linkHref) e.preventDefault()
    }}
    className="inline-block text-[20px] text-[#09027C] underline mt-[2px]"
  >
    {step.linkText}
  </a>
)}

          {step.extra}

          {step.actions}
        </div>
      </div>
    )
  }

  const timelineSteps = []

  const addCreatedStep = (active = false) => {
    timelineSteps.push({
      date: createdAt,
      title: role === "artist" ? "Pesanan masuk" : "Pesanan diajukan",
      subtitles:
       role === "artist"
        ? ["Tolak/Terima pesanan ini"]
        : ["Menunggu persetujuan artist"],
      active,
      icon: <LuClipboardList className="text-[20px]" />,
    })
  }

  const addBuyerWillPayStep = () => {
    timelineSteps.push({
      type: "dot",
      date: acceptedAt,
      title:
      role === "artist"
        ? "Buyer akan melakukan pembayaran"
        : "Lakukan pembayaran melalui kode QR berikut",
      active: false,
      bold: false,
    })
  }



  const addPaymentConfirmedStep = () => {
  const paymentProofHref = getValidExternalLink(selectedOrder?.paymentProofLink)

  timelineSteps.push({
    date: paymentConfirmedAt,
    title: "Menunggu pembayaran",
    subtitles:
      role === "artist"
        ? ["Buyer telah melakukan pembayaran"]
        : ["Menunggu verifikasi pembayaran oleh admin"],
    linkText: paymentProofHref
        ? "Lihat Bukti Pembayaran"
        : null,
    linkHref: paymentProofHref || "",
    active: false,
    icon: <FiDollarSign />,
  })
}

  const addProcessedStartedStep = () => {
    timelineSteps.push({
      type: "dot",
      date: processedAt,
      title:
      role === "artist"
        ? "Kerjakan dan kirim hasil pesanan"
        : "Karya sedang dibuat",
      active: false,
      bold: false,
    })
  }

  const addResultUploadedStep = (active = false) => {
  timelineSteps.push({
    date: resultUploadedAt,
    title: "Pesanan diproses",
    subtitles: ["Hasil pesanan sudah dikirim"],
    linkText: "Lihat hasil",
    linkHref: selectedOrder?.resultLink,
    active,
    icon: <FiEdit2 className="text-[22px]" />,
    extra:
  role === "artist" &&
  active &&
  status === ORDER_STATUS.RESULT_UPLOADED ? (
    <div className="flex justify-end mt-3 w-full">
      <button
        type="button"
        onClick={() =>
          openUploadPopup("result", selectedOrder?.resultLink, true)
        }
        className="w-[190px] h-[46px] bg-black text-white rounded-[10px] text-[18px]"
      >
        Ganti Link Hasil
      </button>
    </div>
  ) : null,
    actions:
      role === "buyer" &&
      active &&
      status === ORDER_STATUS.RESULT_UPLOADED &&
      !selectedOrder?.revisionRequestedAt
        ? (
          <div className="flex justify-end gap-5 mt-3 w-full">
            <button
              type="button"
              onClick={() => setCurrentPage("revisionBrief")}
              className="w-[150px] h-[46px] bg-black text-white rounded-[10px] text-[18px]"
            >
              Ajukan Revisi
            </button>

            <button
              type="button"
              onClick={() => completeOrderByBuyer(id)}
              className="w-[190px] h-[46px] bg-black text-white rounded-[10px] text-[18px]"
            >
              Selesaikan Pesanan
            </button>
          </div>
        )
        : null,
  })
}

  if (isCancelled) {
    timelineSteps.push({
      date: cancelledAt,
      title: "Pesanan dibatalkan",
      subtitles: [cancelSubtitle],
      active: true,
      icon: <FiX className="text-[22px]" />,
    })

    if (hasResultUploadedAt) {
      addResultUploadedStep(false)
      addProcessedStartedStep()
      addPaymentConfirmedStep()
      addBuyerWillPayStep()
    } else if (hasProcessedAt) {
      timelineSteps.push({
        date: processedAt,
        title: "Pesanan diproses",
        subtitles:
        role === "artist"
         ? ["Kerjakan dan kirim hasil pesanan"]
         : ["Karya sedang dibuat"],
        active: false,
        icon: <FiEdit2 className="text-[20px]" />,
      })
      addPaymentConfirmedStep()
      addBuyerWillPayStep()
    } else if (hasPaymentConfirmedAt) {
      addPaymentConfirmedStep()
      addBuyerWillPayStep()
    } else if (hasAcceptedAt) {
      timelineSteps.push({
        date: acceptedAt,
        title: "Menunggu pembayaran",
        subtitles:
         role === "buyer"
          ? ["Lakukan pembayaran melalui kode QR berikut"]
          : ["Buyer akan melakukan pembayaran"],
        active: false,
        icon: <FiDollarSign className="text-[20px]" />,
      })
    }

    addCreatedStep(false)
  } else if (isCompleted) {
  timelineSteps.push({
  date: completedAt,
  title: "Pesanan selesai",
  subtitles: [],
  active: true,
  icon: <FiCheck className="text-[22px]" />,
  extra:
    role === "artist" ? (
      <div className="mt-[2px]">
        <p className="text-[20px] leading-[24px] text-yellow-500">
          Admin akan melakukan pembayaran pada pukul 10.00 WIB melalui rekening yang Anda daftarkan
        </p>

        <a
          href={ADMIN_WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-[20px] leading-[24px] text-[#09027C] underline mt-[2px]"
        >
          Hubungi Admin
        </a>
      </div>
    ) : null,
})

  if (selectedOrder?.revisionUploadedAt) {
    timelineSteps.push({
      date: revisionUploadedAt,
      title: "Pesanan direvisi",
      subtitles: ["Hasil revisi telah dikirim"],
      linkText: "Lihat hasil revisi",
      linkHref: selectedOrder?.revisionLink,
      active: false,
      icon: <FiRefreshCcw className="text-[22px]" />,
    })

    timelineSteps.push({
  type: "dot",
  date: revisionRequestedAt,
  title:
    role === "artist"
      ? "Buyer mengajukan revisi, kerjakan dan kirim hasil revisi"
      : "Revisi karya sedang dibuat",
  linkText: "Lihat brief revisi",
  linkOnClick: () => setCurrentPage("revisionBriefView"),
  active: false,
  bold: false,
})
  }

  addResultUploadedStep(false)
  addProcessedStartedStep()
  addPaymentConfirmedStep()
  addBuyerWillPayStep()
  addCreatedStep(false)
  } else if (isRevisionRequested) {
  timelineSteps.push({
    date: revisionRequestedAt,
    title: "Pesanan direvisi",
    subtitles:
      role === "artist"
        ? ["Buyer mengajukan revisi, kerjakan dan kirim hasil revisi"]
        : ["Revisi karya sedang dibuat"],
    linkText: "Lihat brief revisi",
    linkOnClick: () => setCurrentPage("revisionBriefView"),
    active: true,
    icon: <FiRefreshCcw className="text-[22px]" />,
    actions:
      role === "artist"
        ? (
          <div className="flex justify-end mt-3 w-full">
            <button
              type="button"
              onClick={() => openUploadPopup("revision")}
              className="w-[130px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
            >
              Upload
            </button>
          </div>
        )
        : null,
  })

  addResultUploadedStep(false)
  addProcessedStartedStep()
  addPaymentConfirmedStep()
  addBuyerWillPayStep()
  addCreatedStep(false)
  } else if (isRevisionUploaded) {
  timelineSteps.push({
    date: revisionUploadedAt,
    title: "Pesanan direvisi",
    subtitles: ["Hasil revisi telah dikirim"],
    linkText: "Lihat hasil revisi",
    linkHref: selectedOrder?.revisionLink,
    active: true,
    icon: <FiRefreshCcw className="text-[22px]" />,
    extra:
  role === "artist" ? (
    <div className="flex justify-end mt-3 w-full">
      <button
        type="button"
        onClick={() =>
          openUploadPopup("revision", selectedOrder?.revisionLink, true)
        }
        className="w-[230px] h-[46px] bg-black text-white rounded-[10px] text-[18px]"
      >
        Ganti Link Hasil Revisi
      </button>
    </div>
  ) : null,
    actions:
      role === "buyer"
        ? (
          <div className="flex justify-end mt-3 w-full">
            <button
              type="button"
              onClick={() => completeOrderByBuyer(id)}
              className="w-[210px] h-[46px] bg-black text-white rounded-[10px] text-[18px]"
            >
              Selesaikan Pesanan
            </button>
          </div>
        )
        : null,
  })

  timelineSteps.push({
  type: "dot",
  date: revisionRequestedAt,
  title:
    role === "artist"
      ? "Buyer mengajukan revisi, kerjakan dan kirim hasil revisi"
      : "Revisi karya sedang dibuat",
  linkText: "Lihat brief revisi",
  linkOnClick: () => setCurrentPage("revisionBriefView"),
  active: false,
  bold: false,
})

  addResultUploadedStep(false)
  addProcessedStartedStep()
  addPaymentConfirmedStep()
  addBuyerWillPayStep()
  addCreatedStep(false)
} else if (isResultUploaded) {
    addResultUploadedStep(true)

    addProcessedStartedStep()
    addPaymentConfirmedStep()
    addBuyerWillPayStep()
    addCreatedStep(false)
  } else if (isProcessed) {
    timelineSteps.push({
    date: processedAt,
    title: "Pesanan diproses",
    subtitles:
     role === "artist"
      ? ["Kerjakan dan kirim hasil pesanan"]
      : ["Karya sedang dibuat"],
    active: true,
    icon: <FiEdit2 className="text-[22px]" />,
    actions:
    role === "artist" ? (
          <div className="flex justify-end mt-[30px]">
            <button
              onClick={() => openUploadPopup("result")}
              className="w-[130px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
            >
              Upload
            </button>
          </div>
        ) : null,
    })

    addPaymentConfirmedStep()
    addBuyerWillPayStep()
    addCreatedStep(false)
  } else if (isBuyerConfirmedPayment) {
  const paymentProofHref = getValidExternalLink(selectedOrder?.paymentProofLink)

  timelineSteps.push({
    date: 
      role === "artist" 
        ? acceptedAt 
        : paymentConfirmedAt,
    title: "Menunggu pembayaran",
    subtitles:
      role === "artist"
        ? ["Buyer akan melakukan pembayaran"]
        : ["Menunggu verifikasi pembayaran oleh admin"],
    linkText:
      role === "buyer" && paymentProofHref
        ? "Lihat Bukti Pembayaran"
        : null,
    linkHref:
      role === "buyer" && paymentProofHref
        ? paymentProofHref
        : "",
    active: true,
    icon: <FiDollarSign />,
    extra:
      role === "buyer" && paymentProofHref ? (
        <div className="flex justify-end mt-3 w-full">
          <button
            type="button"
            onClick={() =>
              openPaymentProofPopup(selectedOrder?.paymentProofLink, true)
            }
            className="w-[230px] h-[46px] bg-black text-white rounded-[10px] text-[18px]"
          >
            Ganti Bukti Pembayaran
          </button>
        </div>
      ) : null,
    actions: null,
  })

  if (role === "buyer") {
    addBuyerWillPayStep() 
  }
  addCreatedStep(false)
  } else if (isAccepted) {
    timelineSteps.push({
      date: acceptedAt,
      title: "Menunggu pembayaran",
      subtitles:
        role === "buyer"
          ? ["Lakukan pembayaran melalui kode QR berikut"]
          : ["Buyer akan melakukan pembayaran"],
      active: true,
      icon: <FiDollarSign className="text-[22px]" />,
      extra:
        role === "buyer" ? (
          <>
            <div className="mt-4 w-[370px] max-w-full border-[1px] border-black bg-white flex flex-col items-center py-5">
              <p className="text-[20px] font-semibold mb-4">
                {totalPrice}
              </p>

              <DummyQR />
            </div>

            <p className="text-[20px] text-yellow-500 mt-4">
              Lakukan konfirmasi dengan mengirim bukti pembayaran berupa link google drive
            </p>
          </>
        ) : null,
      actions:
        role === "buyer" ? (
          <div className="flex justify-end gap-4 mt-4 w-full max-w-[580px] ml-auto">
            <button
  onClick={() => openPaymentProofPopup()}
  className="w-[150px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
>
  Konfirmasi
</button>

            <button
              onClick={() => {
                cancelOrder(id)
                setCurrentPage("profile")
              }}
              className="w-[130px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
            >
              Batalkan
            </button>
          </div>
        ) : null,
    })

    addCreatedStep(false)
  } else {
    timelineSteps.push({
      date: createdAt,
      title: role === "artist" ? "Pesanan masuk" : "Pesanan diajukan",
      subtitles:
      role === "artist"
        ? ["Tolak/Terima pesanan ini"]
        : ["Menunggu persetujuan artist"],
      active: true,
      icon: <LuClipboardList className="text-[20px]" />,
      actions:
        role === "buyer" && canCancel ? (
          <div className="flex justify-end mt-[30px]">
            <button
              onClick={() => {
                cancelOrder(id)
                setCurrentPage("profile")
              }}
              className="w-[130px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
            >
              Batalkan
            </button>
          </div>
        ) : role === "artist" && status === ORDER_STATUS.WAITING ? (
          <div className="flex justify-end gap-5 mt-[30px]">
            <button
              onClick={() => rejectOrderByArtist(id)}
              className="w-[110px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
            >
              Tolak
            </button>

            <button
              onClick={() => setShowPricePopup(true)}
              className="w-[130px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
            >
              Terima
            </button>
          </div>
        ) : null,
    })
  }

  return (
    <>
      {showPricePopup && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[80]" />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded-[28px] shadow-lg z-[90] px-10 py-10">
            <p className="text-[24px] text-center">
              Tentukan harga final untuk pesanan ini
            </p>

            <div className="flex items-center gap-4 mt-8">
              <p className="text-[24px]">
                Rp
              </p>

              <input
                value={finalPriceInput}
                onChange={handlePriceChange}
                className="w-[135px] h-[68px] border-[3px] border-black rounded-[18px] text-[24px] text-center outline-none"
              />
            </div>

            {priceNumber > 0 && (
              <p className="text-[16px] text-red-500 mt-3">
                Nominal harga yang akan diterima: {formatRupiah(receivedAmount)}
              </p>
            )}

            <div className="flex justify-end gap-7 mt-10">
              <button
                onClick={() => {
                  setShowPricePopup(false)
                  setFinalPriceInput("0")
                }}
                className="w-[130px] h-[46px] border-[3px] border-black rounded-[10px] text-[20px]"
              >
                Cancel
              </button>

              <button
                onClick={handleAcceptOrder}
                className="w-[140px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
              >
                Ajukan
              </button>
            </div>
          </div>
        </>
      )}

      {showUploadPopup && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[80]" />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[430px] bg-white rounded-[24px] shadow-lg z-[90] px-8 py-8">
            <p className="text-[24px] text-center">
              {isEditingUploadLink
               ? uploadMode === "revision"
                 ? "Ganti link G-drive hasil revisi"
                 : "Ganti link G-drive hasil pesanan"
               : uploadMode === "revision"
                 ? "Link G-drive hasil revisi"
                 : "Link G-drive"}
            </p>

            <input
              value={gdriveLink}
              onChange={(e) => {
  setGdriveLink(e.target.value)
  setUploadLinkError("")
}}
              placeholder={
                uploadMode === "revision"
                  ? "Masukkan link G-drive hasil revisi"
                  : "Masukkan link G-drive hasil pesanan"
              }
              className="w-full h-[46px] border-[3px] border-black rounded-[18px] px-4 text-[18px] outline-none mt-6"
            />

            <p className="text-[16px] text-[#8A8A8A] mt-2">
  Pastikan link benar dan akses file sudah dibuka.
</p>

            {uploadLinkError && (
  <p className="text-[#FD0707] text-[16px] mt-3">
    {uploadLinkError}
  </p>
)}

            <div className="flex justify-end mt-7">
              <button
                onClick={handleUploadResult}
                className="w-[130px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
              >
                {isEditingUploadLink ? "Simpan" : "Upload"}
              </button>
            </div>
          </div>
        </>
      )}

      {showPaymentProofPopup && (
  <>
    <div className="fixed inset-0 bg-black/40 z-40" />

    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F5F5] rounded-[18px] p-8 z-50 shadow-lg w-[520px]">
      <p className="text-[24px] text-center">
        {isEditingPaymentProof ? "Ganti Link Bukti Pembayaran" : "Link Bukti Pembayaran"}
      </p>

      <input
        value={paymentProofLink}
        onChange={(e) => {
          setPaymentProofLink(e.target.value)
          setPaymentProofError("")
        }}
        placeholder="Masukkan link G-drive bukti pembayaran"
        className="w-full h-[46px] border-[3px] border-black rounded-[18px] px-4 text-[18px] outline-none mt-6"
      />

      <p className="text-[16px] text-[#8A8A8A] mt-2">
  Pastikan link benar dan akses file sudah dibuka.
</p>

      {paymentProofError && (
        <p className="text-[#FD0707] text-[16px] mt-3">
          {paymentProofError}
        </p>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => {
            setShowPaymentProofPopup(false)
            setPaymentProofLink("")
            setPaymentProofError("")
            setIsEditingPaymentProof(false)
          }}
          className="w-[130px] h-[46px] border-[3px] border-black rounded-[10px] text-[20px]"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmitPaymentProof}
          className="w-[130px] h-[46px] bg-black text-white rounded-[10px] text-[20px]"
        >
          {isEditingPaymentProof ? "Simpan" : "Kirim"}
        </button>
      </div>
    </div>
  </>
)}

      <div className="w-full max-w-full border-[3px] border-[#D9D9D9] bg-[#F5F5F5] shadow-md overflow-hidden">
        <div className="flex justify-between items-center px-7 py-4 border-b-[2px] border-[#D9D9D9]">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentPage("profile")}
              className="flex items-center justify-center"
            >
              <IoArrowBack className="text-[22px]" />
            </button>

            <p className="text-[16px]">
             #{id ? id.slice(-6).toUpperCase() : '------'}
            </p>
          </div>

          <p className="text-[16px] text-yellow-500">
            {headerStatus}
          </p>
        </div>

        <div className="px-7 py-7 border-b-[2px] border-[#D9D9D9]">
          <div className="relative">
            {timelineSteps.length > 1 && (
              <div className="absolute left-[20px] top-[42px] bottom-[21px] w-[2px] bg-[#D9D9D9]" />
            )}

            <div className="flex flex-col gap-[28px]">
              {timelineSteps.map((step, index) => (
                <TimelineStep
                  key={`${step.title}-${index}`}
                  step={step}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-7 py-8">
          <div className="flex gap-7">
            <div className="w-[250px] h-[115px] border-[3px] border-black rounded-[18px] flex-shrink-0 overflow-hidden bg-white">
  {productCoverImageUrl && (
    <img
      src={productCoverImageUrl}
      alt={product}
      className="w-full h-full object-contain"
    />
  )}
</div>

            <div className="flex flex-col justify-center">
              <p className="text-[20px]">
                {displayName}
              </p>

              <p className="text-[20px] mt-2">
                {product} x{quantity}
              </p>

              <p className="text-[20px] mt-2">
                {price}
              </p>
            </div>
          </div>

          <p className="text-[16px] text-[#333333] leading-[28px] mt-4 break-words">
            {description}
          </p>
        </div>
      </div>
    </>
  )
}

export default OrderDetailPage