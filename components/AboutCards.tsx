import FCard from "./FeatureCardOne";

export default function FeatureCard() {
  return (
    <div className="max-w-3xl mx-auto border-b">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4 py-8 mt-8">
        <div>
          <p className="text-gray-500 font-semibold">Meet cato,</p>
          <p className="font-semibold text-lg">See how it works.</p>
        </div>
        <div className="font-mono text-xs text-gray-600 text-right">
          <p>Forget checking your site health.</p>
          <p>cato does it for you.</p>
        </div>
      </div>
      <div className="items-center flex justify-center">
        <FCard />
      </div>
    </div>
  );
}
