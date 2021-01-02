import Head from 'next/head'
import styles from './layout.module.css'

import Link from 'next/link'

export const siteTitle = 'Conquest'

export function StandardHead({gamePage, infoPageSubject, infoPageCategory}) {
    return (
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>
                {siteTitle}
                {gamePage ? ' - game' : ''}
                {infoPageCategory && infoPageSubject ? `|${infoPageCategory}` : ''}
                {infoPageCategory && !infoPageSubject ? `|${infoPageCategory} Index` : ''}
                {infoPageSubject ? `|${infoPageSubject.name}` : ''}
            </title>
            <meta
                name="description"
                content={siteTitle}
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta name="og:title" content={siteTitle} />
        </Head>
    )
}

export default function Layout({ children, gamePage, backLinkUrl, backLinkText, infoPageSubject=null, infoPageCategory=null }) {

    if (gamePage) {
        return <>
            <StandardHead gamePage />
            {children}
        </>
    }


    return (
        <div className={styles.container}>
            <StandardHead infoPageSubject={infoPageSubject} infoPageCategory={infoPageCategory}/>

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