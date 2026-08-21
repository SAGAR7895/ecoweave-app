import { createClient } from '@/lib/supabase/server'

import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Products from '@/components/Products'

import Hero from '@/components/marketing/Hero'
import Ticker from '@/components/marketing/Ticker'
import Crisis from '@/components/marketing/Crisis'
import Solution from '@/components/marketing/Solution'
import CicloPanels from '@/components/marketing/CicloPanels'
import Jiwarajka from '@/components/marketing/Jiwarajka'
import Platform from '@/components/marketing/Platform'
import Impact from '@/components/marketing/Impact'
import Workers from '@/components/marketing/Workers'
import Sutradhar from '@/components/marketing/Sutradhar'
import Duo from '@/components/marketing/Duo'
import Founder from '@/components/marketing/Founder'
import CallToAction from '@/components/marketing/CallToAction'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoggedIn = Boolean(user)

  return (
    <>
      <SiteNav isLoggedIn={isLoggedIn} />
      <Hero />
      <Ticker />
      <Crisis />
      <Solution />
      <CicloPanels />
      <Products />
      <Jiwarajka />
      <Platform />
      <Impact />
      <Workers />
      <Sutradhar />
      <Duo />
      <Founder />
      <CallToAction />
      <SiteFooter isLoggedIn={isLoggedIn} />
    </>
  )
}
