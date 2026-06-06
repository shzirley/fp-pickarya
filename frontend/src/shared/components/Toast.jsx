function Toast({ message }) {
  if (!message) return null

  return (
    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-[14px] z-[100] text-[20px]">
      {message}
    </div>
  )
}

export default Toast