import { Hash, KeyPair, PubKey } from 'openspv'

export const getMCAddress = (pubkey = '') => {
    const pubkeyString = pubkey === '' ? undefined : pubkey
    let pubKey
    if (pubkeyString) pubKey = PubKey.fromString(pubkeyString)
    else pubKey = KeyPair.fromRandom().pubKey
    const bytes = 'ff1e' + Hash.sha256Sha256(Buffer.from(pubKey.toBuffer())).toString('hex').slice(0,28)
    const mc = bytes.split('').reduce((a, b) => {
        if (a?.[a?.length - 1].length < 4) a?.[a?.length - 1].push(b)
        else a.push([b])
        return a
    }, [[]]).map(x => x.join('')).join(':')
    return {
        mc,
        pk: pubKey.toString()
    }
}

export async function generate(req) {
    const { pubkey = '' } = req.query
    const mcAddress = getMCAddress(pubkey)
    return {
        props: {
            mcAddress,
        },
    }
}