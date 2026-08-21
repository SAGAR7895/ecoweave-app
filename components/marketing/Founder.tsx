export default function Founder() {
  return (
    <section className="founder" id="founder">
      <div className="stag green">Meet the Founder</div>
      <h2>Born in Jaipur.<br />Built for the <em>weavers.</em></h2>
      <div className="fgrid">
        <div className="fprofile">
          <div className="favatar">
            <img src="/images/aarav-avatar.jpg" alt="Aarav Gupta" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          </div>
          <div className="fn">Aarav Gupta</div>
          <div className="fr">Founder &amp; CEO · EcoWeave® · Class of 2026<br />Jayshree Periwal International School, Jaipur</div>
          <div className="ftags">
            <span className="ftag">🌿 High School Founder</span>
            <span className="ftag">CiCLO® India Partner</span>
            <span className="ftag">First in India</span>
            <span className="ftag">Social Entrepreneur</span>
            <span className="ftag">Jaipur, Rajasthan</span>
          </div>
        </div>
        <div>
          <blockquote>"EcoWeave was born from the belief that true sustainability must be economically viable for the producer — or it simply won't last."</blockquote>
          <div className="fbio-section"><div className="fbio-label">The Origin</div><p className="fbio">I'm Aarav Gupta. Growing up in Jaipur — a city rooted in centuries-old textile traditions — I watched local artisans abandon sustainable heritage fabrics for cheap synthetics just to survive economically. At the same time, my research revealed the devastating microplastic crisis these synthetics were causing globally.</p></div>
          <div className="fbio-section"><div className="fbio-label">The Discovery</div><p className="fbio">I discovered CiCLO® technology — a patented biodegradable fibre additive already trusted by Target, Walmart, Best Western Hotels and Billabong globally — and realised no Indian home textile brand had adopted it. EcoWeave® was the answer: bring CiCLO® to India, prove the commercial case, then open the platform to every weaver who wants better realisations and a story worth telling.</p></div>
          <div className="fbio-section"><div className="fbio-label">Why Not an NGO</div><p className="fbio">A charity model creates dependency, not resilience. EcoWeave® is built on two pillars: <strong style={{ fontWeight: '500', color: 'var(--sage)' }}>Technology Transfer</strong> (CiCLO® into artisan supply chains) and <strong style={{ fontWeight: '500', color: 'var(--sage)' }}>Market Access</strong> (a D2C platform connecting certified artisans directly to conscious global buyers). The technology makes the economics work. The economics make the sustainability permanent.</p></div>
        </div>
      </div>
    </section>
  )
}
