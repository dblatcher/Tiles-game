import Head from 'next/head'
import styles from './layout.module.css'

import Link from 'next/link'

export const siteTitle = 'Tiles App'

export function standardHead() {
    return (
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
                name="description"
                content="Tiles App"
            />
            <meta name="og:title" content={siteTitle} />
        </Head>
    )
}

export default function Layout({ children, home, gamePage, backLinkUrl, backLinkText }) {

    if (gamePage) {
        return <>
            {standardHead()}
            {children}
        </>
    }


    return (
        <div className={styles.container}>
            {standardHead()}

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

            { !home && (
                <div className={styles.backToHome}>
                    <Link href={backLinkUrl || "/"}>
                        <a>← {backLinkUrl ? backLinkText ||"Back" : "Back to home"}</a>
                    </Link>
                </div>
            )}
        </div >
    )
}