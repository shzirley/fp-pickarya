import { useId, useState } from "react";

const roleOptions = [
  { id: "buyer", label: "Buyer" },
  { id: "artist", label: "Artist" },
];

function SignupRolePage({ setCurrentPage, signupData, setSignupData }) {
  const [selectedRole, setSelectedRole] = useState(signupData.role || "");
  const [error, setError] = useState("");
  const radioName = useId();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedRole) {
      setError("Pilih role terlebih dahulu");
      return;
    }

    setSignupData((prev) => ({ ...prev, role: selectedRole }));

    setCurrentPage("signupPhone")
  };

  return (
    <main className="w-full min-w-[1280px] min-h-[900px] relative pb-[140px]">

      <section aria-labelledby="signup-title" className="absolute inset-0">
        <h1 id="signup-title" className="absolute top-[239px] left-[529px] font-normal text-black text-6xl tracking-[0] leading-[normal]">
          SIGN UP
        </h1>

        <form onSubmit={handleSubmit} className="contents">
          <fieldset className="absolute top-[325px] left-[376px] w-[533px] h-[165px] rounded-[20px] border-[3px] border-solid border-black">
            <legend className="sr-only">Daftar sebagai</legend>
            <div className="absolute top-[30px] left-[41px] font-normal text-black text-2xl tracking-[0] leading-[normal]">
              Daftar sebagai:
            </div>

            <div className="absolute top-[68px] left-[41px] flex flex-col gap-[9px]">
              {roleOptions.map((option) => (
                <label key={option.id} className="flex items-start gap-[11px] cursor-pointer">
                  <span className="relative mt-1 block w-5 h-5">
                    <input
                      type="radio"
                      name={radioName}
                      value={option.id}
                      checked={selectedRole === option.id}
                      onChange={() => {
                        setSelectedRole(option.id);
                        setError("");
                      }}
                      className="peer sr-only"
                    />
                    <span className="block w-5 h-5 rounded-[10px] border-2 border-solid border-black" />
                    <span className="pointer-events-none absolute top-1/2 left-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black opacity-0 peer-checked:opacity-100" />
                  </span>
                  <span className="font-normal text-black text-2xl tracking-[0] leading-[normal]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="absolute top-[498px] left-[394px] text-red-600 text-[18px]">
              {error}
            </p>
          )}

          <div className="absolute top-[540px] left-[374px] w-[533px] h-[66px] flex gap-[25px]">
  <button
    type="button"
    onClick={() => setCurrentPage(signupData.fromPage || "signupAccount")}
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
  );
}

export default SignupRolePage;
