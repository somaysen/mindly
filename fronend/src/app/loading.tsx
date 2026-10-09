export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading Mindly"
      className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0d0c20] px-6 text-white"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#5965ed] text-lg font-semibold shadow-[0_8px_30px_rgba(89,101,237,0.35)]">
          <img src="/images/Frame 76.png" alt="" />
        </span>
        {/* <span className="text-xl font-semibold tracking-tight">
          <img className="w-20" src="./images/Group 10.png" alt="" />
        </span> */}
      </div>

      <div className="mt-8 h-1 w-36 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-[query-loading_1.2s_ease-in-out_infinite] rounded-full bg-[#8b8cff]" />
      </div>
      <p className="mt-4 text-sm text-white/60">Getting your workspace ready...</p>
    </main>
  );
}
