import { getMCAddress } from '/ideas/functions'

export default function handler(req, res) {
  const pubkeyString = req.query?.pubkey === 'generate' ? undefined : req.query?.pubkey
  const mcAddress = getMCAddress(pubkeyString)
  return res.status(200).json(mcAddress)
}
