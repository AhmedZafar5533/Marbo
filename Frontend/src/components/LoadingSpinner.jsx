

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/50 ">
            <div className="w-16 h-16 border-4 border-t-gray-300 border-indigo-700 rounded-full animate-spin" />
        </div>
    )
}
