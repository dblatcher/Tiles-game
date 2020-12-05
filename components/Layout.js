import Head from 'next/head'
import styles from './layout.module.css'

import Link from 'next/link'

export const siteTitle = 'Conquest'

export function StandardHead({gamePage}) {
    return (
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>
                {siteTitle}
                {gamePage ? ' - game' : ''}
            </title>
            <meta
                name="description"
                content={siteTitle}
            />
            <meta name="og:title" content={siteTitle} />
        </Head>
    )
}

export default function Layout({ children, gamePage, backLinkUrl, backLinkText }) {

    if (gamePage) {
        return <>
            <StandardHead gamePage />
            {children}
        </>
    }


    return (
        <div className={styles.container}>
            <StandardHead />

            <header className={styles.header}>
                <h2>
                    <Link href="/">
                        <a>{siteTitle}</a>
                    </Link>
                </h2>
            </header>

            <main className={styles.main}>{children}</main>

            <div className={styles.backToHome}>
                <Link href={backLinkUrl || "/"}>
                    <a>← {backLinkUrl ? backLinkText || "Back" : "Back to home"}</a>
                </Link>
            </div>
        </div >
    )
}