import SafeImg from '@/components/SafeImg'

export default function Sutradhar() {
  return (
    <section className="sutra-sec" id="sutradhar">
      <div className="sutra-head">
        <div>
          <div className="stag">Social Impact Initiative</div>
          <h2>Sutradhar —<br />the <em>thread</em><br />that connects.</h2>
        </div>
        <div className="sutra-desc">
          <p>Sutradhar (सूत्रधार) means "the one who holds the thread" — the master weaver who ties everything together. EcoWeave's Sutradhar initiative documents, dignifies, and economically empowers the artisan families of Panipat and Jaipur whose hands make our products possible.</p>
          <p>It is not charity. It is recognition. It is market access. It is a named identity on every product shipped.</p>
          <div className="sutra-meaning">
            <div className="sutra-m"><span className="sm-word">Hunar</span><span className="sm-def">Skill &amp;<br />Craft</span></div>
            <div className="sutra-m"><span className="sm-word">Haq</span><span className="sm-def">Rights &amp;<br />Fair Income</span></div>
            <div className="sutra-m"><span className="sm-word">Haath</span><span className="sm-def">Hand &amp;<br />Human Touch</span></div>
          </div>
        </div>
      </div>

      <div className="sutra-pillars">
        <div className="sutra-pillar">
          <div className="sp-hindi">Hunar</div>
          <span className="sp-icon">🤲</span>
          <div className="sp-name">Skill</div>
          <div className="sp-sub">Documenting Mastery</div>
          <p className="sp-desc">Every artisan in the Sutradhar network has a documented skill profile — their technique, their cluster, their years of mastery. We record what they know so it is never lost. Block printing passed down 12 generations. Loom patterns woven without a written pattern for 40 years. Sutradhar makes the invisible, visible.</p>
        </div>
        <div className="sutra-pillar">
          <div className="sp-hindi">Haq</div>
          <span className="sp-icon">⚖️</span>
          <div className="sp-name">Rights</div>
          <div className="sp-sub">Fair Economics</div>
          <p className="sp-desc">CiCLO® certification means certified artisans earn ₹110–120/m instead of ₹85–95/m. Sutradhar tracks and publishes every weaver's actual realisation — transparently, publicly. No opaque middlemen. No exploitative pricing. The income uplift is the social impact. The market makes it permanent.</p>
        </div>
        <div className="sutra-pillar">
          <div className="sp-hindi">Haath</div>
          <span className="sp-icon">🪡</span>
          <div className="sp-name">Hand</div>
          <div className="sp-sub">The Human Story</div>
          <p className="sp-desc">Every EcoWeave product ships with the name of the artisan who made it. Not a factory code. A name. A face. A place. Sutradhar builds individual artisan profiles — photographed, written, published on ecoweave.in — so a buyer in London or New York knows whose hands touched their curtains.</p>
        </div>
      </div>

      <div className="sutra-impact-row">
        <div className="sir"><div className="sir-n">8</div><div className="sir-l">Artisans fully profiled — 5 Panipat + 3 Sanganer, Jaipur</div></div>
        <div className="sir"><div className="sir-n">₹75K</div><div className="sir-l">Toolkit grants unlocked — PM Vishwakarma · 5 artisans</div></div>
        <div className="sir"><div className="sir-n">₹44L+</div><div className="sir-l">Total insurance coverage activated across all 8 artisans</div></div>
        <div className="sir"><div className="sir-n">7</div><div className="sir-l">Government schemes accessed — PMSBY, Vishwakarma, APY &amp; more</div></div>
      </div>

      <div className="sutra-artisans">
        <div className="sutra-grid-label">Meet the Artisans</div>
        <div className="artisan-grid">

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-shakil-ahamad.jpg" alt="Shakil Ahamad"  />
              <div className="acard-img-bg abg-1" style={{ display: 'none' }}>🧵</div>
              <span className="acard-cluster">📍 Sector 12, Panipat</span><span className="acard-pillar">Hunar</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Shakil Ahamad</div>
              <div className="acard-craft">Darri Weaving · 25 yrs</div>
              <p className="acard-story">"The border is the signature. Anyone can weave the centre. Every corner is a decision — and a good weaver's corners meet perfectly."</p>
              <div className="acard-tags"><span className="atag">PM Vishwakarma</span><span className="atag">PMSBY</span><span className="atag">MMPSY</span></div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-jahangir-alam.jpg" alt="Jahangir Alam"  />
              <div className="acard-img-bg abg-2" style={{ display: 'none' }}>🎨</div>
              <span className="acard-cluster">📍 Sanganer, Jaipur</span><span className="acard-pillar">Hunar</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Jahangir Alam</div>
              <div className="acard-craft">Block Printing · 35 yrs</div>
              <p className="acard-story">"Every dyer had his own formula for the indigo vat. My father's formula died with him. That loss is not small."</p>
              <div className="acard-tags"><span className="atag">PM Vishwakarma</span><span className="atag">PMSBY</span><span className="atag">PMJJBY</span></div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-prem-chand.jpg" alt="Prem Chand"  />
              <div className="acard-img-bg abg-3" style={{ display: 'none' }}>🏭</div>
              <span className="acard-cluster">📍 Rajiv Colony, Panipat</span><span className="acard-pillar">Haath</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Prem Chand</div>
              <div className="acard-craft">Handloom Weaving · 18 yrs</div>
              <p className="acard-story">"My father forced me into this work and I resented it for ten years before I loved it. I don't want to make that mistake with my own son."</p>
              <div className="acard-tags"><span className="atag">PM Vishwakarma</span><span className="atag">PMSBY</span><span className="atag">Atal Pension</span></div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-shamshad-alam.jpg" alt="Shamshad Alam"  />
              <div className="acard-img-bg abg-4" style={{ display: 'none' }}>🪡</div>
              <span className="acard-cluster">📍 Noor Mohalla, Panipat</span><span className="acard-pillar">Haq</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Shamshad Alam</div>
              <div className="acard-craft">Darri Weaving · 32 yrs</div>
              <p className="acard-story">"After thirty years at a pit loom you don't sit straight anymore. The hands, though — the hands have never ached."</p>
              <div className="acard-tags"><span className="atag">PMSBY</span><span className="atag">MMPSY</span><span className="atag">Labour Welfare</span></div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-md-munna-mustak.jpg" alt="Md Munna Mustak"  />
              <div className="acard-img-bg abg-5" style={{ display: 'none' }}>🏺</div>
              <span className="acard-cluster">📍 Ansari Mohalla, Panipat</span><span className="acard-pillar">Hunar</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Md Munna Mustak</div>
              <div className="acard-craft">Carpet Weaving · 20 yrs</div>
              <p className="acard-story">"A machine makes the same knot 10,000 times without getting bored. I make each one with a decision. The carpet knows when your hands are peaceful."</p>
              <div className="acard-tags"><span className="atag">PM Vishwakarma</span><span className="atag">PMSBY</span><span className="atag">Carpet Knotter</span></div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-tauhid-alam.jpg" alt="Tauhid Alam"  />
              <div className="acard-img-bg abg-6" style={{ display: 'none' }}>🖐️</div>
              <span className="acard-cluster">📍 Chhipa Mohalla, Sanganer</span><span className="acard-pillar">Hunar</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Tauhid Alam</div>
              <div className="acard-craft">Block Printing · 28 yrs</div>
              <p className="acard-story">"This block — fifteen years I have been pressing it. My hands know its weight before I pick it up. The block does not need to tell me when it is right."</p>
              <div className="acard-tags"><span className="atag">PM Vishwakarma</span><span className="atag">PMSBY</span><span className="atag">PMJJBY</span></div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-tufar-ali.jpg" alt="Tufar Ali"  />
              <div className="acard-img-bg abg-7" style={{ display: 'none' }}>🧶</div>
              <span className="acard-cluster">📍 Sector 8, Panipat</span><span className="acard-pillar">Haath</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Tufar Ali</div>
              <div className="acard-craft">Handloom Weaving · 22 yrs</div>
              <p className="acard-story">"When this rug leaves here, I don't know where it goes. I won't be there to explain it. The work has to speak by itself."</p>
              <div className="acard-tags"><span className="atag">PMSBY</span><span className="atag">PMJJBY</span><span className="atag">UPI Active</span></div>
            </div>
          </div>

          <div className="acard">
            <div className="acard-img">
              <SafeImg src="/images/artisan-sunita-devi.jpg" alt="Sunita Devi"  />
              <div className="acard-img-bg abg-8" style={{ display: 'none' }}>✨</div>
              <span className="acard-cluster">📍 Sanganer, Jaipur</span><span className="acard-pillar">Haath</span>
            </div>
            <div className="acard-body">
              <div className="acard-name">Sunita Devi</div>
              <div className="acard-craft">Block Printing · 28 yrs</div>
              <p className="acard-story">"A good block stamp is like a signature. You can always tell which hand pressed it, even fifty years later. The pressure is personal."</p>
              <div className="acard-tags"><span className="atag">PMSBY</span><span className="atag">PMJJBY</span><span className="atag">Atal Pension</span></div>
            </div>
          </div>

        </div>
        </div>
    </section>
  )
}
