import Page from './[pubkey]'
import { generate } from '../ideas/functions'

export default Page

export async function getServerSideProps(req){
    return generate(req)
}