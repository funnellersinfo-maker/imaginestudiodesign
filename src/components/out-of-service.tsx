/**
 * OutOfService — Pantalla de servicio descontinuado.
 * Sin enlaces, sin tracking, sin pixels.
 * Solo un mensaje claro y grande.
 */
export default function OutOfService() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050510] px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 mb-10">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-none">
          OUT OF SERVICE
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 mb-2">
          This website is no longer available.
        </p>
        <p className="text-base sm:text-lg text-gray-500">
          Este sitio web ya no está disponible.
        </p>
      </div>
    </main>
  );
}
