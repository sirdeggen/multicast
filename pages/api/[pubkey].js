import { PubKey, KeyPair, Hash } from 'openspv'
export default function handler(req, res) {
  const pubkeyString = req.query?.pubkey === 'generate' ? undefined : req.query?.pubkey
  let pubKey
  if (pubkeyString) pubKey = PubKey.fromString(pubkeyString)
  else pubKey = KeyPair.fromRandom().pubKey
  const bytes = 'ff1e' + Hash.sha256Sha256(Buffer.from(pubKey.toBuffer())).toString('hex').slice(0,28)
  const ipv6MulticastAddress = bytes.split('').reduce((a, b) => {
    if (a?.[a?.length - 1].length < 4) a?.[a?.length - 1].push(b)
    else a.push([b])
    return a
  }, [[]]).map(x => x.join('')).join(':')
  res.status(200).send(ipv6MulticastAddress)
}
