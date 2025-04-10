const Hero = () => {
  return (

    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-3xl mx-auto px-4 motion-preset-fade motion-duration-1000 border-b">
      <div className="mb-2 text-sm font-mono tracking-wider text-gray-500 uppercase">Uptime monitoring</div>
      <h1 className="text-4xl md:text-6xl font-light text-center mb-6 leading-tight">
        Monitor <span className="font-normal text-gray-500">every</span> second of your digital presence
      </h1>
      <p className="font-mono text-gray-600 text-xs mb-12 text-center max-w-lg">
        Instant notifications. Real-time analytics. Reliable monitoring.
      </p>
      <div className="flex gap-6 items-center">
        <button
        type="submit"
          className="rounded-none bg-black hover:bg-gray-800 text-white px-6 py-3 text-lg"
        >
          Start Monitoring
      </button>
        <a href="#learn-more" className="text-sm font-mono underline text-gray-600 hover:text-black">
          Learn more →
        </a>
      </div>
    </div>
  );
};

export default Hero;
