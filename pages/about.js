import React from 'react'
import Layout from '../components/Layout'


export default class GamePage extends React.Component {

    render() {
        return (
            <Layout>
                <h1>About Conquest</h1>
                <p>Conquest is a free game inspired by the classic 4x strategy games.</p>
                <h2>Donate(to someone else)</h2>
                <p>If you've played this game and enjoyed it, please consider donating some of the money you might have otherwise spent on microtransactions to a worthy cause.</p>
            </Layout>
        )
    }
}