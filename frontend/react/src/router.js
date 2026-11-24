import { useEffect, useState } from 'react'

/*
 * A tiny router so the site can have more than one page without adding a
 * library. Pages are picked by the URL path in App.jsx.
 *
 * Any normal <a href="/some/path"> on the site is handled here: clicking it
 * swaps the page without reloading. Links to another site always open in a
 * new tab. Links that already open in a new tab or only change the #hash on
 * the current page are left to the browser as usual.
 */

const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener(window.location.pathname))
}

/** Go to a path on this site, e.g. navigate('/projects/slime-mold'). */
export function navigate(to) {
  window.history.pushState(null, '', to)
  notify()
}

/** The current URL path. Re-renders when it changes. */
export function usePath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    listeners.add(setPath)
    window.addEventListener('popstate', onPop)
    return () => {
      listeners.delete(setPath)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  return path
}

/** Turns same-site link clicks into page swaps instead of full reloads. */
export function useLinkInterception() {
  useEffect(() => {
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = event.target.closest('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return

      const url = new URL(link.href)
      if (url.origin !== window.location.origin) {
        // Links to other sites open in a new tab so visitors don't leave this
        // one, even if the link forgot target="_blank". (mailto: etc. are left alone.)
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          event.preventDefault()
          window.open(url.href, '_blank', 'noreferrer')
        }
        return
      }
      // Files like the resume PDF are real files, not pages.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return
      // Same page, different #section: let the browser scroll there.
      if (url.pathname === window.location.pathname) return

      event.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

/**
 * After a page swap, scroll to the #section in the URL if there is one
 * (e.g. clicking "Projects" in the nav from a project page).
 */
export function useScrollToHash(path) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    // Wait a frame so the new page is on screen before looking for the section.
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [path])
}
