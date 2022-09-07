# multicast
Playground for IPv6 Payments Thoughts

FF1B:: will be the multicast header for bitcoin some day we hope. 

> Jake Jones:
> FF denotes multicast
> 0/1 (4 bits) denotes well-known or transient, respectively
> (0-F) (4 bits) denotes the scope which involves #of hops etc. E.g. 2 is for link-local, E is global, etc.

We need a way to start a communication channel about a particular topic. A payment between two or more parties for example.

```javascript

new MulticastAddress('some unique string')

// perhaps
const bytes = 'ff1b' + bsv.Hash.sha512(Buffer.from('jake_deggen_multicast' + crypto.randomBytes(4).toString('hex'))).slice(0,14).toString('hex')
const multicastAddress = bytes.split('').reduce((a, b) => {
    if (a?.[a?.length - 1].length < 4) a?.[a?.length - 1].push(b)
    else a.push([b])
    return a
}, [[]]).map(x => x.join('')).join(':')

// 'ff1b:6719:7547:742b:6c78:2880:9a6d:0f98'

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
