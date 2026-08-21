import Link from 'next/link'

export default function SiteFooter({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <footer>
      <div className="fgd">
        <div>
          <Link href="/" className="flogo">
            Eco<em>Weave</em>®
          </Link>
          <p className="fdesc">
            India&apos;s first CiCLO® powered home textile brand.
            <br />
            Student-founded. Artisan-made. Planet-first.
            <br />
            <br />
            🌿 ecoweave.in · aarav@ecoweave.in
            <br />
            terawaarp@gmail.com
          </p>
        </div>

        <div>
          <h4>Products</h4>
          <ul>
            {/*
              Pehle ye links showCat('curtains') call karte the — par us naam ki
              koi category hai hi nahi, to click karne pe poora shop gayab ho
              jaata tha. Ab seedha #products pe le jaate hain.
            */}
            <li>
              <a href="#products">Handloom Rugs</a>
            </li>
            <li>
              <a href="#products">Shower Curtains</a>
            </li>
            <li>
              <a href="#products">Table Linen</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Platform</h4>
          <ul>
            <li>
              <a href="#platform">Panipat Cluster</a>
            </li>
            <li>
              <a href="#platform">Jaipur Cluster</a>
            </li>
            <li>
              <a href="#sutradhar">Sutradhar Initiative</a>
            </li>
            <li>
              <a href="#impact">Impact</a>
            </li>
            <li>
              <a href="#solution">CiCLO® Science</a>
            </li>
            <li>
              <Link
                href={isLoggedIn ? '/dashboard' : '/join'}
                style={{ color: 'var(--sage-l)' }}
              >
                Weaver Connect ↗
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#founder">About Aarav</a>
            </li>
            <li>
              <a href="mailto:aarav@ecoweave.in">Contact</a>
            </li>
            <li>
              <Link href={isLoggedIn ? '/dashboard' : '/login'}>
                {isLoggedIn ? 'My Account' : 'Log In'}
              </Link>
            </li>
            <li>
              <a
                href="https://ciclotextiles.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                CiCLO® Website
              </a>
            </li>
            <li>
              <a
                href="https://www.jiwarajka.com/jiwarajka-partners-with-ciclo-technology-to-advance-eco-conscious-textiles"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jiwarajka × CiCLO® ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="fbot">
        <span>© 2026 EcoWeave® · ecoweave.in · All rights reserved</span>
        <span>Made in India with 🌿 and CiCLO® Technology</span>
      </div>
    </footer>
  )
}
