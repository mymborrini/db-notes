import Express from "express";
import pg from "pg";
const port = process.env.PORT || 8080;
const app = new Express(); 
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new pg.Pool({
    "host": "localhost",
    "port": 5432,
    "user":"postgres",
    "password" : "postgres",
    "database" : "postgres",
    "max": 20,
    "connectionTimeoutMillis" : 0,
    "idleTimeoutMillis": 0
})


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
//get all seats 
app.get("/seats", async (req, res) => {
    

    const result = await pool.query("select * from seats");
    res.send(result.rows)
})

//book a seat give the seatId and your name
 
app.put("/:id/:name", async (req, res) => {
    try{
        const id = req.params.id 
        const name = req.params.name;
 
    
        console.log('begin transaction')
        await pool.query("BEGIN");
       // console.log('getting the row to make sure it is not booked')
        
        // Before fix
        // const sql = "SELECT * FROM seats where id = $1 and isbooked = false"

        // After fix
        const sql = "SELECT * FROM seats where id = $1 and isbooked = false FOR UPDATE"
        const result = await pool.query(sql,[id])
        //console.log('if no rows found then the operation should fail can t book')
        if (result.rowCount === 0) {
            res.send({"error": "Seat already booked"})
            return;
        } 
        //console.log('if we get the row, we are safe to update')
        const sqlU= "update seats set isbooked = true, name = $2 where id = $1"
        const updateResult = await pool.query(sqlU,[id, name]);
        
        console.log('end transaction')
        await pool.query("COMMIT");
        conn.release();
        res.send(updateResult)
    }
    catch(ex){
        console.log(ex)
        res.send(500);
    }
   
    
}) 

 

 
app.use(Express.json())
app.listen(port, () => 
console.log("Listening on " + port))

