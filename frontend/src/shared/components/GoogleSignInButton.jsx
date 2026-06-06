import { GoogleLogin } from "@react-oauth/google";

function GoogleSignInButton({ onSuccess, onError, text = "continue_with" }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="text-center text-[#888181] text-lg">
        Google Sign-In belum dikonfigurasi (VITE_GOOGLE_CLIENT_ID)
      </p>
    );
  }

  return (
    <div className="flex justify-center [&>div]:!w-full [&>div>div]:!w-full">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text={text}
        shape="rectangular"
        theme="outline"
        size="large"
        width="533"
        locale="id"
      />
    </div>
  );
}

export default GoogleSignInButton;
