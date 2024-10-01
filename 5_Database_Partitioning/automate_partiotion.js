import pg from 'pg'

/**
 * This script creates 100 partitions and attach them to the main table
 * customers
 */

async function run(){
  try {

    const dbClientPostgres = pg.Client({
      user: "postgres",
      password: "postgres",
      host: "localhost",
      port: 5432,
      datbase: "postgres"
    })
    console.log("Connecting to postgres...")
    await dbClientPostgres.connect();
    console.log("Dropping database customer...")
    await dbClientPostgres.query("drop database customers");
    console.log("Creating database customer...")
    await dbClientPostgres.query("create database customers");


    const dbClientCustomers = pg.Client({
      user: "postgres",
      password: "postgres",
      host: "localhost",
      port: 5432,
      datbase: "customers"
    })

    console.log("Connecting to datbase customers")
    await dbClientCustomers.connect();
    console.log("Create customers table...")
    const sql = `create table customers(id serial, name text) partition by range(id)`
    await dbClientCustomers.query(sql);
    console.log("Creating partitions...")
    /**
     * assume we are going to support 1B customers and each partition will have 10M 
     * customers that gives 1000/10 -> 100 partition tables
     */

    for (let index = 0; index < 100; index++) {
      const idFrom =i*10000000;
      const idTo = (i+1)*10000000;
      const partitionName = `customers_${idFrom}_${idTo}`;

      const psql1 = `create table ${partitionName} (like customers includind indexes)`;
      const psql2 = `alter table customers attach partition ${partitionName} for values from (${idFrom}) to (${idTo})`;

      console.log(`Creating partition ${partitionName}`)
      await dbClientCustomers.query(psql1);
      await dbClientCustomers.query(psql2);

      
    }

    console.log("Closing connection")
    await dbClientCustomers.end()
    await dbClientPostgres.end()
    console.log("Done")

  } catch (ex) {
    console.error(`Something went wrong ${JSON.stringify(ex)}`);
  }
}