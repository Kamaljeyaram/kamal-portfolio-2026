import { useCallback, useEffect, useRef, useState } from 'react'
import { DomoOverlays } from '../components/DomoOverlays'
import { ProjectsStage, type ProjectsHandle } from '../components/ProjectsStage'
import { SmoothLoader } from '../components/SmoothLoader'
import { mountExperience, type ExperienceController } from '../experience/mountExperience'

export function Home() {
  const projectsRef = useRef<ProjectsHandle>(null)
  const expRef = useRef<ExperienceController | null>(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaderGone, setLoaderGone] = useState(false)

  const openProjects = useCallback((index?: number | null) => {
    projectsRef.current?.open(index)
  }, [])

  useEffect(() => {
    const exp = mountExperience({
      onProgress: setProgress,
      onReady: () => setReady(true),
      onError: (message) => setError(message),
      onProjectOpen: (index) => projectsRef.current?.open(index),
      initialSection: window.location.hash === '#builds' ? 'builds' : undefined,
    })
    expRef.current = exp
    return () => exp.dispose()
  }, [])

  const onLoaderComplete = useCallback(() => {
    setLoaderGone(true)
    expRef.current?.unlockScroll()
  }, [])

  return (
    <>
      {!loaderGone && (
        <SmoothLoader
          progress={progress}
          ready={ready}
          error={error}
          onComplete={onLoaderComplete}
        />
      )}
      <DomoOverlays hideLoader onOpenProjects={() => openProjects(null)} />
      <ProjectsStage
        ref={projectsRef}
        onPause={() => expRef.current?.pauseScroll()}
        onCovered={(covered) => expRef.current?.setCovered(covered)}
        onResume={() => expRef.current?.resumeScroll()}
      />
    </>
  )
}
