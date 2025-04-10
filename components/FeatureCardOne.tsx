import { Bell, Settings, Globe, Smartphone } from "lucide-react"

export default function FCard() {
  return (
    <div className="flex flex-col md:flex-row gap-5 p-4 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-4 w-[260px]">
        <div className="mb-4">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
            <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-[8px]">M</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold font-mono">MONITOR</h3>
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-gray-400" />
            <Settings className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <button className="flex items-center gap-1 py-1 px-2 bg-white border border-gray-200 rounded-full text-[10px]">
            <Globe className="w-3 h-3" />
            <span className="font-mono">HTTP</span>
          </button>
          <button className="flex items-center gap-1 py-1 px-2 bg-white border border-gray-200 rounded-full text-[10px]">
            <Smartphone className="w-3 h-3" />
            <span className="font-mono">API</span>
          </button>
        </div>

        <button className="w-full py-1.5 border border-gray-200 rounded-full text-blue-500 text-xs mb-4 font-mono">
          Start monitoring
        </button>

        <p className="text-gray-700 text-[10px] leading-relaxed font-mono">
          <span className="font-medium">Monitor</span> with our cloud service. Get real-time status and performance
          metrics in seconds. Deploy globally.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 w-[260px]">
        <div className="flex gap-1 mb-3">
          <button className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-mono">Uptime</button>
          <button className="text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-mono">Response</button>
          <button className="text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-mono">Metrics</button>
          <button className="text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-mono">Logs</button>
        </div>

        <div className="mb-3 text-gray-700 text-[10px] font-mono">
          <p className="mb-1.5">
            <span>[12:45:02]</span> Status Check
          </p>

          <p className="mb-0.5">
            <span className="font-medium">api.example.com:</span>
          </p>
          <p className="mb-2 leading-relaxed">
            HTTP status <span className="text-green-600">200 OK</span> with response time of{" "}
            <span className="text-yellow-600">124ms</span>. All systems{" "}
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-500 px-1 py-0.5 rounded text-[8px]">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[5px]">✓</span>
              </span>
              View Details
            </span>{" "}
            operational with normal latency values.
          </p>

          <p className="mb-0.5">
            <span className="font-medium">dashboard.example.com:</span>
          </p>
          <p className="leading-relaxed">
            HTTP status <span className="font-medium">200 OK</span>. Response time within expected parameters at 98ms.
          </p>
        </div>

        <p className="text-gray-700 text-[10px] leading-relaxed font-mono">
          <span className="font-medium">Analyze</span> & review performance metrics. Track response times, uptime
          percentage, and service health.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 w-[260px]">
        <div className="flex flex-col gap-2 mb-4">
          <button className="flex items-center justify-between py-1.5 px-2.5 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="text-[10px] font-bold font-mono">SMS</span>
              </div>
              <span className="text-xs font-mono">Notify via SMS</span>
            </div>
          </button>

          <button className="flex items-center justify-between py-1.5 px-2.5 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="text-[10px] font-mono">@</span>
              </div>
              <span className="text-xs font-mono">Email Alerts</span>
            </div>
          </button>

          <button className="flex items-center justify-between py-1.5 px-2.5 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="text-[10px] font-mono">W</span>
              </div>
              <span className="text-xs font-mono">Webhook</span>
            </div>
          </button>
        </div>

        <p className="text-gray-700 text-[10px] leading-relaxed font-mono">
          <span className="font-medium">Alert</span> and receive notifications when downtime is detected. Configure
          channels based on severity and response time.
        </p>
      </div>
    </div>
  )
}
