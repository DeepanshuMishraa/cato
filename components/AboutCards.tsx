import FCard from "./FeatureCardOne";

export default function FeatureCard() {
  return (
    <div className="w-full">
      <div id="how-it-works" className="flex flex-col items-center justify-center min-h-[100svh] px-4 sm:px-6">
        <div className="max-w-3xl mx-auto border-b px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-3xl mx-auto py-6 sm:py-8 mt-6 sm:mt-8 gap-4 sm:gap-0">
            <div>
              <p className="text-gray-500 font-semibold text-sm sm:text-base">Meet cato,</p>
              <p className="font-semibold text-base sm:text-lg">See how it works.</p>
            </div>
            <div className="font-mono text-[11px] sm:text-xs text-gray-600 sm:text-right">
              <p>Forget checking your site health.</p>
              <p>cato does it for you.</p>
            </div>
          </div>
          <div className="items-center flex justify-center pb-4 sm:pb-0">
            <FCard />
          </div>
        </div>
      </div>

    </div>
  );
}
