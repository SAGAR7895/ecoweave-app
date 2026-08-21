export default function Duo() {
  return (
    <section className="pad" id="duo" style={{ background: 'var(--sand)' }}>
      <div className="stag green">The Co-Founders</div>
      <h2>Two siblings.<br />One <em>conviction.</em></h2>
      <p className="sec-lead" style={{ marginTop: '.75rem', marginBottom: '3.5rem' }}>EcoWeave was co-founded by Aarav and Navya Gupta — a brother and sister from Jaipur who share the belief that sustainable design must serve two masters equally: the planet, and the artisan who makes the product possible. Aarav leads the venture as CEO, building the technology platform and commercial strategy. Navya leads creative direction, ensuring every product is beautiful enough to be chosen and honest enough to create lasting change.</p>

      {/* CO-FOUNDER CARDS — equal weight, side by side */}
      <div className="duo-grid" style={{ display: 'grid', gap: '1px', background: 'var(--rule)' }}>

        {/* AARAV — Left */}
        <div className="duo-card" style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
          {/* Aarav Photo */}
          <div style={{ height: '380px', overflow: 'hidden', position: 'relative' }}>
            <img src="/images/aarav.jpg"
                 alt="Aarav Gupta — Co-Founder &amp; CEO, EcoWeave®"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', display: 'block' }} />
            <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top,rgba(28,20,8,.55) 0%,transparent 55%)' }}></div>
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.75rem', right: '1.75rem' }}>
              <div style={{ fontSize: '.55rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--sage-l)', marginBottom: '.3rem' }}>🌿 Co-Founder &amp; CEO</div>
              <div style={{ fontFamily: 'var(--h)', fontSize: '2rem', fontWeight: '400', color: '#fff', lineHeight: '1.05' }}>Aarav Gupta</div>
              <div style={{ fontSize: '.64rem', color: 'rgba(255,255,255,.65)', marginTop: '.2rem', fontWeight: '300' }}>Project Lead · Jaipur, Rajasthan</div>
            </div>
          </div>
          {/* Aarav writeup */}
          <div style={{ padding: '2.25rem 2.5rem', flex: '1', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <blockquote style={{ fontSize: '1.02rem', borderLeftColor: 'var(--sage)' }}>"EcoWeave was born from a simple conviction — that sustainable textiles must be economically superior for the producer, or they will never scale."</blockquote>
            <div>
              <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '.38rem' }}>Leading the Mission</div>
              <p style={{ fontSize: '.84rem', color: 'var(--ink-mid)', lineHeight: '1.82', fontWeight: '300' }}>Aarav leads EcoWeave as its founding CEO. He identified the microplastic crisis in synthetic home textiles, discovered CiCLO® technology, and built the artisan platform model from the ground up. He also founded Sutradhar — the government scheme awareness and artisan documentation initiative that has unlocked ₹75,000 in toolkit grants and ₹44L+ in insurance coverage across Panipat and Sanganer clusters.</p>
            </div>
            <div>
              <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '.38rem' }}>The Commercial Case</div>
              <p style={{ fontSize: '.84rem', color: 'var(--ink-mid)', lineHeight: '1.82', fontWeight: '300' }}>Aarav's core insight: sustainability only becomes permanent when the economics work for every person in the supply chain. EcoWeave proves this — CiCLO® certified weavers earn ₹110–120/m vs ₹85–95/m for commodity polyester. The certification doesn't cost the weaver. It pays them.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.38rem', paddingTop: '1.25rem', borderTop: '1px solid var(--rule)', marginTop: 'auto' }}>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Mission &amp; Strategy</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>CiCLO® Technology</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Artisan Platform</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Sutradhar Initiative</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Project Lead</span>
            </div>
          </div>
        </div>

        {/* NAVYA — Right */}
        {/* borderLeft hata diya — grid ka 1px gap pehle se hi divider bana raha
            tha, do line ban rahi thi aur ye card 1px patla ho jaata tha. */}
        <div className="duo-card" style={{ background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
          {/* Navya photo */}
          <div style={{ height: '380px', overflow: 'hidden', position: 'relative' }}>
            <img src="/images/navya.jpg"
                 alt="Navya Gupta — Co-Founder &amp; Design Lead, EcoWeave®"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top,rgba(28,20,8,.5) 0%,transparent 55%)' }}></div>
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.75rem', right: '1.75rem' }}>
              <div style={{ fontSize: '.55rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,220,190,.9)', marginBottom: '.3rem' }}>✏️ Co-Founder &amp; Design Lead</div>
              <div style={{ fontFamily: 'var(--h)', fontSize: '2rem', fontWeight: '400', color: '#fff', lineHeight: '1.05' }}>Navya Gupta</div>
              <div style={{ fontSize: '.64rem', color: 'rgba(255,255,255,.65)', marginTop: '.2rem', fontWeight: '300' }}>Creative Direction · Jaipur, Rajasthan</div>
            </div>
          </div>
          {/* Navya writeup */}
          <div style={{ padding: '2.25rem 2.5rem', flex: '1', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <blockquote style={{ fontSize: '1.02rem', borderLeftColor: 'var(--terra)' }}>"If I can make you fall in love with a rug or a tablecloth, I can guarantee the weaver behind it earns what they deserve. Design is the mechanism of that guarantee."</blockquote>
            <div>
              <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terra)', marginBottom: '.38rem' }}>Co-Founder &amp; Design Lead</div>
              <p style={{ fontSize: '.84rem', color: 'var(--ink-mid)', lineHeight: '1.82', fontWeight: '300' }}>I co-founded EcoWeave to do something that felt urgent — make sustainability beautiful enough that people actually want it. My work starts with the artisan: their intuitions about colour, their hand-memory from decades of weaving, their instinct for proportion. I bring that inheritance into dialogue with contemporary aesthetics, so every piece we create is rooted in craft but at home in a modern space.</p>
            </div>
            <div>
              <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terra)', marginBottom: '.38rem' }}>Design as the Engine of Impact</div>
              <p style={{ fontSize: '.84rem', color: 'var(--ink-mid)', lineHeight: '1.82', fontWeight: '300' }}>A product that sits on a shelf doesn't lift anyone. When I enhance the design quotient of what our weavers make — sharpening the appeal, connecting traditional skills with modern aesthetics — the product earns a premium. That premium flows back to the maker. So design, for me, is not decoration. It is the mechanism through which artisans earn what they deserve, and sustainable textiles prove they belong in the mainstream.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.38rem', paddingTop: '1.25rem', borderTop: '1px solid var(--rule)', marginTop: 'auto' }}>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Sustainable Design</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Artisan Collaboration</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Heritage + Contemporary</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Eco-Luxury Aesthetics</span>
              <span style={{ background: 'var(--sand)', border: '1px solid var(--rule)', color: 'var(--ink-mid)', fontSize: '.59rem', fontWeight: '300', padding: '.2rem .55rem' }}>Creative Direction</span>
            </div>
          </div>
        </div>

      </div>

      {/* Shared conviction strip */}
      <div style={{ background: 'var(--sage)', padding: '1.75rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '.58rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: '.3rem' }}>Our shared conviction</div>
          <div style={{ fontFamily: 'var(--h)', fontSize: '1.25rem', fontWeight: '300', fontStyle: 'italic', color: '#fff', lineHeight: '1.4' }}>"Sustainability that doesn't work for the artisan isn't sustainability. It's aesthetics."</div>
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', flexShrink: '0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--h)', fontSize: '1.8rem', fontWeight: '300', color: '#fff', lineHeight: '1' }}>₹26+</div>
            <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.55)', marginTop: '2px', fontWeight: '300' }}>Extra /metre for artisans</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--h)', fontSize: '1.8rem', fontWeight: '300', color: '#fff', lineHeight: '1' }}>8</div>
            <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.55)', marginTop: '2px', fontWeight: '300' }}>Artisans documented</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--h)', fontSize: '1.8rem', fontWeight: '300', color: '#fff', lineHeight: '1' }}>India's<br /><span style={{ fontSize: '1.2rem' }}>First</span></div>
            <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.55)', marginTop: '2px', fontWeight: '300' }}>CiCLO® home textile brand</div>
          </div>
        </div>
      </div>

    </section>
  )
}
