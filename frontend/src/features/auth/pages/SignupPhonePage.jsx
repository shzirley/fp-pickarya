import { useState } from "react"

function SignupPhonePage({ setCurrentPage, signupData, setSignupData }) {
  const [phone, setPhone] = useState(signupData.phone || "")
  const [error, setError] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!phone.trim()) {
      setError("Nomor telepon wajib diisi")
      return
    }

    setSignupData((prev) => ({
      ...prev,
      phone: phone.trim(),
    }))

    if (signupData.role === "artist") {
      setCurrentPage("signupArtistBank")
      return
    }

    setCurrentPage("signupBuyerUsername")
  }

  return (
    <main className="w-full min-w-[1280px] min-h-[900px] relative pb-[140px]">
      <section
        aria-labelledby="signup-phone-title"
        className="absolute top-[238px] left-[374px] w-[533px]"
      >
        <h1
          id="signup-phone-title"
          className="w-full text-center font-normal text-black text-6xl tracking-[0] leading-[normal] whitespace-nowrap"
        >
          SIGN UP
        </h1>

        <form className="mt-[34px] w-[533px]" onSubmit={handleSubmit}>
          <label htmlFor="signup-phone" className="sr-only">
            Nomor telepon
          </label>

          <div className="relative w-[533px] h-[66px] rounded-[20px] border-[3px] border-solid border-black">
            <input
              id="signup-phone"
              name="phone"
              type="text"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
                setError("")
              }}
              placeholder="Masukkan nomor telepon"
              className="absolute top-0 left-0 w-full h-full rounded-[20px] px-[18px] font-normal text-black text-2xl tracking-[0] leading-[normal] placeholder:text-[#888181] outline-none"
              autoComplete="tel"
            />
          </div>

          <p className="mt-2 ml-[18px] text-red-600 text-[18px]">
            {error || "Pastikan nomor telepon tidak salah"}
          </p>

          <div className="mt-[20px] w-[533px] h-[66px] flex gap-[25px]">
  <button
    type="button"
    onClick={() => setCurrentPage("signupRole")}
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

export default SignupPhonePage