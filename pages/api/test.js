export default function handler(req, res) {
    console.dir({ body: req.body }, { depth: null })
    return res.status(200).send("works")
}
