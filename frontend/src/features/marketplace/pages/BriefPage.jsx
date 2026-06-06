// Halaman membuat brief / pesanan ke artist

import { useState } from "react"

import {
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5"

import {
  FiAlertCircle,
} from "react-icons/fi"
import ProfileAvatar from "../../../shared/components/ProfileAvatar"

function BriefPage({
  selectedArtist,
  selectedProduct,
  setSelectedProduct,
  quantity,
  setQuantity,
  description,
  setDescription,
  handleSubmitBrief,
  showError,
  setCurrentPage,
}) {

  const [showDropdown, setShowDropdown] = useState(false)

  const handleQuantityChange = (event) => {
  const numbersOnly = event.target.value.replace(/\D/g, "")
  setQuantity(numbersOnly)
}

if (!selectedArtist) {
  return (
    <div className="pt-[140px] text-center text-red-500">
      Artist belum dipilih
    </div>
  )
}

  return (
    <div className="px-[70px] pt-[140px]">

      <p className="text-[32px] text-center">
        Brief Pesanan
      </p>

      <div className="flex items-center gap-4 mt-4">
  <ProfileAvatar
  imageUrl={
    selectedArtist.profilePhotoUrl ||
    selectedArtist.profileImageUrl ||
    selectedArtist.profileImage ||
    ""
  }
  sizeClass="w-[56px] h-[56px]"
  iconClass="text-[28px]"
/>

  <div>
    <p className="text-[16px] text-[#8A8A8A] leading-[20px]">
      Artist
    </p>

    <p className="text-[24px] font-semibold leading-[28px]">
      {selectedArtist.name}
    </p>
  </div>
</div>

      {/* PRODUCT */}

      <div className="flex gap-4 mt-6">

        <div className="flex-1 relative">

          <p className="text-[20px] mb-2">
            Produk
          </p>

          <button
            onClick={() =>
              setShowDropdown(!showDropdown)
            }
            className="w-full h-[60px] border-[3px] border-black rounded-[18px] px-5 flex items-center justify-between text-[20px]"
          >

            {
              selectedProduct
                ? `${selectedProduct.tag} ${selectedProduct.price}`
                : "Pilih produk"
            }

            {
              showDropdown ? (
                <IoChevronUp className="text-[24px]" />
              ) : (
                <IoChevronDown className="text-[24px]" />
              )
            }

          </button>

          {
            showDropdown && (
              <div className="absolute top-[90px] left-0 w-full bg-[#F5F5F5] border shadow-lg rounded-[18px] p-5 max-h-[300px] overflow-y-auto z-30">

                <div className="flex flex-col gap-4">

                  {
                    selectedArtist.products.map((product) => (
                      <button
                        key={product.tag}
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowDropdown(false)
                        }}
                        className="flex gap-4 items-center text-left"
                      >

                        <div className="w-[85px] h-[55px] border-[3px] border-black rounded-[14px] overflow-hidden bg-white shrink-0">
  {product.coverImageUrl && (
    <img
      src={product.coverImageUrl}
      alt={product.tag}
      className="w-full h-full object-contain"
    />
  )}
</div>

                        <div>

                          <p className="text-[20px]">
                            {product.tag}
                          </p>

                          <p className="text-[20px]">
                            {product.price}
                          </p>

                        </div>

                      </button>
                    ))
                  }

                </div>

              </div>
            )
          }

          {selectedProduct?.coverImageUrl && (
  <div className="mt-4 w-[180px] h-[100px] border-[3px] border-black rounded-[14px] overflow-hidden bg-white">
    <img
      src={selectedProduct.coverImageUrl}
      alt={selectedProduct.tag}
      className="w-full h-full object-contain"
    />
  </div>
)}

        </div>

        {/* JUMLAH */}

        <div className="w-[120px]">

          <p className="text-[20px] mb-2">
            Jumlah
          </p>

          <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={quantity}
  onChange={handleQuantityChange}
  className="w-[140px] h-[56px] border-[2px] border-black rounded-[14px] px-4 text-[20px] outline-none"
/>

          {
            Number(quantity) < 1 && (
              <p className="text-red-500 text-[16px] mt-2">
                Minimal 1
              </p>
            )
          }

        </div>

      </div>

      {/* DESKRIPSI */}

      <div className="mt-8">

        <p className="text-[20px] mb-2">
          Deskripsi Request
        </p>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Masukkan deskripsi request"
          className="w-full h-[180px] border-[3px] border-black rounded-[18px] p-5 text-[20px] outline-none resize-none placeholder:text-[#8E8E8E]"
        />

      </div>

      {
        showError && (
          <div className="flex items-center gap-2 mt-3 text-red-500">

            <FiAlertCircle className="text-[22px]" />

            <p className="text-[20px]">
              Lengkapi brief pesananmu
            </p>

          </div>
        )
      }

      {/* BUTTON */}

      <div className="flex justify-center gap-5 mt-10 pb-[50px]">

        <button
          onClick={() => setCurrentPage("home")}
          className="w-[150px] h-[50px] bg-black text-white rounded-[12px] text-[20px]"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmitBrief}
          className="w-[150px] h-[50px] bg-black text-white rounded-[12px] text-[20px]"
        >
          Kirim
        </button>

      </div>

    </div>
  )
}

export default BriefPage