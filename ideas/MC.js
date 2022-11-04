// Maybe we can encode multicast addresses with Base58 Check so that we can send them via any method
// (QR code, sms, Slack, email) and be universally understood to point to a multicast address
const { Base58Check, Hash } = require('openspv')

// MC prefix
const prefix = Buffer.from('18fd', 'hex')
const prefixString = 'MC'

function MulticastAddressFromBuffer(buf) {
    if (!Buffer.isBuffer(buf) || buf.length !== 14) throw Error('argument must be a Buffer of 14 bytes')
    return Base58Check.encode(Buffer.concat([prefix, buf]))
}

function BufFromMCAddress(address) {
    if (typeof address !== 'string' || !address.startsWith(prefixString))
        throw Error(`address must be a string beginning with ${prefixString}`)
    const whole = Base58Check.decode(address)
    const chk = whole.slice(0, prefixString.length)
    const buf =  whole.slice(prefixString.length , 16)
    if (Buffer.compare(chk, prefix) === -1) throw Error('Address must be a valid MC Address')
    return buf
}

class MulticastAddress {
    constructor(id = '') {
        this.buf = Hash.sha512(
            Buffer.from(id))
            .slice(0,14)
        this.MC = MulticastAddressFromBuffer(this.buf)
        const bytes = 'ff1b' + this.buf.toString('hex')
        this.ipv6 = bytes.split('').reduce((a, b) => {
            if (a?.[a?.length - 1].length < 4) a?.[a?.length - 1].push(b)
            else a.push([b])
            return a
        }, [[]]).map(x => x.join('')).join(':')
        return this
    }

    fromMC(MC) {
        this.buf = BufFromMCAddress(MC)
        this.MC = MulticastAddressFromBuffer(this.buf)
        const bytes = 'ff1b' + this.buf.toString('hex')
        this.ipv6 = bytes.split('').reduce((a, b) => {
            if (a?.[a?.length - 1].length < 4) a?.[a?.length - 1].push(b)
            else a.push([b])
            return a
        }, [[]]).map(x => x.join('')).join(':')
        return this
    }

    static fromMC(MC) {
        return new this().fromMC(MC)
    }
}

new MulticastAddress('jake_deggen' + crypto.randomBytes(4).toString('hex'))

MulticastAddress.fromMC('MC7BmTgfue2pAXUCidoqp1H19rW')

