# multicast
Playground for IPv6 Payments Thoughts

FF1B:: will be the multicast header for bitcoin some day we hope.

> Jake Jones: From [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291) Address Format:

|                 |   type    | permanence |   scope    |                                                                         groupID                                                                         |
|:----------------|:---------:|:----------:|:----------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------:|
| meaning         | multicast | transient  | blockchain |                                                                     conversationID                                                                      |
| hex             |    ff     |     1      |     b      |                                                           961d:82c2:d272:dfbe:2bcc:8ed5:b26b                                                            |
| bits            | 11111111  |    0001    |    1011    | 1001 0110 0001 1101<br/>1000 0010 1100 0010 1101 0010 0111 0010<br/>1101 1111 1011 1110 0010 1011 1100 1100<br/>1000 1110 1101 0101 1011 0010 0110 1011 |                                   |
| possible values |    FF     |    0/1     |    0-F     |                                                            Anything, including a hash output                                                            |
| length (bits)   |     8     |     4      |     4      |                                                                           112                                                                           |

We need a way to start a communication channel about a particular topic. A payment between two or more parties for example.

```javascript
const bsv = require('openspv')

class MulticastAddress {
    constructor(id) {
        const bytes = 'ff1b' + bsv.Hash.sha512(
            Buffer.from(id))
            .slice(0,14)
            .toString('hex')
        this.ipv6 = bytes.split('').reduce((a, b) => {
            if (a?.[a?.length - 1].length < 4) a?.[a?.length - 1].push(b)
            else a.push([b])
            return a
        }, [[]]).map(x => x.join('')).join(':')
        return this
    }
}

new MulticastAddress('jake_deggen' + crypto.randomBytes(4).toString('hex'))

// { ipv6: 'ff1b:6719:7547:742b:6c78:2880:9a6d:0f98' }

```

Maybe something like this could be done for a paymail capability:

POST /api/multicast/open
```javascript
headers: {
   signature: 'b83380f6e1d09411ebf49afd1a95c738686bfb2b0fe2391134f4ae3d6d77b78a'
}

{
   from: 'dk@degggen.com',
   purpose: 'Paying you for a thing we spoke about',
}
```

Then the server could respond with the ip address to converse with hereon?

```javascript
const response = new MulticastAddress(JSON.stringify({
   from: 'dk@degggen.com',
   purpose: 'Paying you for a thing we spoke about',
}) + crypto.randomBytes(4).toString('hex'))

// ff1b:961d:82c2:d272:dfbe:2bcc:8ed5:b26b

```
