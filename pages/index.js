import Link from 'next/link'
import DecorativeMap from '../components/DecorativeMap'
import { StandardHead, siteTitle } from '../components/Layout'
import styles from '../styles/Home.module.css'


export default function Home() {
  return (
    <div className={styles.container}>
      <StandardHead/>

      <main className={styles.main}>
        <h1 className={styles.title}>{siteTitle}</h1>

        <p className={styles.description}>
          <Link href="/game-page">start game</Link>
        </p>
        <p className={styles.description}>
          <Link href="/info">info index</Link>
        </p>
        <p className={styles.description}>
          <Link href="/about">about</Link>
        </p>
        
        <DecorativeMap scale={.5}/>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
