import SafeImg from '@/components/SafeImg'

export default function CicloPanels() {
  return (
    <section style={{ background: 'var(--ink)', padding: '0', overflow: 'hidden' }}>
      {/* CiCLO 4-panel image */}
      <div style={{ position: 'relative' }}>
        <img src="/images/ciclo-panels.jpg"
             alt="CiCLO® — The Invisible Problem · The Difference Starts Within · The Science is Built In · Designed for What Comes Next"
             style={{ width: '100%', display: 'block', maxHeight: '340px', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to bottom,transparent 55%,rgba(28,20,8,.85) 100%)' }}></div>
        <div style={{ position: 'absolute', bottom: '1.25rem', left: '3rem', right: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '.75rem' }}>
          <div style={{ fontFamily: 'var(--h)', fontSize: '1rem', fontWeight: '300', fontStyle: 'italic', color: 'rgba(255,255,255,.75)' }}>Made to last, not here forever.™</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <SafeImg src="https://ciclotechnology.com/wp-content/uploads/2026/01/output-smallpngtools.png"
                 alt="CiCLO®" style={{ height: '22px', filter: 'brightness(0) invert(1) opacity(.8)' }}
                  />
            <a href="https://ciclotextiles.com" target="_blank" rel="noopener"
               style={{ fontSize: '.62rem', fontWeight: '500', letterSpacing: '.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>ciclotextiles.com ↗</a>
          </div>
        </div>
      </div>

      {/* 4 Panel Messages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(255,255,255,.06)' }}>
        <div style={{ padding: '2rem 1.75rem', background: 'var(--ink)' }}>
          <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '.6rem' }}>Panel 01</div>
          <div style={{ fontFamily: 'var(--h)', fontSize: '1.25rem', fontWeight: '300', color: '#fff', lineHeight: '1.25', marginBottom: '.75rem' }}>The Invisible Problem We Cannot Ignore.</div>
          <p style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.5)', lineHeight: '1.72', fontWeight: '300' }}>From creation to everyday use, synthetic textiles can release microplastic fibres into the environment. Products made with CiCLO® fibres are designed to reduce microplastic fibre persistence.</p>
        </div>
        <div style={{ padding: '2rem 1.75rem', background: 'rgba(255,255,255,.03)' }}>
          <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '.6rem' }}>Panel 02</div>
          <div style={{ fontFamily: 'var(--h)', fontSize: '1.25rem', fontWeight: '300', color: '#fff', lineHeight: '1.25', marginBottom: '.75rem' }}>The Difference Starts Within.</div>
          <p style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.5)', lineHeight: '1.72', fontWeight: '300' }}>CiCLO® technology is a textile ingredient embedded into polyester and nylon fibres during manufacturing. The difference is built in with intention — integrating a tracer that supports verification, traceability, and certification for responsible marketing.</p>
        </div>
        <div style={{ padding: '2rem 1.75rem', background: 'var(--ink)' }}>
          <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '.6rem' }}>Panel 03</div>
          <div style={{ fontFamily: 'var(--h)', fontSize: '1.25rem', fontWeight: '300', color: '#fff', lineHeight: '1.25', marginBottom: '.75rem' }}>The Science is Built In.</div>
          <p style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.5)', lineHeight: '1.72', fontWeight: '300' }}>CiCLO® technology creates pathways within the fibre designed to enable biodegradation under specified environmental conditions. Independently tested under four environmental conditions using ASTM and ISO test methods.</p>
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '.85rem' }}>
            <div style={{ fontFamily: 'var(--h)', fontSize: '.9rem', fontStyle: 'italic', color: 'var(--sage-l)' }}>Tested.</div>
            <div style={{ fontFamily: 'var(--h)', fontSize: '.9rem', fontStyle: 'italic', color: 'var(--sage-l)' }}>Traceable.</div>
            <div style={{ fontFamily: 'var(--h)', fontSize: '.9rem', fontStyle: 'italic', color: 'var(--sage-l)' }}>Trusted.</div>
          </div>
        </div>
        <div style={{ padding: '2rem 1.75rem', background: 'rgba(255,255,255,.03)' }}>
          <div style={{ fontSize: '.56rem', fontWeight: '500', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: '.6rem' }}>Panel 04</div>
          <div style={{ fontFamily: 'var(--h)', fontSize: '1.25rem', fontWeight: '300', color: '#fff', lineHeight: '1.25', marginBottom: '.75rem' }}>Designed for What Comes Next.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem', marginTop: '.4rem' }}>
            <div style={{ display: 'flex', gap: '.55rem', alignItems: 'center' }}><span style={{ fontSize: '.65rem', color: 'var(--sage-l)' }}>✦</span><div><div style={{ fontSize: '.7rem', fontWeight: '500', color: '#fff' }}>Adaptable</div><div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', fontWeight: '300' }}>Compatible with virgin, recycled &amp; bio-based feedstocks</div></div></div>
            <div style={{ display: 'flex', gap: '.55rem', alignItems: 'center' }}><span style={{ fontSize: '.65rem', color: 'var(--sage-l)' }}>✦</span><div><div style={{ fontSize: '.7rem', fontWeight: '500', color: '#fff' }}>Durable</div><div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', fontWeight: '300' }}>Maintains fibre operability, durability &amp; recyclability</div></div></div>
            <div style={{ display: 'flex', gap: '.55rem', alignItems: 'center' }}><span style={{ fontSize: '.65rem', color: 'var(--sage-l)' }}>✦</span><div><div style={{ fontSize: '.7rem', fontWeight: '500', color: '#fff' }}>Scalable</div><div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', fontWeight: '300' }}>Proven globally across applications &amp; industries</div></div></div>
            <div style={{ display: 'flex', gap: '.55rem', alignItems: 'center' }}><span style={{ fontSize: '.65rem', color: 'var(--sage-l)' }}>✦</span><div><div style={{ fontSize: '.7rem', fontWeight: '500', color: '#fff' }}>Safe</div><div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', fontWeight: '300' }}>OEKO-TEX ECO PASSPORT · Non-toxic to marine &amp; plant life</div></div></div>
            <div style={{ display: 'flex', gap: '.55rem', alignItems: 'center' }}><span style={{ fontSize: '.65rem', color: 'var(--sage-l)' }}>✦</span><div><div style={{ fontSize: '.7rem', fontWeight: '500', color: '#fff' }}>Global</div><div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', fontWeight: '300' }}>Built for global scalability across applications</div></div></div>
          </div>
        </div>
      </div>
    </section>
  )
}
