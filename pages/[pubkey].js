import Head from 'next/head'
import styles from '/styles/Home.module.css'
import {generate, getMCAddress} from '../ideas/functions'

export default function Home({ mcAddress = {} }) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Multicast</title>
                <meta name="description" content="Derives a multicast address" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Multicast Group Address Generator
                </h1>

                <p className={styles.description}>
                    {mcAddress?.mc}
                    <br />
                    {mcAddress?.pk}
                </p>
            </main>
        </div>
    )
}

export async function getServerSideProps(req){
    return generate(req)
}