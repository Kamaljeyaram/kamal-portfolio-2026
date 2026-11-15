import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/domo.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// StrictMode disabled: WebGL + Lenis + GSAP scrub must mount once.
createRoot(document.getElementById('root')!).render(<App />)
