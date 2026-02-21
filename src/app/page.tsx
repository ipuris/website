'use client'

import {
  Caveat,
  Inter,
  JetBrains_Mono,
  Spectral,
} from 'next/font/google'
import { useCallback, useRef, useState } from 'react'
import { DeveloperTerminal } from './_home/DeveloperTerminal'
import { SECTION_INDEX } from './_home/constants'
import {
  SectionContents,
  SectionContentsContainer,
  SectionContentsHeading,
  SectionHeading,
  SectionHeadingDescription,
  StageSection,
} from './_home/sections'
import stageStyles from './_home/stage.module.css'
import tiktokStyles from './_home/tiktok.module.css'
import { useStageTransitions } from './_home/useStageTransitions'

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
})

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['200', '500', '700'],
  display: 'block',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  display: 'block',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'block',
})

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [developerPlayKey, setDeveloperPlayKey] = useState(0)

  const handleDeveloperEnter = useCallback(() => {
    setDeveloperPlayKey((prev) => prev + 1)
  }, [])

  useStageTransitions({
    sectionRefs,
    titleRef,
    glitchClassName: tiktokStyles.tiktokGlitch,
    onDeveloperEnter: handleDeveloperEnter,
  })

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el
  }

  return (
    <main className="relative">
      <div className="fixed left-[2rem] top-24 z-50 md:left-[4rem] md:top-32">
        <h1
          ref={titleRef}
          className={`${inter.className} -translate-x-[0.05em] text-6xl font-bold md:text-7xl`}
        >
          HAN PARK
        </h1>
      </div>

      <div className="fixed inset-0">
        <StageSection sectionRef={setSectionRef(SECTION_INDEX.ENTREPRENEUR)}>
          <SectionHeading className={inter.className}>
            AN ENTREPRENEUR
          </SectionHeading>
          <SectionHeadingDescription className="!text-sm md:!text-base">
            Co-founder of{' '}
            <a href="https://deeplyinc.com" target="_blank" rel="noreferrer">
              Deeply
            </a>
            , a sound AI startup
          </SectionHeadingDescription>
        </StageSection>

        <StageSection sectionRef={setSectionRef(SECTION_INDEX.DEVELOPER)}>
          <div className={jetbrainsMono.className}>
            <SectionHeading className={`${jetbrainsMono.className} !font-bold`}>
              A DEVELOPER
            </SectionHeading>
            <SectionContentsContainer>
              <SectionContents>
                <DeveloperTerminal playKey={developerPlayKey} />
              </SectionContents>
            </SectionContentsContainer>
          </div>
        </StageSection>

        <StageSection sectionRef={setSectionRef(SECTION_INDEX.RESEARCHER)}>
          <div className={spectral.className}>
            <SectionHeading className={spectral.className}>
              A RESEARCHER
            </SectionHeading>
            <SectionHeadingDescription>
              who loves computer science and security
            </SectionHeadingDescription>
            <SectionContentsContainer>
              <SectionContents>
                <SectionContentsHeading>Research Interest</SectionContentsHeading>
                <ul
                  className={`${stageStyles.researchInterest} flex flex-wrap text-xs font-thin text-neutral-800 md:text-base dark:text-neutral-200`}
                >
                  <li>usable security</li>
                  <li>authentication</li>
                </ul>
              </SectionContents>
            </SectionContentsContainer>
          </div>
        </StageSection>

        <StageSection sectionRef={setSectionRef(SECTION_INDEX.PERSON)}>
          <SectionHeading className={`${caveat.className} !font-bold`}>
            A PERSON
          </SectionHeading>
          <SectionHeadingDescription className={`${caveat.className} !text-lg md:!text-2xl`}>
            who loves writing, design, and basketball
          </SectionHeadingDescription>
        </StageSection>

      </div>
    </main>
  )
}
