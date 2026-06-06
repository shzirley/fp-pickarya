function ProfileConfirmPopup({
  message = "",
  confirmText = "OK",
  cancelText = "Cancel",
  onCancel = () => {},
  onConfirm = () => {},
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F5F5] rounded-[18px] p-8 z-50 shadow-lg">
        <p className="text-[20px] text-center">
          {message}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="w-[100px] h-[42px] border border-black rounded-[10px] text-[20px]"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="w-[100px] h-[42px] bg-black text-white rounded-[10px] text-[20px]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  )
}

export default ProfileConfirmPopup