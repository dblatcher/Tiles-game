import React from 'react'
import Layout, { siteDescription } from '../components/Layout'
import DecorativeMap from '../components/DecorativeMap'
import styles from '../styles/Page.module.scss'

export default class GamePage extends React.Component {

    render() {
        return (
            <Layout>
                <article className={styles.container}>

                    <h1>About Conquest</h1>
                    <p>{siteDescription}</p>
                    <p>The project is a work in progress. Comments, suggestions and feedback are welcome. I'm on twitter<a href="https://twitter.com/webventurer1">@webventurer1</a>.</p>
                    <h2>Donate(to someone else)</h2>
                    <p>If you've played this game and enjoyed it, please consider donating some of the money you might have otherwise spent on microtransactions to a worthy cause.</p> 
                    <p>I would recommend:</p>
                    <ul>
                        <li>
                            <a href="https://www.trusselltrust.org/make-a-donation/">The Tressle Trust</a>
                        </li>
                    </ul>
                    <h2>Tech stuff</h2>
                    <p>Conquest is written in <a href="https://reactjs.org/">React</a> using the <a href="https://nextjs.org/">Next.js Framework</a>.</p>
                </article>
                <DecorativeMap scale={.5} fixed/>
            </Layout>
       )
    }
}