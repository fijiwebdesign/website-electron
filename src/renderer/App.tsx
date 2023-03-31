import type * as React from 'react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { WebviewTag } from 'electron'
import TopBar from './components/top-bar'
import { appConfig } from './appConfig'

const containerMotion = {
  initial: 'hidden',
  animate: 'visible',
  variants: {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }
}

function App() {
  const [title, setTitle] = useState('')

  const setTitleFromWebView = () => {
    const webview = document.querySelector('webview')
    const title = (webview as WebviewTag)?.getTitle()
    if (title) {
      setTitle(title)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      const webview = document.querySelector('webview')
      webview?.addEventListener('did-finish-load', setTitleFromWebView)
    })
    return () => {
      const webview = document.querySelector('webview')
      webview?.removeEventListener('did-finish-load', setTitleFromWebView)
    }
  })

  return (
    <div tw="h-screen w-screen flex flex-col pt-12">
      <TopBar>
        <div tw="flex justify-center w-full" style={{ color: 'white' }}>
          {title || 'Desktop App'}
        </div>
      </TopBar>
      <motion.div tw="h-full" {...containerMotion}>
        <webview
          id="main-webview"
          src={appConfig.siteUrl}
          tw="h-full w-full"
        ></webview>
      </motion.div>
    </div>
  )
}

export default App
