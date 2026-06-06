import { useEffect, useState } from "react"
import Header from "./shared/components/Header"
import Toast from "./shared/components/Toast"

import BuyerHomePage from "./features/marketplace/pages/BuyerHomePage"
import ArtistDetailPage from "./features/marketplace/pages/ArtistDetailPage"
import BriefPage from "./features/marketplace/pages/BriefPage"
import ProfilePage from "./features/profile/pages/ProfilePage"

import AdminLoginPage from "./features/auth/pages/AdminLoginPages"
import AdminDashboardPage from "./features/auth/pages/AdminDashboardPages"

import ArtistPortfolioUploadPage from "./features/artistDashboard/pages/ArtistPortfolioUploadPage"
import ArtistProductFormPage from "./features/artistDashboard/pages/ArtistProductFormPage"
import { getArtists, getArtistByUserId, uploadPortfolio, publishPortfolio, unpublishPortfolio, clearPortfolio } from "./features/auth/services/artistService"

import { createOrderAPI, getOrdersByBuyer, getOrdersByArtist } from "./features/auth/services/orderService"
import RevisionBriefPage from "./features/orders/pages/RevisionBriefPage"
import RevisionBriefViewPage from "./features/orders/pages/RevisionBriefViewPage"

import { artists } from "./features/marketplace/data/artists"


import {createOrder} from "./features/orders/utils/orderHelpers"

import { useOrderActions } from "./features/orders/hooks/useOrderActions"

import LoginPage from "./features/auth/pages/LoginPage"
import SignupAccountPage from "./features/auth/pages/SignupAccountPage"
import SignupRolePage from "./features/auth/pages/SignupRolePage"
import SignupBuyerUsernamePage from "./features/auth/pages/SignupBuyerUsernamePage"
import SignupArtistLevelPage from "./features/auth/pages/SignupArtistLevelPage"
import SignupArtistUsernamePage from "./features/auth/pages/SignupArtistUsernamePage"
import SignupPhonePage from "./features/auth/pages/SignupPhonePage"
import SignupArtistBankPage from "./features/auth/pages/SignupArtistBankPage"

import {
  getCurrentUser,
  logoutUser,
  deleteCurrentUserAccount,
} from "./features/auth/services/authService"

import {
  DEFAULT_BUYER,
  DEFAULT_ARTIST,
  MARKETPLACE_CATEGORIES,
  ARTIST_LEVELS,
} from "./shared/constants/appDefaults"

import {
  getCurrentBuyerName,
  getCurrentArtistInfo,
} from "./shared/utils/userHelpers"

import {
  getPostLoginNavigation,
  normalizeAuthUser,
} from "./shared/utils/authNavigation"

import LikedPortfolioPage from "./features/marketplace/pages/LikedPortfolioPage"


