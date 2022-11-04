const bsv = require('openspv')
const pubkeyString = process.argv.slice(2)?.[0]
let pubKey
if (pubkeyString) pubKey = bsv.PubKey.fromString(pubkeyString)
else pubKey = bsv.KeyPair.fromRandom().pubKey
const bytes = 'ff1e' + bsv.Hash.sha256Sha256(Buffer.from(pubKey.toBuffer())).toString('hex').slice(0,28)
const ipv6MulticastAddress = bytes.split('').reduce((a, b) => {
    if (a?.[a?.length - 1].length < 4) a?.[a?.length - 1].push(b)
    else a.push([b])
    return a
}, [[]]).map(x => x.join('')).join(':')
console.log(ipv6MulticastAddress)