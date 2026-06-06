// Page khusus signup Artist
// Input data baru akan tersimpan sebagai artist baru
// Akun default artist tetap utuh

import { useState } from "react";
import { registerUser } from "../services/authService";

function SignupArtistUsernamePage({ setCurrentPage, signupData, setSignupData, onLoginSuccess }) {
  const [username, setUsername] = useState(
    signupData.username || signupData.suggestedUsername || ""
  );
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim()) {
      setError("Username wajib diisi");
      return;
    }

    try {
      const payload = { ...signupData, role: "artist", username };
      const session = await registerUser(payload);
      setSignupData({});
      onLoginSuccess(session.user);
    } catch (err) {
      setError(err.message || "Username sudah digunakan");
    }
  };

  return (
    <main className="w-full min-w-[1280px] min-h-[900px] relative pb-[140px]">

      <section aria-labelledby="signup-title" className="absolute top-[238px] left-[374px] w-[533px]">
        <h1 id="signup-title" className="w-full text-center font-normal text-black text-6xl tracking-[0] leading-[normal] whitespace-nowrap">
          SIGN UP
        </h1>

        <form className="mt-[34px] w-[533px]" onSubmit={handleSubmit}>
          <label htmlFor="artist-username" className="sr-only">Buat username</label>

          <div className="relative w-[533px] h-[66px] rounded-[20px] border-[3px] border-solid border-black">
            <input
              id="artist-username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              placeholder="Buat username"
              className="absolute top-0 left-0 w-full h-full rounded-[20px] px-[18px] font-normal text-black text-2xl tracking-[0] leading-[normal] placeholder:text-[#888181] outline-none"
              autoComplete="username"
            />
          </div>

          {error && <p className="mt-2 ml-[18px] text-red-600 text-[18px]">{error}</p>}

          <div className="mt-[41px] w-[533px] h-[66px] flex gap-[25px]">
  <button
    type="button"
    onClick={() => setCurrentPage("signupArtistLevel")}
    className="w-[254px] h-[66px] rounded-[20px] border-[3px] border-solid border-black flex items-center justify-center font-normal text-black text-[32px]"
  >
    BACK
  </button>

  <button
    type="submit"
    className="w-[254px] h-[66px] rounded-[20px] bg-black text-white flex items-center justify-center font-normal text-[32px]"
  >
    SIGN UP
  </button>
</div>
        </form>
      </section>
    </main>
  );
}

export default SignupArtistUsernamePage;
