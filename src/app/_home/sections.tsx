import type { ReactNode } from 'react'
import stageStyles from './stage.module.css'

const mergeClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(' ')

type StageSectionProps = {
  children: ReactNode
  sectionRef?: (el: HTMLElement | null) => void
  className?: string
}

export const StageSection = ({
  children,
  sectionRef,
  className,
}: StageSectionProps) => {
  return (
    <section
      ref={sectionRef}
      className={mergeClassNames(
        `${stageStyles.stage} absolute inset-0 pl-[2rem] pr-[2rem] md:pl-[4rem] md:pr-[4rem]`,
        className
      )}
    >
      <div className="pt-56 md:pt-72">{children}</div>
    </section>
  )
}

type SectionHeadingProps = {
  children: ReactNode
  className?: string
}

export const SectionHeading = ({ children, className }: SectionHeadingProps) => {
  return (
    <h2 className={mergeClassNames('text-xl font-medium md:text-3xl', className)}>
      {children}
    </h2>
  )
}

type SectionHeadingDescriptionProps = {
  children: ReactNode
  className?: string
}

export const SectionHeadingDescription = ({
  children,
  className,
}: SectionHeadingDescriptionProps) => {
  return (
    <p
      className={mergeClassNames(
        'mt-0.5 text-base font-thin text-neutral-800 md:mt-2 md:text-lg dark:text-neutral-200',
        className
      )}
    >
      {children}
    </p>
  )
}

type SectionContentsContainerProps = {
  children: ReactNode
}

export const SectionContentsContainer = ({
  children,
}: SectionContentsContainerProps) => {
  return <div className="mt-48 md:mt-64">{children}</div>
}

type SectionContentsProps = {
  children: ReactNode
}

export const SectionContents = ({ children }: SectionContentsProps) => {
  return <div className="mb-4 md:mb-8">{children}</div>
}

type SectionContentsHeadingProps = {
  children: ReactNode
}

export const SectionContentsHeading = ({
  children,
}: SectionContentsHeadingProps) => {
  return <p className="text-sm font-medium md:text-xl">{children}</p>
}
