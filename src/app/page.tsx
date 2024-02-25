import styles from './styles.module.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
})

export default function Home() {
  return (
    <main className={`max-w-md mx-auto md:max-w-screen-2xl`}>
      <h1 className={`${inter.className} fixed top-24 mx-[2rem] text-5xl font-bold md:top-32 md:mx-[4rem] md:text-6xl`}>HAN PARK</h1>
      <section className={`h-[150vh] mx-[2rem] mb-8 md:mx-[4rem]`}>
        <div className="sticky top-48 md:top-60">
          <h2 className={`${inter.className} text-lg font-medium md:text-2xl`}>AN ENTREPRENEUR</h2>
          <p className="mt-0.5 font-light text-sm md:mt-2 md:text-base">
            Co-founder of <a className={`${styles.link}`} href="https://deeplyin.com" target="_blank">Deeply</a>, a sound AI startup
          </p>
        </div>
      </section>
      

      <section className={`h-[150vh] mx-[2rem] mb-8 md:mx-[4rem]`}>
        <div className="sticky top-48 md:top-60">
          <h2 className={`${inter.className} text-lg font-medium md:text-2xl`}>A RESEARCHER</h2>
          <p className="mt-0.5 font-light text-sm md:mt-2 md:text-base">
            
          </p>

          <div className="mt-48 md:mt-64">
            <div className="mb-4 md:mb-8">
              <h3 className="text-sm font-medium md:text-xl">Research Interest</h3>
              <ul className={`${styles.researchinterest} flex flex-wrap text-xs text-neutral-800 font-light md:text-base`}>
                <li>usable security</li>
                <li>authentication</li>
              </ul>
            </div>

            <div className="mb-4 md:mb-8">
              <h3 className="text-sm font-medium md:text-xl">Publication</h3>
              <ol className={`${styles.paperlist} list-decimal list-outside text-xs text-neutral-800 font-light pl-3 md:text-base md:pl-[1.125rem]`}>
                <li>
                  Myeonghoon Ryu, Hongseok Oh, Suji Lee, Han Park, <a className={`${styles.link}`} href="https://arxiv.org/abs/2401.06913" target="_blank">"Microphone Conversion: Mitigating Device Variability in Sound Event Classification,"</a> <span className={`${styles.source}`}><abbr title="IEEE International Conference on Acoustics, Speech and Signal Processing">ICASSP</abbr> 2024</span>
                </li>
              </ol>
            </div>

          </div>
        </div>
      </section>
      

      <section className={`h-[150vh] mx-[2rem] mb-8 md:mx-[4rem]`}>
        <div className="sticky top-60">
          <h2 className={`${inter.className} text-lg font-medium md:text-2xl`}>A DEVELOPER</h2>
          <p className="mt-0.5 font-light text-sm md:mt-2 md:text-base">
          </p>
        </div>
      </section>


      <section className={`h-[150vh] mx-[2rem] mb-8 md:mx-[4rem]`}>
        <div className="sticky top-60">
          <h2 className={`${inter.className} text-lg font-medium md:text-2xl`}>A PERSON</h2>
          <p className="mt-0.5 font-light text-sm md:mt-2 md:text-base">
            who loves writing, design, basketball, and photo
          </p>
        </div>
      </section>

    </main>
  )
}
