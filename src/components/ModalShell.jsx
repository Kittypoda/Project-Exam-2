export default function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md md:max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 font-alexandria font-medium text-sm"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
