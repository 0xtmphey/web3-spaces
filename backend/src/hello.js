import * as db from './db.js'

const main = async () => {
    await db.updateTokenIdFor(20, '0x8203961DDE79eFB445b9705587a915328f3cb72e')
    const record = await db.getRecordForToken(20)
    console.log(record)
}

main()