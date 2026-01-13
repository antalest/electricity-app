import { prisma } from './src/lib/prisma'

async function main() {
  // Example: Fetch all records from a table
  // Replace 'user' with your actual model name
  const allData = await prisma.electricitydata.findFirst()
  console.log('All electricity data:', JSON.stringify({...allData, id: allData?.id.toString()}, null, 2)) // convert id from BigInt to string separately
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })