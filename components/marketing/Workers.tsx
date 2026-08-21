import SafeImg from '@/components/SafeImg'

export default function Workers() {
  return (
    <section className="workers-sec" id="workers">
      <div className="stag green">The Hands Behind Every Product</div>
      <h2>CiCLO® + Sutradhar —<br />a <em>double dividend</em><br />for the artisan.</h2>
      <p className="sec-lead" style={{ marginTop: '.75rem' }}>EcoWeave's artisans earn more because of CiCLO® certification. They keep more because of Sutradhar's government scheme awareness programme. Three weavers. Real numbers.</p>

      <div className="workers-grid">

        {/* SHAKIL AHAMAD */}
        <div className="wcard">
          <div className="wcard-photo">
            <SafeImg src="/images/artisan-shakil-ahamad.jpg"
                 alt="Shakil Ahamad — Darri Weaver"
                  />
            <div className="wcard-photo-bg wbg-1" style={{ display: 'none' }}>🧵</div>
            <span className="wcard-cluster">📍 Sector 12, Panipat</span>
          </div>
          <div className="wcard-body">
            <div className="wcard-name">Shakil Ahamad</div>
            <div className="wcard-craft">Darri Weaving · 25 years</div>
            <div className="wcard-quote">"The border is the signature. Anyone can weave the centre. Every corner is a decision — and a good weaver's corners meet perfectly."</div>
            <div className="wcard-divider"></div>
            <div className="wcard-benefits">
              <div className="wb-row">
                <div className="wb-icon">🌿</div>
                <div className="wb-text"><strong>CiCLO® Uplift</strong><span>Switched to CiCLO® certified DTY yarn. Realisation moved from ₹87/m → ₹112/m — a 29% income uplift on the same loom.</span></div>
              </div>
              <div className="wb-row">
                <div className="wb-icon t">⚖️</div>
                <div className="wb-text"><strong>Sutradhar — Haq</strong><span>PM Vishwakarma (₹15,000 toolkit + ₹3L loan at 5%), PMSBY accident cover ₹2L for ₹20/yr, MMPSY ₹6,000/yr cash. Total coverage unlocked: ₹5L+.</span></div>
              </div>
              <div className="wb-row">
                <div className="wb-icon">📱</div>
                <div className="wb-text"><strong>Sutradhar — Haath</strong><span>UPI active, DigiLocker complete, self-registered on pmvishwakarma.gov.in — independently, without assistance.</span></div>
              </div>
            </div>
            <div className="wcard-yrs">25 years at the loom · PM Vishwakarma · PMSBY · MMPSY</div>
          </div>
        </div>

        {/* PREM CHAND */}
        <div className="wcard">
          <div className="wcard-photo">
            <SafeImg src="/images/artisan-prem-chand.jpg"
                 alt="Prem Chand — Handloom Weaver"
                  />
            <div className="wcard-photo-bg wbg-2" style={{ display: 'none' }}>🏭</div>
            <span className="wcard-cluster">📍 Rajiv Colony, Panipat</span>
          </div>
          <div className="wcard-body">
            <div className="wcard-name">Prem Chand</div>
            <div className="wcard-craft">Handloom Weaving · 18 years</div>
            <div className="wcard-quote">"My father forced me into this work and I resented it for ten years before I loved it. I don't want to make that mistake with my own son."</div>
            <div className="wcard-divider"></div>
            <div className="wcard-benefits">
              <div className="wb-row">
                <div className="wb-icon">🌿</div>
                <div className="wb-text"><strong>CiCLO® Uplift</strong><span>Table linen production on CiCLO® certified yarn opens EU buyer access. First export inquiry received 6 weeks after certification — product commands 22% premium.</span></div>
              </div>
              <div className="wb-row">
                <div className="wb-icon t">⚖️</div>
                <div className="wb-text"><strong>Sutradhar — Haq</strong><span>PM Vishwakarma ₹15,000 toolkit + loan, PMSBY life + accident cover, Atal Pension Yojana enrolled — pension security for first time in 18 years of craft.</span></div>
              </div>
              <div className="wb-row">
                <div className="wb-icon">📱</div>
                <div className="wb-text"><strong>Sutradhar — Haath</strong><span>Moved from zero digital capability to self-registering on government portals across 4 Sutradhar visits. UPI, DigiLocker, portal login — all independent.</span></div>
              </div>
            </div>
            <div className="wcard-yrs">18 years weaving · PM Vishwakarma · PMSBY · Atal Pension</div>
          </div>
        </div>

        {/* SUNITA DEVI */}
        <div className="wcard">
          <div className="wcard-photo">
            <SafeImg src="/images/artisan-sunita-devi.jpg"
                 alt="Sunita Devi — Block Printer"
                  />
            <div className="wcard-photo-bg wbg-3" style={{ display: 'none' }}>🖐️</div>
            <span className="wcard-cluster">📍 Sanganer, Jaipur</span>
          </div>
          <div className="wcard-body">
            <div className="wcard-name">Sunita Devi</div>
            <div className="wcard-craft">Block Printing · 28 years</div>
            <div className="wcard-quote">"A good block stamp is like a signature. You can always tell which hand pressed it, even fifty years later. The pressure is personal."</div>
            <div className="wcard-divider"></div>
            <div className="wcard-benefits">
              <div className="wb-row">
                <div className="wb-icon">🌿</div>
                <div className="wb-text"><strong>CiCLO® Uplift</strong><span>Block-prints on CiCLO® base fabric — shower curtains and table linen. "Ancient craft + next-gen tech" narrative opens eco-luxury segments. Named artisan on every product.</span></div>
              </div>
              <div className="wb-row">
                <div className="wb-icon t">⚖️</div>
                <div className="wb-text"><strong>Sutradhar — Haq</strong><span>PMSBY ₹2L accident cover (₹20/yr), PMJJBY ₹2L life cover, Atal Pension Yojana enrolled. First woman in her block-printing cluster with insurance in her own name.</span></div>
              </div>
              <div className="wb-row">
                <div className="wb-icon">📱</div>
                <div className="wb-text"><strong>Sutradhar — Haath</strong><span>"My husband always handled the forms. Now I can do it myself. That matters more than the money, honestly." — DigiLocker complete, UPI active.</span></div>
              </div>
            </div>
            <div className="wcard-yrs">28 years of craft · PMSBY · PMJJBY · Atal Pension Yojana</div>
          </div>
        </div>

      </div>
    </section>
  )
}