function App() {
  const applyAuthenticatedSession = (user) => {
    const normalizedUser = normalizeAuthUser(user)
    const navigation = getPostLoginNavigation(normalizedUser.role)

    setCurrentUser(normalizedUser)
    setIsLoggedIn(true)
    setRole(navigation.role)
    setCurrentPage(navigation.page)
    setActiveSidebar(navigation.sidebar)
    setActiveOrderStatus(navigation.orderStatus)
  }

  const handleLoginSuccess = (user) => {
    applyAuthenticatedSession(user)
  }

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    setIsLoggedIn(false)
    setRole("buyer")
    setCurrentPage("home")
  }

  const getArtistIdentityKeys = (artist = {}) => {
    return [
      artist.id,
      artist.email,
      artist.username,
      artist.name,
    ]
      .filter(Boolean)
      .map(String)
  }

  const isSameArtistByKeys = (artist, keys = []) => {
    const artistKeys = getArtistIdentityKeys(artist)
    return artistKeys.some((key) => keys.includes(key))
  }

  const handleDeleteAccount = async () => {
    const deletedUser = currentUser
    const deletedUserKeys = getArtistIdentityKeys(deletedUser)

    try {
      await deleteCurrentUserAccount()

      if (deletedUser?.role === "artist") {
        setArtistPortfolio(null)

        setPublishedArtists((prevArtists) =>
          prevArtists.filter(
            (artist) => !isSameArtistByKeys(artist, deletedUserKeys)
          )
        )

        setDeletedArtistKeys((prevKeys) => {
          const nextKeys = [...new Set([...prevKeys, ...deletedUserKeys])]
          localStorage.setItem(
            "pickaryaDeletedArtistKeys",
            JSON.stringify(nextKeys)
          )
          return nextKeys
        })

        setSelectedArtist((prevArtist) =>
          prevArtist && isSameArtistByKeys(prevArtist, deletedUserKeys)
            ? null
            : prevArtist
        )
      }

      setCurrentUser(null)
      setIsLoggedIn(false)
      setRole("buyer")
      setShowDeletePopup(false)
      setCurrentPage("home")
      showToast("Akun berhasil dihapus")
    } catch (error) {
      showToast(error.message || "Gagal menghapus akun")
    }
  }

  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState("home")
  const [role, setRole] = useState("buyer")
  const [signupData, setSignupData] = useState({})

  const [toastMessage, setToastMessage] = useState("")

  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([])

  const [selectedArtist, setSelectedArtist] = useState(null)
  const [portfolioIndex, setPortfolioIndex] = useState(0)
  const [showLoginWarning, setShowLoginWarning] = useState(false)

  const [showLikeWarning, setShowLikeWarning] = useState(false)

  const [likedArtistIdsByUser, setLikedArtistIdsByUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pickaryaLikedArtistIdsByUser")) || {}
    } catch {
      return {}
    }
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [showError, setShowError] = useState(false)

  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [artistPortfolio, setArtistPortfolio] = useState(null)
  const [publishedArtists, setPublishedArtists] = useState([])
  const [artistId, setArtistId] = useState(null)
  const [artistList, setArtistList] = useState([])

  const [deletedArtistKeys, setDeletedArtistKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pickaryaDeletedArtistKeys")) || []
    } catch {
      return []
    }
  })

  const addArtistProduct = (newProduct) => {
    setArtistPortfolio((prevPortfolio) => {
      if (!prevPortfolio) return prevPortfolio

      const updated = {
        ...prevPortfolio,
        products: [...(prevPortfolio.products || []), newProduct],
      }
      // Save draft to localStorage
      if (currentUser?.id) {
        localStorage.setItem(
          `pickaryaArtistPortfolioDraft_${currentUser.id}`,
          JSON.stringify(updated)
        )
      }
      return updated
    })

    setActiveSidebar("portfolio")
    setCurrentPage("profile")
    showToast("Produk berhasil ditambahkan")
  }

  const deleteArtistProduct = (productId) => {
    setArtistPortfolio((prevPortfolio) => {
      if (!prevPortfolio) return prevPortfolio

      return {
        ...prevPortfolio,
        products: (prevPortfolio.products || []).filter(
          (product) => product.id !== productId
        ),
      }
    })

    showToast("Produk berhasil dihapus")
  }

  const [activeSidebar, setActiveSidebar] = useState("account")
  const [activeOrderStatus, setActiveOrderStatus] = useState("waiting")

  const [accountProfiles, setAccountProfiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pickaryaAccountProfiles")) || {}
    } catch {
      return {}
    }
  })

  const currentAccountProfileKey =
    currentUser?.id ||
    currentUser?.email ||
    currentUser?.username ||
    currentUser?.name ||
    "guest"

  const currentAccountProfile =
    accountProfiles[currentAccountProfileKey] || {}

  const phone = currentAccountProfile.phone || ""
  const gender = currentAccountProfile.gender || ""

  const profilePhotoUrl = currentAccountProfile.profilePhotoUrl || ""

  const profilePhotoPosition =
    currentAccountProfile.profilePhotoPosition || { x: 0, y: 0 }

  const updateAccountProfile = (field, value) => {
    setAccountProfiles((prevProfiles) => {
      const nextProfiles = {
        ...prevProfiles,
        [currentAccountProfileKey]: {
          ...(prevProfiles[currentAccountProfileKey] || {}),
          [field]: value,
        },
      }

      localStorage.setItem(
        "pickaryaAccountProfiles",
        JSON.stringify(nextProfiles)
      )

      return nextProfiles
    })
  }

  const setPhone = (value) => {
    updateAccountProfile("phone", value)
  }

  const setGender = (value) => {
    updateAccountProfile("gender", value)
  }

  const syncPublishedArtistProfile = (changes) => {
    if (role !== "artist" || !currentUser) return

    const currentArtistId =
      currentUser?.id ||
      currentUser?.email ||
      currentUser?.username

    const currentArtistName =
      currentUser?.username ||
      currentUser?.name

    setPublishedArtists((prevArtists) =>
      prevArtists.map((artist) =>
        String(artist.id) === String(currentArtistId) ||
        artist.name === currentArtistName
          ? {
              ...artist,
              ...changes,
            }
          : artist
      )
    )
  }

  const setProfilePhotoUrl = (value) => {
    updateAccountProfile("profilePhotoUrl", value)
    syncPublishedArtistProfile({ profilePhotoUrl: value })
  }

  const setProfilePhotoPosition = (value) => {
    updateAccountProfile("profilePhotoPosition", value)
    syncPublishedArtistProfile({ profilePhotoPosition: value })
  }

  const [showDeletePopup, setShowDeletePopup] = useState(false)

  useEffect(() => {
    const savedUser = getCurrentUser()
    if (!savedUser) return
    applyAuthenticatedSession(savedUser)
  }, [])

  useEffect(() => {
  if (currentUser?.role === 'artist' && currentUser?.id) {
    getArtistByUserId(currentUser.id).then((data) => {
      if (data && data._id) {
        setArtistId(data._id)
        // Restore artist portfolio dari backend
        if (data.portfolioPages && data.portfolioPages.length > 0) {
          setArtistPortfolio({
            id: data._id,
            title: data.title || '',
            durationMin: data.durationMin || '1',
            durationMax: data.durationMax || '2',
            pages: data.portfolioPages || [],
            products: data.products || [],
            isPublished: data.isPublished || false,
          })
        } else {
          // Jika tidak ada di backend, coba restore dari localStorage
          const draft = localStorage.getItem(`pickaryaArtistPortfolioDraft_${currentUser.id}`)
          if (draft) {
            try {
              setArtistPortfolio(JSON.parse(draft))
            } catch (e) {
              console.error("Error parsing portfolio draft:", e)
            }
          }
        }
      }
    })
  }
}, [currentUser])

