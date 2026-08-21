export default function Jiwarajka() {
  return (
    <section style={{ background: 'var(--sand)', padding: '3rem 5rem', borderTop: '1px solid var(--rule)' }} id="jiwarajka">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

        {/* Left: intro */}
        <div>
          <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: '.45rem' }}>Supply Chain Partner · CiCLO® Certified Yarn</div>
          <h3 style={{ fontSize: 'clamp(1.3rem,2.5vw,2rem)', fontWeight: '300', fontFamily: 'var(--h)' }}>Jiwarajka × <em>CiCLO®</em> — the yarn partner behind every EcoWeave product.</h3>
          <p style={{ fontSize: '.88rem', color: 'var(--ink-mid)', lineHeight: '1.85', fontWeight: '300', marginTop: '1rem', marginBottom: '1.75rem' }}>Jiwarajka Textile Industries — one of India's leading polyester DTY manufacturers with facilities in Daman and Silvassa — officially partnered with CiCLO® technology in April 2025. As EcoWeave's certified yarn supplier, Jiwarajka integrates CiCLO® active ingredients into polyester DTY at the melt extrusion stage, issuing a Certificate of Authenticity with every lot. Their decision to make certified yarn accessible to small artisan clusters in Panipat and Sanganer — at quantities suited to weavers with just a handful of looms — is what makes EcoWeave's income-uplift model possible.</p>
          <a href="https://www.jiwarajka.com/jiwarajka-partners-with-ciclo-technology-to-advance-eco-conscious-textiles"
             target="_blank" rel="noopener"
             style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', background: 'var(--ink)', color: '#fff', padding: '.78rem 1.6rem', fontFamily: 'var(--b)', fontSize: '.73rem', fontWeight: '500', letterSpacing: '.07em', textTransform: 'uppercase', textDecoration: 'none' }} className="btn-ink">
            Read the Jiwarajka × CiCLO® Story ↗
          </a>
        </div>

        {/* Right: 6 support pillars — compact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--rule)' }}>
          <div style={{ fontSize: '.58rem', fontWeight: '500', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-light)', padding: '.9rem 1.25rem', background: 'var(--sand)' }}>How Jiwarajka supports the EcoWeave initiative</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--rule)' }}>
            <div style={{ background: 'var(--paper)', padding: '1.25rem' }}>
              <div style={{ fontSize: '.62rem', color: 'var(--sage)', fontWeight: '500', marginBottom: '.25rem' }}>🧵 Yarn Access</div>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-mid)', lineHeight: '1.6', fontWeight: '300' }}>Makes certified CiCLO® DTY available at MOQs suited to small weaver clusters — putting global-brand-quality yarn in the hands of individual artisans.</p>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1.25rem' }}>
              <div style={{ fontSize: '.62rem', color: 'var(--terra)', fontWeight: '500', marginBottom: '.25rem' }}>📜 Certification</div>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-mid)', lineHeight: '1.6', fontWeight: '300' }}>Issues a Certificate of Authenticity per yarn lot — the document that makes every EcoWeave CiCLO® claim independently traceable from fibre to finished product.</p>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1.25rem' }}>
              <div style={{ fontSize: '.62rem', color: 'var(--terra)', fontWeight: '500', marginBottom: '.25rem' }}>🌍 Market Credibility</div>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-mid)', lineHeight: '1.6', fontWeight: '300' }}>The same certified yarn used by Target, Walmart &amp; Billabong. EU and US buyers can trace every EcoWeave product back to a globally credentialled manufacturer.</p>
            </div>
            <div style={{ background: 'var(--paper)', padding: '1.25rem' }}>
              <div style={{ fontSize: '.62rem', color: 'var(--sage)', fontWeight: '500', marginBottom: '.25rem' }}>♻️ Dope-Dyed &amp; Circular</div>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-mid)', lineHeight: '1.6', fontWeight: '300' }}>Offers dope-dyed CiCLO® variants — richer colour, less water — and maintains rPET recyclability. Recyclable when possible, biodegradable when not.</p>
            </div>
            <div style={{ background: 'var(--paper)', padding: '1.25rem' }}>
              <div style={{ fontSize: '.62rem', color: 'var(--sage)', fontWeight: '500', marginBottom: '.25rem' }}>🤝 Mission Alignment</div>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-mid)', lineHeight: '1.6', fontWeight: '300' }}>A deliberate commitment by an established manufacturer to back a student-founded initiative — bringing scale and infrastructure to EcoWeave's artisan story and D2C channel.</p>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1.25rem' }}>
              <div style={{ fontSize: '.62rem', color: 'var(--terra)', fontWeight: '500', marginBottom: '.25rem' }}>🏭 20,000+ MT Capacity</div>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-mid)', lineHeight: '1.6', fontWeight: '300' }}>Daman &amp; Silvassa facilities. ISO certified. The supply-chain backbone that ensures EcoWeave can scale from artisan pilot to national and export volumes.</p>
            </div>
          </div>

          {/* Pull quote */}
          <div style={{ background: 'var(--sage)', padding: '1.5rem 1.75rem' }}>
            <p style={{ fontFamily: 'var(--h)', fontStyle: 'italic', fontSize: '.95rem', fontWeight: '300', color: '#fff', lineHeight: '1.55' }}>"Every yarn can tell a story of progress. Jiwarajka is threading the needle between performance and purpose."</p>
            <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.45)', marginTop: '.5rem', fontWeight: '300' }}>— Jiwarajka Textile Industries · Official CiCLO® Partnership Statement · April 2025</div>
          </div>
        </div>

      </div>
    </section>
  )
}
