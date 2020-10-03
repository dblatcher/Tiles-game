import Head from 'next/head'
import styles from './layout.module.css'

import Link from 'next/link'

export const siteTitle = 'Tiles App'

export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Tiles App"
                />
                <meta name="og:title" content={siteTitle} />
            </Head>
            <header className={styles.header}>
                {home ? (
                    <>
                        <h1>{siteTitle}</h1>
                    </>
                ) : (
                        <>
                            <h2>
                                <Link href="/">
                                    <a>{siteTitle}</a>
                                </Link>
                            </h2>
                        </>
                    )}
            </header>
            <main className={styles.main}>{children}</main>
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
        </div>
    )
}