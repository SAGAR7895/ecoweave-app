'use client'

import { useEffect, useRef, type ImgHTMLAttributes } from 'react'

/**
 * Original page har <img> pe onerror="..." lagata tha taaki image load
 * na ho to uske peeche wala emoji fallback dikh jaye.
 * JSX string handlers support nahi karta, isliye wahi behaviour yahan.
 */
function showFallback(el: HTMLImageElement) {
  el.style.display = 'none'
  const sibling = el.nextElementSibling as HTMLElement | null
  // fallback divs par inline `display:none` hota hai
  if (sibling && sibling.style.display === 'none') {
    sibling.style.display = 'flex'
  }
}

export default function SafeImg(props: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Page server pe render hota hai, to image hydration se PEHLE hi fail
    // ho sakti hai — us soorat mein React ka onError kabhi chalta hi nahi.
    // Isliye mount hote hi khud check kar lete hain.
    if (el.complete && el.naturalWidth === 0) showFallback(el)
  }, [])

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img ref={ref} {...props} onError={(e) => showFallback(e.currentTarget)} />
  )
}
