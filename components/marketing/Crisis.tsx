import SafeImg from '@/components/SafeImg'

export default function Crisis() {
  return (
    <section className="pad-alt" id="crisis">
      <div className="crisis-top">
        <div>
          <div className="stag">The Microplastic Crisis</div>
          <h2>35% of ocean<br />microplastics<br />come from <em className="t">your home.</em></h2>
          <p className="crisis-lead">Every time you wash a synthetic curtain or tablecloth, millions of microscopic plastic fibres flow silently from your drain into rivers, seas and eventually your food. They never break down. Until now.</p>
        </div>
        <div className="jsteps">
          <div className="jstep"><div className="jsn">01</div><div className="jst"><h4>You wash your polyester curtains</h4><p>Each wash cycle sheds up to 700,000 microplastic fibres from a single synthetic textile item.</p></div></div>
          <div className="jstep"><div className="jsn">02</div><div className="jst"><h4>Fibres bypass water treatment</h4><p>Wastewater treatment plants capture only 70–80% of microplastics. Millions escape into waterways every day.</p></div></div>
          <div className="jstep"><div className="jsn">03</div><div className="jst"><h4>They enter the marine food chain</h4><p>Fish eat microplastics. We eat the fish. Human blood, lungs, and placentas now routinely test positive for microplastics.</p></div></div>
          <div className="jstep"><div className="jsn">04</div><div className="jst"><h4>Standard polyester persists 50–200 years</h4><p>The curtain you bought today will still be releasing plastic into the environment well into the 22nd century.</p></div></div>
        </div>
      </div>
      <div className="crisis-stats">
        <div className="cstat"><div className="csn">35%</div><div className="csl">of ocean microplastics from synthetic textiles</div></div>
        <div className="cstat"><div className="csn">700K</div><div className="csl">fibres shed per wash cycle per item</div></div>
        <div className="cstat"><div className="csn">200yr</div><div className="csl">standard polyester persistence in environment</div></div>
        <div className="cstat"><div className="csn">44M lbs</div><div className="csl">synthetic textiles entering landfills daily</div></div>
      </div>

      {/* Microplastics evidence photos — ciclotextiles.com */}
      <div className="crisis-photos">
        <div className="crisis-photo">
          <SafeImg src="https://ciclotechnology.com/wp-content/uploads/2026/01/46a97c3ab6b926fdd41ef70ec4ee1bdac16f34c9.jpg"
               alt="Microplastic fibres under microscope" loading="lazy"
                />
          <div className="crisis-photo-bg" style={{ display: 'none' }}>🔬</div>
          <div className="crisis-photo-label">Microplastic fibres</div>
        </div>
        <div className="crisis-photo">
          <SafeImg src="https://ciclotechnology.com/wp-content/uploads/2026/01/5ed8f79bdf7640c9bf9f3463dfd21915d29e67c9-scaled.jpg"
               alt="Microplastics in marine environment" loading="lazy"
                />
          <div className="crisis-photo-bg" style={{ display: 'none' }}>🌊</div>
          <div className="crisis-photo-label">Marine pollution</div>
        </div>
        <div className="crisis-photo">
          <SafeImg src="https://ciclotechnology.com/wp-content/uploads/2026/01/ce28fefc7a32b696af9fec72de28940e7cfee564-scaled.jpg"
               alt="Synthetic fibre shedding in water" loading="lazy"
                />
          <div className="crisis-photo-bg" style={{ display: 'none' }}>💧</div>
          <div className="crisis-photo-label">Synthetic fibre shedding</div>
        </div>
        <div className="crisis-photo">
          <SafeImg src="https://ciclotechnology.com/wp-content/uploads/2026/01/e934845cdcfb6c9ce600fb5363c3bacfdad938ca-scaled.jpg"
               alt="Microplastics research" loading="lazy"
                />
          <div className="crisis-photo-bg" style={{ display: 'none' }}>🧪</div>
          <div className="crisis-photo-label">Research evidence</div>
        </div>
      </div>
    </section>
  )
}
