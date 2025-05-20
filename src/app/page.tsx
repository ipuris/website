import styles from './styles.module.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
})

export default function Home() {
  return (
    <main className={`max-h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide`}>
      <h1 className={`${inter.className} fixed top-24 mx-[2rem] text-5xl font-bold z-50 md:top-32 md:mx-[4rem] md:text-6xl`}>HAN PARK</h1>
      
      <Section>
        <SectionHeading>AN ENTREPRENEUR</SectionHeading>
        <SectionHeadingDescription>
          Co-founder of <a href="https://deeplyin.com" target="_blank">Deeply</a>, a sound AI startup
        </SectionHeadingDescription>
      </Section>
      
      <Section>
        <SectionHeading>A RESEARCHER</SectionHeading>
        <SectionHeadingDescription>who loves computer science and security</SectionHeadingDescription>
        <SectionContentsContainer>
          <SectionContents>
            <SectionContentsHeading>Research Interest</SectionContentsHeading>
            <ul className={`${styles.researchinterest} flex flex-wrap text-xs text-neutral-800 dark:text-neutral-200 font-light md:text-base`}>
              <li>usable security</li>
              <li>authentication</li>
            </ul>
          </SectionContents>
          <SectionContents>
            <SectionContentsHeading>Publication</SectionContentsHeading>
            <ol className={`${styles.paperlist} list-decimal list-outside text-xs text-neutral-800 dark:text-neutral-200 font-light pl-[0.9375rem] md:text-base md:pl-[1.125rem]`}>
              <li>
                Myeonghoon Ryu, Hongseok Oh, Suji Lee, Han Park, <a href="https://arxiv.org/abs/2410.18322" target="_blank">&#34;Unified Microphone Conversion: Many-to-Many Device Mapping via Feature-wise Linear Modulation,&#34;</a> <span className={`${styles.source}`}>Interspeech 2025</span>
              </li>
              <li>
                Myeonghoon Ryu, June-Woo Kim, Minseok Oh, Suji Lee, Han Park, <a href="https://arxiv.org/abs/2501.11631" target="_blank">&#34;Noise-Agnostic Multitask Whisper Training for Reducing False Alarm Errors in Call-for-Help Detection,&#34;</a> <span className={`${styles.source}`}><abbr title="IEEE International Conference on Acoustics, Speech and Signal Processing">ICASSP</abbr> 2025</span>
              </li>
              <li>
                Myeonghoon Ryu, Hongseok Oh, Suji Lee, Han Park, <a href="https://arxiv.org/abs/2401.06913" target="_blank">&#34;Microphone Conversion: Mitigating Device Variability in Sound Event Classification,&#34;</a> <span className={`${styles.source}`}><abbr title="IEEE International Conference on Acoustics, Speech and Signal Processing">ICASSP</abbr> 2024</span>
              </li>
            </ol>
          </SectionContents>
        </SectionContentsContainer>
      </Section>
      

      <Section>
        <SectionHeading>A DEVELOPER</SectionHeading>
        
      </Section>


      <Section>
        <SectionHeading>A PERSON</SectionHeading>
        <SectionHeadingDescription>
          who loves writing, design, and basketball
        </SectionHeadingDescription>
      </Section>

    </main>
  )
}

const Section = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <section className={`w-full h-screen snap-start px-[2rem] md:px-[4rem]`}>
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