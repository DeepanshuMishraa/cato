export default function TechnicalInfo() {
  return (
    <div id="how-it-works" className="flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6 pb-32">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider">Technology</h2>
          <p className="text-2xl sm:text-3xl font-light max-w-xl">
            Enterprise-grade monitoring infrastructure for businesses of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center border border-gray-200">
              <span className="text-xs font-mono">HM</span>
            </div>
            <h3 className="font-mono text-sm">Health Matrix</h3>
            <p className="text-xs text-gray-600">Multi-point HTTP response validation with status code analysis and latency tracking.</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center border border-gray-200">
              <span className="text-xs font-mono">IA</span>
            </div>
            <h3 className="font-mono text-sm">Intelligent Alerts</h3>
            <p className="text-xs text-gray-600">Smart notification system with automated incident verification and customizable alert thresholds.</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center border border-gray-200">
              <span className="text-xs font-mono">PM</span>
            </div>
            <h3 className="font-mono text-sm">Portfolio Management</h3>
            <p className="text-xs text-gray-600">Monitor up to 5 endpoints with our standard plan, or unlock unlimited monitoring with premium.</p>
          </div>
        </div>

        <div className="pt-20 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4 sm:gap-12">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-px w-4 bg-black"></div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Free Plan</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="font-mono">→</span>
                  Monitor up to 5 endpoints
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono">→</span>
                  5-minute check intervals
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono">→</span>
                  Email notifications
                </li>
              </ul>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-px w-4 bg-black"></div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Premium Plan</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="font-mono">→</span>
                  Unlimited endpoints
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono">→</span>
                  1-minute check intervals
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono">→</span>
                  Priority notifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
