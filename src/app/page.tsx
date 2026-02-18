'use client'

import styles from './styles.module.css'
import { Inter } from 'next/font/google'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
})

export default function Home() {
  const sectionRefs = useRef<HTMLElement[]>([])

  useLayoutEffect(() => {
    gsap.registerPlugin(Observer)

    const sections = sectionRefs.current.filter(Boolean)
    if (!sections.length) return

    const ctx = gsap.context(() => {
      gsap.set(sections, {
        opacity: 0,
        filter: 'blur(8px)',
        pointerEvents: 'none',
      })

      const maxBlur = 8
      const duration = 0.3
      // Trigger when current velocity falls below this fraction of the peak.
      const decelerationRatio = 0.95
      // Allow an extra mobile transition when velocity exceeds this multiple.
      const velocityBoostRatio = 1.25
      // For extra mobile transitions, require this fraction of the base threshold.
      const touchThresholdRatio = 0.6
      const isMobile =
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 768px)').matches
      const cooldownMs = isMobile ? 50 : 50
      const wheelThreshold = 80

      let currentIndex = 0
      let isAnimating = false
      let lastTriggerAt = 0
      let wheelAccum = 0
      let isLocked = false
      let unlockTimer: number | undefined
      let lastTime = 0
      let peakVelocity = 0
      let lastGesturePeak = 0

      const showPanel = (index: number) => {
        sections.forEach((section, i) => {
          if (i === index) {
            section.style.pointerEvents = 'auto'
          } else {
            section.style.pointerEvents = 'none'
          }
        })
      }

      const bounce = (direction: 1 | -1) => {
        if (isAnimating) return
        isAnimating = true
        const current = sections[currentIndex]
        gsap.fromTo(
          current,
          { opacity: 1 },
          {
            opacity: 0.7,
            duration: 0.12,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              isAnimating = false
            },
          }
        )
      }

      const goTo = (index: number, force = false) => {
        const now = Date.now()
        if (now - lastTriggerAt < cooldownMs) return
        if (isAnimating && !force) return
        if (isAnimating && force) {
          gsap.killTweensOf(sections)
          isAnimating = false
        }
        lastTriggerAt = now
        isAnimating = true

        const total = sections.length
        const nextIndex = Math.min(Math.max(index, 0), total - 1)
        if (nextIndex === currentIndex) {
          isAnimating = false
          bounce(index > currentIndex ? 1 : -1)
          return
        }
        const current = sections[currentIndex]
        const next = sections[nextIndex]

        showPanel(nextIndex)

        gsap.to(current, {
          opacity: 0,
          filter: `blur(${maxBlur}px)`,
          duration,
          ease: 'power1.out',
        })

        gsap.fromTo(
          next,
          { opacity: 0, filter: `blur(${maxBlur}px)` },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration,
            ease: 'power1.out',
            onComplete: () => {
              currentIndex = nextIndex
              isAnimating = false
            },
          }
        )
      }

      showPanel(currentIndex)
      gsap.set(sections[currentIndex], { opacity: 1, filter: 'blur(0px)' })

      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      if (isMobile) {
        let touchStartY = 0
        let touchStartTime = 0
        let touchTriggered = false
        let touchPeakVelocity = 0

        const onTouchStart = (e: TouchEvent) => {
          const touch = e.touches[0]
          touchStartY = touch.clientY
          touchStartTime = performance.now()
          touchTriggered = false
          touchPeakVelocity = 0
        }

        const onTouchMove = (e: TouchEvent) => {
          if (!e.touches.length) return
          const touch = e.touches[0]
          const now = performance.now()
          const dy = touchStartY - touch.clientY
          const dt = Math.max(now - touchStartTime, 8)
          const velocity = Math.abs(dy / dt)
          touchPeakVelocity = Math.max(touchPeakVelocity, velocity)

          if (!touchTriggered && Math.abs(dy) >= wheelThreshold) {
            touchTriggered = true
            lastGesturePeak = touchPeakVelocity
            const direction = dy > 0 ? 1 : -1
            goTo(currentIndex + direction)
          } else if (
            touchTriggered &&
            velocity > lastGesturePeak * velocityBoostRatio &&
            Math.abs(dy) >= wheelThreshold * touchThresholdRatio
          ) {
            lastGesturePeak = velocity
            const direction = dy > 0 ? 1 : -1
            goTo(currentIndex + direction, true)
          }
        }

        const onTouchEnd = () => {
          touchTriggered = false
          touchPeakVelocity = 0
        }

        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchmove', onTouchMove, { passive: true })
        window.addEventListener('touchend', onTouchEnd, { passive: true })

        return () => {
          window.removeEventListener('touchstart', onTouchStart)
          window.removeEventListener('touchmove', onTouchMove)
          window.removeEventListener('touchend', onTouchEnd)
        }
      }

      Observer.create({
        type: 'wheel,pointer',
        wheelSpeed: 1,
        tolerance: 0,
        preventDefault: true,
        onChange: (self) => {
          if (isAnimating) return
          if (isLocked) return
          const delta = self.deltaY
          const now = performance.now()
          if (!lastTime) {
            wheelAccum = 0
            peakVelocity = 0
            lastTime = now
          }
          const dt = Math.max(now - lastTime, 8)
          const velocity = Math.abs(delta / dt)
          lastTime = now
          peakVelocity = Math.max(peakVelocity, velocity)
          wheelAccum += delta
          const decelerating =
            peakVelocity > 0 && velocity < peakVelocity * decelerationRatio
          if (Math.abs(wheelAccum) < wheelThreshold || !decelerating) return
          const direction = wheelAccum > 0 ? 1 : -1
          wheelAccum = 0
          peakVelocity = 0
          goTo(currentIndex + direction)
          isLocked = true
          if (unlockTimer) window.clearTimeout(unlockTimer)
          unlockTimer = window.setTimeout(() => {
            isLocked = false
          }, cooldownMs)
        },
        onStop: () => {
          if (isAnimating) return
          wheelAccum = 0
          peakVelocity = 0
          if (unlockTimer) window.clearTimeout(unlockTimer)
          isLocked = false
        },
      })

      return () => {
        document.body.style.overflow = prevOverflow
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="relative">
      <h1
        className={`${inter.className} fixed top-24 mx-[2rem] text-5xl font-bold z-50 md:top-32 md:mx-[4rem] md:text-6xl`}
      >
        HAN PARK
      </h1>
      <div className="fixed inset-0">
        <StageSection sectionRef={(el) => (sectionRefs.current[0] = el!)}>
          <SectionHeading>AN ENTREPRENEUR</SectionHeading>
          <SectionHeadingDescription>
            Co-founder of{' '}
            <a href="https://deeplyinc.com" target="_blank">
              Deeply
            </a>
            , a sound AI startup
          </SectionHeadingDescription>
        </StageSection>

        <StageSection sectionRef={(el) => (sectionRefs.current[1] = el!)}>
          <SectionHeading>A RESEARCHER</SectionHeading>
          <SectionHeadingDescription>
            who loves computer science and security
          </SectionHeadingDescription>
          <SectionContentsContainer>
            <SectionContents>
              <SectionContentsHeading>Research Interest</SectionContentsHeading>
              <ul
                className={`${styles.researchinterest} flex flex-wrap text-xs text-neutral-800 dark:text-neutral-200 font-light md:text-base`}
              >
                <li>usable security</li>
                <li>authentication</li>
              </ul>
            </SectionContents>
          </SectionContentsContainer>
        </StageSection>

        <StageSection sectionRef={(el) => (sectionRefs.current[2] = el!)}>
          <SectionHeading>A DEVELOPER</SectionHeading>
        </StageSection>

        <StageSection sectionRef={(el) => (sectionRefs.current[3] = el!)}>
          <SectionHeading>A PERSON</SectionHeading>
          <SectionHeadingDescription>
            who loves writing, design, and basketball
          </SectionHeadingDescription>
        </StageSection>
      </div>
    </main>
  )
}

const StageSection = ({
  children,
  sectionRef,
}: {
  children: React.ReactNode,
  sectionRef?: (el: HTMLElement | null) => void,
}) => {
  return (
    <section
      ref={sectionRef}
      className={`${styles.stage} absolute inset-0 px-[2rem] md:px-[4rem]`}
    >
      <div className="pt-48 md:pt-64">
        {children}
      </div>
    </section>
  )
}

const SectionHeading = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return <h2 className={`${inter.className} text-lg font-medium md:text-2xl`}>{children}</h2>
}

const SectionHeadingDescription = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return <p className="mt-0.5 font-light text-sm text-neutral-800 md:mt-2 md:text-base dark:text-neutral-200">{children}</p>
}

const SectionContentsContainer = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return <div className="mt-48 md:mt-64">{children}</div>
}

const SectionContents = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return <div className="mb-4 md:mb-8">{children}</div>
}

const SectionContentsHeading = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return <p className="text-sm font-medium md:text-xl">{children}</p>
}
