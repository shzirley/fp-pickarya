import { useId, useState } from "react";
import { authenticateWithGoogle, loginUser } from "../services/authService";
import GoogleSignInButton from "../../../shared/components/GoogleSignInButton";

function LoginPage({ setCurrentPage, setSignupData, onLoginSuccess }) {
  const emailId = useId();
  const passwordId = useId();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    if (!credentialResponse?.credential) {
      setError("Login Google gagal");
      return;
    }

    try {
      const result = await authenticateWithGoogle(credentialResponse.credential);

      if (result.needsSignup) {
        const { email, googleId, name } = result.prefill;
        setSignupData({
          email,
          googleId,
          authProvider: "google",
          suggestedUsername: name,
          fromPage: "login",
        });
        setCurrentPage("signupRole");
        return;
      }

      onLoginSuccess(result.session.user);
    } catch (err) {
      setError(err.message || "Login Google gagal");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      const session = await loginUser(formData);
      onLoginSuccess(session.user);
    } catch (err) {
      setError(err.message || "Password/email salah");
    }
  };

  return (
    <main className="w-full min-w-[1280px] min-h-[960px] relative pb-[200px]">

      <section aria-labelledby="login-title" className="absolute top-[199px] left-[374px] w-[535px]">
        <h1 id="login-title" className="absolute top-0 left-[166px] font-normal text-black text-6xl text-center tracking-[0] leading-[normal]">
          LOG IN
        </h1>

        <p className="absolute top-[83px] left-[107px] font-normal text-black text-2xl tracking-[0] leading-[normal]">
          Belum memiliki akun?{" "}
          <button
            type="button"
            onClick={() => setCurrentPage("signupAccount")}
            className="font-normal text-black text-2xl text-right tracking-[0] leading-[normal] underline"
          >
            Sign Up
          </button>
        </p>

        <form onSubmit={handleSubmit} className="absolute top-[139px] left-0 w-[535px] h-[293px]">
          <div className="absolute top-0 left-0 w-[533px] h-[66px] rounded-[20px] border-[3px] border-solid border-black">
            <label htmlFor={emailId} className="sr-only">Email</label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full h-full px-[16px] rounded-[20px] font-normal text-black text-2xl tracking-[0] leading-[normal] placeholder:text-[#888181] outline-none"
            />
          </div>

          <div className="absolute top-[95px] left-0 w-[533px] h-[66px] rounded-[20px] border-[3px] border-solid border-black">
            <label htmlFor={passwordId} className="sr-only">Password</label>
            <input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-full px-[16px] rounded-[20px] font-normal text-black text-2xl tracking-[0] leading-[normal] placeholder:text-[#888181] outline-none"
            />
          </div>

          {error && (
            <p className="absolute top-[162px] left-[18px] text-red-600 text-[18px]">
              {error}
            </p>
          )}

          <button type="button" className="absolute top-[180px] left-[164px] font-normal text-black text-2xl text-center tracking-[0] leading-[normal] underline">
            Lupa password?
          </button>

          <button type="submit" className="absolute top-[227px] left-0 w-[533px] h-[66px] rounded-[20px] bg-black flex items-center justify-center font-normal" aria-label="Log in">
            <span className="absolute top-3.5 left-[164px] w-[205px] font-normal text-white text-[32px] text-center tracking-[0] leading-[normal]">
              LOG IN
            </span>
          </button>

          <div className="absolute top-[310px] left-0 w-[533px] flex flex-col items-center gap-3">
            <span className="font-normal text-black text-xl">atau</span>
            <GoogleSignInButton
              text="signin_with"
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Login Google dibatalkan atau gagal")}
            />
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
