import { MutableRefObject, RefObject, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import {
  MOBILE_MEDIA_QUERY,
  SCROLL_INPUT,
  SECTION_INDEX,
  STAGE_ANIMATION,
} from './constants'

type UseStageTransitionsParams = {
  sectionRefs: MutableRefObject<Array<HTMLElement | null>>
  titleRef: RefObject<HTMLHeadingElement>
  glitchClassName: string
  onDeveloperEnter?: () => void
}

export const useStageTransitions = ({
  sectionRefs,
  titleRef,
  glitchClassName,
  onDeveloperEnter,
}: UseStageTransitionsParams) => {
  useLayoutEffect(() => {
    gsap.registerPlugin(Observer)

    const sections = sectionRefs.current.filter(
      (section): section is HTMLElement => Boolean(section)
    )
    if (!sections.length) return

    const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches
    const cooldownMs = isMobile
      ? SCROLL_INPUT.mobileCooldownMs
      : SCROLL_INPUT.desktopCooldownMs
    const wheelThreshold = isMobile
      ? SCROLL_INPUT.mobileWheelThreshold
      : SCROLL_INPUT.desktopWheelThreshold

    const ctx = gsap.context(() => {
      gsap.set(sections, {
        opacity: 0,
        filter: `blur(${STAGE_ANIMATION.maxBlur}px)`,
        pointerEvents: 'none',
      })

      let currentIndex = 0
      let isAnimating = false
      let lastTriggerAt = 0
      let wheelAccum = 0
      let isLocked = false
      let unlockTimer: number | undefined
      let glitchTimer: number | undefined
      let lastGesturePeak = 0

      const showPanel = (index: number) => {
        sections.forEach((section, sectionIndex) => {
          section.style.pointerEvents = sectionIndex === index ? 'auto' : 'none'
        })
      }

      const triggerSectionEnterEffect = (index: number) => {
        switch (index) {
          case SECTION_INDEX.ENTREPRENEUR: {
            if (!titleRef.current) return
            if (glitchTimer) {
              window.clearTimeout(glitchTimer)
            }
            glitchTimer = window.setTimeout(() => {
              titleRef.current?.classList.remove(glitchClassName)
              // force reflow to restart animation
              void titleRef.current?.offsetWidth
              titleRef.current?.classList.add(glitchClassName)
            }, 500)
            return
          }
          default:
            return
        }
      }

      const bounceCurrentPanel = () => {
        if (isAnimating) return
        isAnimating = true
        gsap.fromTo(
          sections[currentIndex],
          { opacity: 1 },
          {
            opacity: STAGE_ANIMATION.bounceOpacity,
            duration: STAGE_ANIMATION.bounceDurationSec,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              isAnimating = false
            },
          }
        )
      }

      const goTo = (targetIndex: number, force = false) => {
        const now = Date.now()
        if (now - lastTriggerAt < cooldownMs) return
        if (isAnimating && !force) return
        if (isAnimating && force) {
          gsap.killTweensOf(sections)
          isAnimating = false
        }

        const nextIndex = Math.min(Math.max(targetIndex, 0), sections.length - 1)
        if (nextIndex === currentIndex) {
          bounceCurrentPanel()
          return
        }

        if (nextIndex === SECTION_INDEX.DEVELOPER) {
          // Restart terminal timeline before the section fades in.
          onDeveloperEnter?.()
        }

        lastTriggerAt = now
        isAnimating = true
        showPanel(nextIndex)

        const current = sections[currentIndex]
        const next = sections[nextIndex]

        gsap.to(current, {
          opacity: 0,
          filter: `blur(${STAGE_ANIMATION.maxBlur}px)`,
          duration: STAGE_ANIMATION.transitionDurationSec,
          ease: 'power1.out',
        })

        gsap.fromTo(
          next,
          { opacity: 0, filter: `blur(${STAGE_ANIMATION.maxBlur}px)` },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: STAGE_ANIMATION.transitionDurationSec,
            ease: 'power1.out',
            onComplete: () => {
              currentIndex = nextIndex
              isAnimating = false
              triggerSectionEnterEffect(nextIndex)
            },
          }
        )
      }

      showPanel(currentIndex)
      gsap.set(sections[currentIndex], { opacity: 1, filter: 'blur(0px)' })

      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const cleanupHandlers: Array<() => void> = []

      if (isMobile) {
        let touchStartY = 0
        let touchStartTime = 0
        let touchTriggered = false
        let touchPeakVelocity = 0

        const onTouchStart = (event: TouchEvent) => {
          const touch = event.touches[0]
          touchStartY = touch.clientY
          touchStartTime = performance.now()
          touchTriggered = false
          touchPeakVelocity = 0
          lastGesturePeak = 0
        }

        const onTouchMove = (event: TouchEvent) => {
          if (!event.touches.length) return
          const touch = event.touches[0]
          const now = performance.now()
          const dy = touchStartY - touch.clientY
          const dt = Math.max(now - touchStartTime, 8)
          const velocity = Math.abs(dy / dt)
          touchPeakVelocity = Math.max(touchPeakVelocity, velocity)

          if (!touchTriggered && Math.abs(dy) >= wheelThreshold) {
            touchTriggered = true
            lastGesturePeak = touchPeakVelocity
            goTo(currentIndex + (dy > 0 ? 1 : -1))
            return
          }

          if (
            touchTriggered &&
            velocity > lastGesturePeak * SCROLL_INPUT.velocityBoostRatio &&
            Math.abs(dy) >= wheelThreshold * SCROLL_INPUT.touchThresholdRatio
          ) {
            lastGesturePeak = touchPeakVelocity
            goTo(currentIndex + (dy > 0 ? 1 : -1), true)
          }
        }

        const onTouchEnd = () => {
          touchTriggered = false
          touchPeakVelocity = 0
        }

        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchmove', onTouchMove, { passive: true })
        window.addEventListener('touchend', onTouchEnd, { passive: true })

        cleanupHandlers.push(() => {
          window.removeEventListener('touchstart', onTouchStart)
          window.removeEventListener('touchmove', onTouchMove)
          window.removeEventListener('touchend', onTouchEnd)
        })
      } else {
        const observer = Observer.create({
          type: 'wheel,pointer',
          wheelSpeed: 1,
          tolerance: 0,
          preventDefault: true,
          onChange: (self) => {
            if (isAnimating || isLocked) return
            wheelAccum += self.deltaY
            if (Math.abs(wheelAccum) < wheelThreshold) return
            goTo(currentIndex + (wheelAccum > 0 ? 1 : -1))
            wheelAccum = 0
            isLocked = true
            if (unlockTimer) window.clearTimeout(unlockTimer)
            unlockTimer = window.setTimeout(() => {
              isLocked = false
            }, cooldownMs)
          },
          onStop: () => {
            wheelAccum = 0
            if (unlockTimer) window.clearTimeout(unlockTimer)
            isLocked = false
          },
        })

        cleanupHandlers.push(() => {
          observer.kill()
        })
      }

      return () => {
        cleanupHandlers.forEach((cleanup) => cleanup())
        if (unlockTimer) {
          window.clearTimeout(unlockTimer)
        }
        if (glitchTimer) {
          window.clearTimeout(glitchTimer)
        }
        document.body.style.overflow = prevOverflow
      }
    })

    return () => {
      ctx.revert()
    }
  }, [sectionRefs, titleRef, glitchClassName, onDeveloperEnter])
}
