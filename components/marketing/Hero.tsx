import SafeImg from '@/components/SafeImg'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <SafeImg src="/images/hero-traditional-weaver.jpg"
             alt="Traditional weaver at a handloom"
              />
      </div>
      <div className="hero-content">
        <div className="hero-left">
          <div className="hbadge"><div className="hbd"></div><span className="hbt">India's First CiCLO® Home Textile Brand</span></div>
          <h1>Textiles that<br /><em>give back</em><br />to the <span className="t">earth.</span></h1>
          <p className="hero-lead">Biodegradable curtains, table linen &amp; shower textiles — woven by artisan craftspeople in Panipat &amp; Jaipur using patented <strong>CiCLO® biodegradable technology.</strong></p>
          <div className="hero-btns">
            <a href="#products" className="btn-p">Shop the Collection</a>
            <a href="#solution" className="btn-o">Our Technology</a>
          </div>
          <div className="certbar">
            <div className="cert"><div className="cert-dot"></div><span className="cert-txt">CiCLO® Certified</span></div>
            <div className="cert"><div className="cert-dot"></div><span className="cert-txt">OEKO-TEX Eco Passport</span></div>
            <div className="cert"><div className="cert-dot"></div><span className="cert-txt">Made in India</span></div>
            <div className="cert"><div className="cert-dot"></div><span className="cert-txt">Artisan Woven</span></div>
          </div>
          {/* CiCLO Partner Badge */}
          <div className="ciclo-partner-badge">
            <span className="cpb-text">Powered by</span>
            <SafeImg className="cpb-logo"
                 src="https://ciclotechnology.com/wp-content/uploads/2025/12/ciclo-logo-1.png"
                 alt="CiCLO® Technology"
                  />
            <span className="cpb-text">· Biodegradable Technology</span>
          </div>
        </div>
        {/* Hero-right cards hata diye — ab right column background weaver photo
            dikhata hai (gradient us taraf transparent hai). */}
      </div>
    </section>
  )
}
