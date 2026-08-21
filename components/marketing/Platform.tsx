import SafeImg from '@/components/SafeImg'

export default function Platform() {
  return (
    <section className="platform" id="platform">
      <div className="platform-grid">
        <div className="platform-img-wrap">
          <SafeImg className="platform-img"
               src="/images/platform-weaver-at-loom.jpg"
               alt="Indian weaver at loom"
                />
          <div className="platform-img-bg" style={{ display: 'none' }}>🧵</div>
          <div className="platform-img-overlay"></div>
          <div className="platform-stats">
            <div className="pstat"><span className="pstat-n">500+</span><span className="pstat-l">Artisan families targeted</span></div>
            <div className="pstat"><span className="pstat-n">2</span><span className="pstat-l">Active clusters</span></div>
            <div className="pstat"><span className="pstat-n">+25%</span><span className="pstat-l">Income uplift proven</span></div>
          </div>
        </div>
        <div className="platform-text">
          <div className="stag green">The Artisan Platform</div>
          <h2>Craft meets<br /><em>science.</em><br />Poverty meets<br />opportunity.</h2>
          <p>EcoWeave® is more than a product line — it's an economic model. By sourcing CiCLO® certified DTY yarn from Jiwarajka India and channelling orders through our artisan-certified supply chain, we give weavers access to a premium market that simply didn't exist before.</p>
          <p>A weaver earning ₹88/metre on commodity polyester earns ₹114/metre on CiCLO® certified EcoWeave® fabric. That 29% uplift changes lives.</p>
          <div className="cluster-grid">
            <div className="cluster"><h4>📍 Panipat, Haryana</h4><p>India's home textile capital. 8-loom to 100-loom operators transitioning to CiCLO® certified production.</p></div>
            <div className="cluster"><h4>📍 Jaipur, Rajasthan</h4><p>Block print and weaving artisans. Ancient craft techniques on next-generation biodegradable substrate.</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
