export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-red-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-red-400 animate-spin-reverse"></div>
        <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-red-300 animate-spin"></div>
      </div>
    </div>
  );
}
