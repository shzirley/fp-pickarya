import { useState } from "react"

function SignupArtistBankPage({ setCurrentPage, signupData, setSignupData }) {
  const [bankName, setBankName] = useState(signupData.bankName || "")
  const [bankAccountNumber, setBankAccountNumber] = useState(
    signupData.bankAccountNumber || ""
  )
  const [error, setError] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!bankName.trim()) {
      setError("Nama bank wajib diisi")
      return
    }

    if (!bankAccountNumber.trim()) {
      setError("Nomor rekening wajib diisi")
      return
    }

    setSignupData((prev) => ({
      ...prev,
      bankName: bankName.trim().toUpperCase(),
      bankAccountNumber: bankAccountNumber.trim(),
    }))

    setCurrentPage("signupArtistLevel")
  }

  return (
    <main className="w-full min-w-[1280px] min-h-[980px] relative pb-[140px]">
      <section
        aria-labelledby="signup-bank-title"
        className="absolute top-[210px] left-[374px] w-[533px]"
      >
        <h1
          id="signup-bank-title"
          className="w-full text-center font-normal text-black text-6xl tracking-[0] leading-[normal] whitespace-nowrap"
        >
          SIGN UP
        </h1>

        <form className="mt-[34px] w-[533px]" onSubmit={handleSubmit}>
          <label htmlFor="signup-bank-name" className="sr-only">
            Nama bank
          </label>

          <div className="relative w-[533px] h-[66px] rounded-[20px] border-[3px] border-solid border-black">
            <input
              id="signup-bank-name"
              name="bankName"
              type="text"
              value={bankName}
              onChange={(event) => {
                setBankName(event.target.value)
                setError("")
              }}
              placeholder="Nama bank"
              className="absolute top-0 left-0 w-full h-full rounded-[20px] px-[18px] font-normal text-black text-2xl tracking-[0] leading-[normal] placeholder:text-[#888181] outline-none"
            />
          </div>

          <label htmlFor="signup-bank-number" className="sr-only">
            Nomor rekening
          </label>

          <div className="relative w-[533px] h-[66px] rounded-[20px] border-[3px] border-solid border-black mt-[24px]">
            <input
              id="signup-bank-number"
              name="bankAccountNumber"
              type="text"
              value={bankAccountNumber}
              onChange={(event) => {
                setBankAccountNumber(event.target.value)
                setError("")
              }}
              placeholder="Nomor rekening"
              className="absolute top-0 left-0 w-full h-full rounded-[20px] px-[18px] font-normal text-black text-2xl tracking-[0] leading-[normal] placeholder:text-[#888181] outline-none"
            />
          </div>

          <p className="mt-2 ml-[18px] text-red-600 text-[18px]">
            {error || "Pastikan nomor rekening tidak salah"}
          </p>

          <div className="mt-[20px] w-[533px] h-[66px] flex gap-[25px]">
  <button
    type="button"
    onClick={() => setCurrentPage("signupPhone")}
    className="w-[254px] h-[66px] rounded-[20px] border-[3px] border-solid border-black flex items-center justify-center font-normal text-black text-[32px]"
  >
    BACK
  </button>

  <button
    type="submit"
    className="w-[254px] h-[66px] rounded-[20px] bg-black text-white flex items-center justify-center font-normal text-[32px]"
  >
    NEXT
  </button>
</div>
        </form>
      </section>
    </main>
  )
}

export default SignupArtistBankPage