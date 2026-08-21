import SafeImg from '@/components/SafeImg'

export default function Solution() {
  return (
    <section className="pad" id="solution">
      <div className="sol-top">
        <div className="sol-text">
          <div className="stag green">The Technology Solution</div>
          <h2>CiCLO® makes<br />synthetic fibre<br /><em>biodegradable.</em></h2>
          <div className="ciclo-badge" style={{ gap: '.75rem' }}>
            <SafeImg src="https://ciclotechnology.com/wp-content/uploads/2025/12/ciclo-logo-1.png"
                 alt="CiCLO® Technology"
                 style={{ height: '22px', filter: 'brightness(0) saturate(100%) invert(27%) sepia(52%) saturate(480%) hue-rotate(95deg)' }}
                  />
            <span className="cb-text">Certified · Tested · Traceable · Trusted — Made to last, not here forever.™</span>
          </div>
          <p>CiCLO® is a patented additive fused into polyester during melt extrusion — it creates biodegradable spots in the plastic matrix where naturally-occurring microbes can break the fibre down, just like wool or cotton.</p>
          <p>The result: synthetic textiles with all the durability and performance you expect, that biodegrade responsibly when they reach the environment.</p>
          <div className="sol-steps">
            <div className="sstep"><div className="sstep-n">1</div><div className="sstep-t"><h4>Embedded at fibre source — never washes off</h4><p>CiCLO® is fused into polyester pellets during melt extrusion at Jiwarajka's facility. It becomes part of the molecular structure.</p></div></div>
            <div className="sstep"><div className="sstep-n">2</div><div className="sstep-t"><h4>Full performance in your home</h4><p>Identical durability, colour, and handle to conventional polyester. CiCLO® only activates when fibres reach an active microbial environment.</p></div></div>
            <div className="sstep"><div className="sstep-n">3</div><div className="sstep-t"><h4>Biodegrades in soil, sludge, seawater &amp; landfill</h4><p>Third-party ASTM tests confirm 94% biodegradation in seawater and 91% in soil. Only biogas and biomass remain — no toxic residue.</p></div></div>
          </div>
        </div>
        <div className="bio-visual">
          {/* CiCLO Lab — Real photo from ciclotextiles.com */}
          <SafeImg className="bio-petri"
               src="https://ciclotechnology.com/wp-content/uploads/2026/01/260101CicloPetriDishes0135-scaled.jpeg"
               alt="CiCLO® biodegradation lab tests — petri dish samples"
                />
          <div className="bio-petri-bg" style={{ display: 'none' }}>🔬</div>
          {/* CiCLO Logo */}
          <div className="ciclo-logo-wrap">
            <SafeImg src="https://ciclotechnology.com/wp-content/uploads/2025/12/ciclo-logo-1.png"
                 alt="CiCLO® Technology"
                  />
          </div>
          {/* How it activates */}
          <div className="ciclo-tech-icons">
            <div className="cti-step">
              <img src="https://ciclotechnology.com/wp-content/uploads/2026/01/Watste-Water_Biodegradation_Blue_72x.png" alt="Moisture" />
              <span className="cti-label">Moisture</span>
            </div>
            <span className="cti-plus">+</span>
            <div className="cti-step">
              <img src="https://ciclotechnology.com/wp-content/uploads/2026/01/Watste-Water_Bmic_Blue_72x.png" alt="Microbes" />
              <span className="cti-label">Microbes</span>
            </div>
            <span className="cti-plus">+</span>
            <div className="cti-step" style={{ fontSize: '1.5rem' }}>⏱️</div>
            <span className="cti-plus" style={{ color: 'var(--ink-light)' }}>→</span>
            <div className="cti-step" style={{ fontSize: '1.5rem' }}>🌱</div>
            <span className="cti-eq" style={{ color: 'var(--sage)', fontWeight: '600', fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Biodegradation</span>
          </div>
        </div>
      </div>
      {/* ASTM Charts — real data graphics from ciclotextiles.com */}
      <div className="astm-grid">
        <div className="astm-card">
          <SafeImg className="astm-card-img"
               src="https://ciclotechnology.com/wp-content/uploads/2025/12/fa4564c244163b32168ddebf3987a0dcb0118863-scaled.jpg"
               alt="ASTM D6691 — Seawater biodegradation chart"
                />
          <div className="astm-card-img-bg" style={{ display: 'none' }}>🌊</div>
          <div className="astm-card-body">
            <div className="astm-env">🌊 Natural Seawater</div>
            <div className="astm-pct">94%</div>
            <div className="astm-label">ASTM D6691 · vs 3.8% conventional polyester</div>
            <div className="astm-days">1,362 days · Third-party verified</div>
          </div>
        </div>
        <div className="astm-card">
          <SafeImg className="astm-card-img"
               src="https://ciclotechnology.com/wp-content/uploads/2025/12/587d079d15e36348f490bb9a5e3ad21a42a993c8-scaled.jpg"
               alt="ASTM D5988 — Soil biodegradation chart"
                />
          <div className="astm-card-img-bg" style={{ display: 'none' }}>🌱</div>
          <div className="astm-card-body">
            <div className="astm-env">🌱 Fertile Soil</div>
            <div className="astm-pct">91%</div>
            <div className="astm-label">ASTM D5988 · vs 0% conventional polyester</div>
            <div className="astm-days">1,170 days · No microplastics detected</div>
          </div>
        </div>
        <div className="astm-card">
          <SafeImg className="astm-card-img"
               src="https://ciclotechnology.com/wp-content/uploads/2025/12/ff6bf80db2929e25a07a24c4f084831e603c31b1-scaled.jpg"
               alt="ASTM D5210 — Wastewater sludge chart"
                />
          <div className="astm-card-img-bg" style={{ display: 'none' }}>🏭</div>
          <div className="astm-card-body">
            <div className="astm-env">🏭 Wastewater Sludge</div>
            <div className="astm-pct">90%</div>
            <div className="astm-label">ASTM D5210 · vs 0% conventional polyester</div>
            <div className="astm-days">952 days · Municipal sewage sludge</div>
          </div>
        </div>
        <div className="astm-card">
          <SafeImg className="astm-card-img"
               src="https://ciclotechnology.com/wp-content/uploads/2025/12/eadd878ce9b27cd435d989185caa774c74eb283f-scaled.jpg"
               alt="ASTM D5511 — Landfill biodegradation chart"
                />
          <div className="astm-card-img-bg" style={{ display: 'none' }}>🗑️</div>
          <div className="astm-card-body">
            <div className="astm-env">🗑️ Biologically Active Landfill</div>
            <div className="astm-pct">91%</div>
            <div className="astm-label">ASTM D5511 · vs 6.2% conventional polyester</div>
            <div className="astm-days">1,278 days · Fully broken down</div>
          </div>
        </div>
      </div>

      {/* Certification logos from ciclotextiles.com */}
      <div className="cert-strip">
        <div className="cert-strip-label">Globally recognised certifications — CiCLO® Technology</div>
        <div className="cert-logos">
          <a href="https://ciclotextiles.com/science" target="_blank" rel="noopener">
            <img src="https://ciclotechnology.com/wp-content/uploads/2025/12/OEKO-Tek-17.0.14110_BLACK-copy.png" alt="OEKO-TEX ECO PASSPORT" title="OEKO-TEX® ECO PASSPORT Certified" />
          </a>
          <a href="https://ciclotextiles.com/science" target="_blank" rel="noopener">
            <img src="https://ciclotechnology.com/wp-content/uploads/2025/12/ASTM-logo-blk.png" alt="ASTM International" title="ASTM International Tested" />
          </a>
          <a href="https://ciclotextiles.com/science" target="_blank" rel="noopener">
            <img src="https://ciclotechnology.com/wp-content/uploads/2025/12/iso-2-1-logo-svg-vector-blk-scaled.png" alt="ISO" title="ISO Test Methods" />
          </a>
          <a href="https://ciclotextiles.com/science" target="_blank" rel="noopener">
            <img src="https://ciclotechnology.com/wp-content/uploads/2025/12/Intertek_Logo-blk-scaled.png" alt="Intertek" title="Intertek Certified" />
          </a>
          <a href="https://ciclotextiles.com/science" target="_blank" rel="noopener">
            <img src="https://ciclotechnology.com/wp-content/uploads/2026/01/Vector.png" alt="REACH" title="REACH Compliant" />
          </a>
          <a href="https://ciclotextiles.com/science" target="_blank" rel="noopener">
            <img src="https://ciclotechnology.com/wp-content/uploads/2026/01/Vector-1.png" alt="Bureau Veritas" title="Bureau Veritas Verified" />
          </a>
          <a href="https://ciclotextiles.com/science" target="_blank" rel="noopener">
            <img src="https://ciclotechnology.com/wp-content/uploads/2026/01/Eden_Research_Labs.png" alt="Eden Research Laboratory" title="Eden Research Laboratory" />
          </a>
        </div>
      </div>
    </section>
  )
}