useEffect(() => {
  getArtists().then((data) => {
    if (data && Array.isArray(data)) {
      setArtistList(data)
    }
  })
}, [])

  useEffect(() => {
  if (isLoggedIn && currentUser?.id) {
    if (role === 'buyer') {
      getOrdersByBuyer(currentUser.id).then((data) => {
        if (Array.isArray(data)) {
          setOrders(data)
        }
      }).catch(err => console.error("Error fetching buyer orders:", err))
    } else if (role === 'artist') {
      getOrdersByArtist(currentUser.id).then((data) => {
        if (Array.isArray(data)) {
          setOrders(data)
        }
      }).catch(err => console.error("Error fetching artist orders:", err))
    }
  }
}, [isLoggedIn, currentUser?.id, role, currentPage])


useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}, [currentPage])


  const showToast = (msg, duration = 3000) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), duration)
  }

  const {
    cancelOrder,
    rejectOrderByArtist,
    acceptOrderByArtist,
    confirmPaymentByBuyer,
    uploadResultByArtist,
    uploadRevisionByArtist,
    requestRevisionByBuyer,
    completeOrderByBuyer,
    updatePaymentProofLink,
    updateResultLink,
    updateRevisionLink,
  } = useOrderActions({
    setOrders,
    setSelectedOrder,
    setCurrentPage,
    setActiveSidebar,
    setActiveOrderStatus,
    showToast,
  })

  const categories = MARKETPLACE_CATEGORIES
  const artistLevels = ARTIST_LEVELS

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat))
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  const removeCategory = (cat) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== cat))
  }

  const toggleLevel = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter((item) => item !== level))
    } else {
      setSelectedLevels([...selectedLevels, level])
    }
  }

  const removeLevel = (level) => {
    setSelectedLevels(selectedLevels.filter((item) => item !== level))
  }

  const currentBuyerName = getCurrentBuyerName(currentUser, DEFAULT_BUYER)

  const marketplaceArtists = [
    ...artistList,
    ...artists.filter(
      (dummyArtist) =>
        !artistList.some(
          (dbArtist) => String(dbArtist.id) === String(dummyArtist.id) || dbArtist.name === dummyArtist.name
        )
    ),
  ].filter((artist) => !isSameArtistByKeys(artist, deletedArtistKeys))

  const currentLikedUserKey =
    currentUser?.id ||
    currentUser?.email ||
    currentUser?.username ||
    currentUser?.name ||
    "guest"

  const likedArtistIds =
    likedArtistIdsByUser[currentLikedUserKey] || []

  const isArtistLiked = (artist) => {
    return likedArtistIds.some(
      (artistId) => String(artistId) === String(artist?.id)
    )
  }

  const likedArtists = marketplaceArtists.filter((artist) =>
    isArtistLiked(artist)
  )

  const toggleLikedArtist = (artist) => {
    if (!artist) return

    if (!isLoggedIn) {
      setShowLikeWarning(true)
      return
    }

    setLikedArtistIdsByUser((prevLikedData) => {
      const previousLikedIds = prevLikedData[currentLikedUserKey] || []
      const artistId = artist.id

      const nextLikedIds = previousLikedIds.some(
        (likedId) => String(likedId) === String(artistId)
      )
        ? previousLikedIds.filter(
            (likedId) => String(likedId) !== String(artistId)
          )
        : [...previousLikedIds, artistId]

      const nextLikedData = {
        ...prevLikedData,
        [currentLikedUserKey]: nextLikedIds,
      }

      localStorage.setItem(
        "pickaryaLikedArtistIdsByUser",
        JSON.stringify(nextLikedData)
      )

      return nextLikedData
    })

    setShowLikeWarning(false)
  }

  const currentArtist = getCurrentArtistInfo({
    role,
    currentUser,
    artists: marketplaceArtists,
    defaultArtist: DEFAULT_ARTIST,
  })

  const normalizeProductTag = (tag) => {
    const cleanTag = String(tag || "").replace("#", "").trim()

    const matchedCategory = categories.find(
      (category) => category.toLowerCase() === cleanTag.toLowerCase()
    )

    return matchedCategory || cleanTag
  }

  const buildPublishedArtist = (portfolio) => {
    const portfolioProducts = portfolio?.products || []
    const portfolioPages = portfolio?.pages || []

    const artistId =
      currentUser?.id ||
      currentUser?.email ||
      currentUser?.username ||
      `published-artist-${Date.now()}`

    const artistName =
      currentUser?.username || currentUser?.name || "artist-baru"

    return {
      id: artistId,
      name: artistName,
      profilePhotoUrl,
      profilePhotoPosition,
      level: currentUser?.artistLevel || "beginner",
      rating: 0,
      duration: `${portfolio.durationMin}-${portfolio.durationMax} hari`,
      tags: [
        ...new Set(
          portfolioProducts.map((product) =>
            normalizeProductTag(product.tag)
          )
        ),
      ],
      coverImageUrl: portfolioPages[0]?.imageUrl || "",
      portfolioPages,
      portfolio: portfolioPages.map((page) => page.imageUrl),
      products: portfolioProducts.map((product) => {
        const cleanTag = normalizeProductTag(product.tag)

        return {
          tag: `#${cleanTag.toLowerCase()}`,
          price: `Rp${Number(product.priceMin).toLocaleString(
            "id-ID"
          )} - Rp${Number(product.priceMax).toLocaleString("id-ID")}`,
          coverImageUrl: product.coverImageUrl || "",
        }
      }),
    }
  }

  const publishArtistPortfolio = async () => {
  const resolvedArtistId = artistId || artistPortfolio?.id
  console.log("DEBUG: publishArtistPortfolio called, artistId=", artistId, "portfolio=", artistPortfolio)
  
  if (!artistPortfolio || artistPortfolio.pages.length === 0) {
    showToast("Portfolio masih kosong, silakan upload gambar terlebih dahulu")
    return
  }

  if (!resolvedArtistId) {
    showToast("Error: Artist ID tidak ditemukan. Silakan refresh dan login ulang")
    return
  }

  try {
    console.log("DEBUG: Sending portfolio to backend...")
    await uploadPortfolio(resolvedArtistId, {
      title: artistPortfolio?.title,
      durationMin: artistPortfolio?.durationMin,
      durationMax: artistPortfolio?.durationMax,
      pages: artistPortfolio?.pages || [],
      products: artistPortfolio?.products || [],
    })
    
    console.log("DEBUG: Portfolio uploaded, publishing...")
    await publishPortfolio(resolvedArtistId)

    // Clear draft from localStorage
    localStorage.removeItem(`pickaryaArtistPortfolioDraft_${currentUser.id}`)

    getArtists().then((data) => {
      if (data && Array.isArray(data)) {
        setArtistList(data)
      }
    })
    
    setArtistPortfolio((prevPortfolio) => {
  if (!prevPortfolio) return prevPortfolio

  const updatedPortfolio = {
    ...prevPortfolio,
    isPublished: true,
  }

  const publishedArtist = buildPublishedArtist(updatedPortfolio)
  const publishedArtistKeys = getArtistIdentityKeys(publishedArtist)

  setDeletedArtistKeys((prevKeys) => {
    const nextKeys = prevKeys.filter(
      (key) => !publishedArtistKeys.includes(key)
    )
    localStorage.setItem(
      "pickaryaDeletedArtistKeys",
      JSON.stringify(nextKeys)
    )
    return nextKeys
  })

  setPublishedArtists((prevArtists) => [
    publishedArtist,
    ...prevArtists.filter(
      (artist) =>
        String(artist.id) !== String(publishedArtist.id) &&
        artist.name !== publishedArtist.name
    ),
  ])

  return updatedPortfolio
})

    showToast("Portofolio berhasil dipublikasikan")
  } catch (error) {
    console.error("Error publishing portfolio:", error)
    showToast(error.message || "Gagal mempublikasikan portofolio")
  }
}

 const deleteArtistPortfolio = async () => {
  try {
    if (artistId) {
      await clearPortfolio(artistId) // ✅ hapus dari MongoDB
    }

    setArtistPortfolio(null)
    localStorage.removeItem(`pickaryaArtistPortfolioDraft_${currentUser?.id}`)

    // Refresh artist list
    getArtists().then((data) => {
      if (data && Array.isArray(data)) {
        setArtistList(data)
      }
    })

    showToast("Portofolio berhasil dihapus")
  } catch (error) {
    console.error("Error deleting portfolio:", error)
    showToast("Gagal menghapus portofolio")
  }
}
  const filteredArtists = marketplaceArtists.filter((artist) => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase()

    const artistSearchText = [
      artist.name,
      artist.username,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchSearch =
      normalizedSearchQuery === "" ||
      artistSearchText.includes(normalizedSearchQuery)

    const matchCategory =
      selectedCategories.length === 0 ||
      artist.tags.some((tag) => selectedCategories.includes(tag))

    const matchLevel =
      selectedLevels.length === 0 ||
      selectedLevels.includes(artist.level)

    return matchSearch && matchCategory && matchLevel
  })

  const openDetail = (artist) => {
  setSelectedArtist(artist)
  setPortfolioIndex(0)
  setShowLikeWarning(false)
  setShowLoginWarning(false)
  setCurrentPage("detail")
}

 const handleSubmitBrief = async () => {
  if (!selectedProduct || !quantity || Number(quantity) < 1 || !description) {
    setShowError(true)
    return
  }

  try {
    const newOrder = createOrder({
      selectedArtist,
      selectedProduct,
      quantity,
      description,
      currentBuyerName,
      currentUser,
    })

    const savedOrder = await createOrderAPI(newOrder)

    if (!savedOrder || savedOrder.error) {
      throw new Error(savedOrder?.error || "Gagal menyimpan pesanan")
    }

    setOrders((prevOrders) => [savedOrder, ...prevOrders].filter(Boolean))
    setCurrentPage("home")

    setSelectedProduct(null)
    setQuantity("")
    setDescription("")
    setShowError(false)
    showToast("Pesanan berhasil dibuat")
  } catch (error) {
    console.error("Gagal membuat pesanan:", error)
    showToast(error.message || "Gagal menyimpan pesanan ke database")
  }
}

  let page

  switch (currentPage) {
    case "home":
      page = (
        <BuyerHomePage
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          removeCategory={removeCategory}
          artistLevels={artistLevels}
          selectedLevels={selectedLevels}
          toggleLevel={toggleLevel}
          removeLevel={removeLevel}
          filteredArtists={filteredArtists}
          searchQuery={searchQuery}
          openDetail={openDetail}
        />
      )
      break

    case "likedPortfolio":
      page = (
        <LikedPortfolioPage
          isLoggedIn={isLoggedIn}
          likedArtists={likedArtists}
          openDetail={openDetail}
          setCurrentPage={setCurrentPage}
          selectedCategories={selectedCategories}
          isArtistLiked={isArtistLiked}
          toggleLikedArtist={toggleLikedArtist}
        />
      )
      break

    case "detail":
      page = (
        <ArtistDetailPage
          selectedArtist={selectedArtist}
          portfolioIndex={portfolioIndex}
          setPortfolioIndex={setPortfolioIndex}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentPage={setCurrentPage}
          showLoginWarning={showLoginWarning}
          setShowLoginWarning={setShowLoginWarning}
          showLikeWarning={showLikeWarning}
          setShowLikeWarning={setShowLikeWarning}
          isArtistLiked={isArtistLiked(selectedArtist)}
          toggleLikedArtist={toggleLikedArtist}
          similarArtists={marketplaceArtists.filter(
            (a) => a.id !== selectedArtist?.id
          )}
          openDetail={openDetail}
        />
      )
      break

    case "brief":
      page = (
        <BriefPage
          selectedArtist={selectedArtist}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          description={description}
          setDescription={setDescription}
          handleSubmitBrief={handleSubmitBrief}
          showError={showError}
          setCurrentPage={setCurrentPage}
        />
      )
      break

    case "profile":
      page = (
        <ProfilePage
          role={role}
          currentArtist={currentArtist}
          artistPortfolio={artistPortfolio}
          onDeletePortfolio={deleteArtistPortfolio}
          onDeleteProduct={deleteArtistProduct}
          onPublishPortfolio={publishArtistPortfolio}
          currentPage={currentPage}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
          activeOrderStatus={activeOrderStatus}
          setActiveOrderStatus={setActiveOrderStatus}
          showDeletePopup={showDeletePopup}
          setShowDeletePopup={setShowDeletePopup}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          phone={phone}
          setPhone={setPhone}
          gender={gender}
          setGender={setGender}
          profilePhotoUrl={profilePhotoUrl}
          profilePhotoPosition={profilePhotoPosition}
          setProfilePhotoUrl={setProfilePhotoUrl}
          setProfilePhotoPosition={setProfilePhotoPosition}
          showToast={showToast}
          orders={orders}
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
          currentUser={currentUser}
        />
      )
      break

    case "orderDetail":
      page = (
        <ProfilePage
          role={role}
          currentArtist={currentArtist}
          artistPortfolio={artistPortfolio}
          onDeletePortfolio={deleteArtistPortfolio}
          onDeleteProduct={deleteArtistProduct}
          onPublishPortfolio={publishArtistPortfolio}
          currentPage={currentPage}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          activeSidebar="orders"
          setActiveSidebar={setActiveSidebar}
          activeOrderStatus={activeOrderStatus}
          setActiveOrderStatus={setActiveOrderStatus}
          showDeletePopup={showDeletePopup}
          setShowDeletePopup={setShowDeletePopup}
          setCurrentPage={setCurrentPage}
          onDeleteAccount={handleDeleteAccount}
          phone={phone}
          setPhone={setPhone}
          gender={gender}
          setGender={setGender}
          profilePhotoUrl={profilePhotoUrl}
          profilePhotoPosition={profilePhotoPosition}
          setProfilePhotoUrl={setProfilePhotoUrl}
          setProfilePhotoPosition={setProfilePhotoPosition}
          showToast={showToast}
          orders={orders}
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
          currentUser={currentUser}
        />
      )
      break

    case "revisionBrief":
      page = (
        <RevisionBriefPage
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          requestRevisionByBuyer={requestRevisionByBuyer}
          setCurrentPage={setCurrentPage}
        />
      )
      break

    case "revisionBriefView":
      page = (
        <RevisionBriefViewPage
          selectedOrder={selectedOrder}
          setCurrentPage={setCurrentPage}
        />
      )
      break

    case "artistPortfolioUpload":
      page = (
        <ArtistPortfolioUploadPage
          initialPortfolio={artistPortfolio}
          onUploadPortfolio={(newPortfolio) => {
            setArtistPortfolio(newPortfolio)
            // Save draft to localStorage
            if (currentUser?.id) {
              localStorage.setItem(
                `pickaryaArtistPortfolioDraft_${currentUser.id}`,
                JSON.stringify(newPortfolio)
              )
            }
            setActiveSidebar("portfolio")
            setCurrentPage("profile")
            showToast(
              artistPortfolio
                ? "Portofolio berhasil diperbarui"
                : "Portofolio berhasil diupload"
            )
          }}
          setCurrentPage={setCurrentPage}
        />
      )
      break

    case "artistProductForm":
      page = (
        <ArtistProductFormPage
          portfolio={artistPortfolio}
          onAddProduct={addArtistProduct}
          setCurrentPage={setCurrentPage}
        />
      )
      break

    case "login":
      page = (
        <LoginPage
          setCurrentPage={setCurrentPage}
          setSignupData={setSignupData}
          onLoginSuccess={handleLoginSuccess}
        />
      )
      break

    case "signupAccount":
      page = (
        <SignupAccountPage
          setCurrentPage={setCurrentPage}
          signupData={signupData}
          setSignupData={setSignupData}
          onLoginSuccess={handleLoginSuccess}
        />
      )
      break

    case "signupRole":
      page = (
        <SignupRolePage
          setCurrentPage={setCurrentPage}
          signupData={signupData}
          setSignupData={setSignupData}
        />
      )
      break

    case "signupPhone":
      page = (
        <SignupPhonePage
          setCurrentPage={setCurrentPage}
          signupData={signupData}
          setSignupData={setSignupData}
        />
      )
      break

    case "signupArtistBank":
      page = (
        <SignupArtistBankPage
          setCurrentPage={setCurrentPage}
          signupData={signupData}
          setSignupData={setSignupData}
        />
      )
      break

    case "signupBuyerUsername":
      page = (
        <SignupBuyerUsernamePage
          setCurrentPage={setCurrentPage}
          signupData={signupData}
          setSignupData={setSignupData}
          onLoginSuccess={handleLoginSuccess}
        />
      )
      break

    case "signupArtistLevel":
      page = (
        <SignupArtistLevelPage
          setCurrentPage={setCurrentPage}
          signupData={signupData}
          setSignupData={setSignupData}
        />
      )
      break

    case "signupArtistUsername":
      page = (
        <SignupArtistUsernamePage
          setCurrentPage={setCurrentPage}
          signupData={signupData}
          setSignupData={setSignupData}
          onLoginSuccess={handleLoginSuccess}
        />
      )
      break

    default:
      page = <div>Page not found</div>
  }

   if (window.location.pathname === '/admin') {
    return <AdminLoginPage />
  }
  if (window.location.pathname === '/admin/dashboard') {
    return <AdminDashboardPage />
  }
  
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        role={role}
        setActiveSidebar={setActiveSidebar}
        setActiveOrderStatus={setActiveOrderStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Toast message={toastMessage} />

      {page}
    </div>
    )
  
  }
export default App