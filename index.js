import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mysql from "mysql2"

const app = express();
app.use( express.json() );
app.use( cors() );
dotenv.config();

const PORT = process.env.PORT || 3030;
const CREDENTIAL = JSON.parse(process.env.CREDENTIAL);
const mysqlTable = "MOCK_DATA";

const db = mysql.createConnection(CREDENTIAL);

// Check
db.connect( (err) => {
    if(err) {
        // console.error(err);
        console.error(err)
        process.exit(1);
    }
    console.log("MYQSL connected!");
});

app.get("/", (req, res) => {
    console.log('MYSQL: I am root"');
    res.send("MYSQL: I am root");
});

// GET: ALL
app.get("/gettable", (req, res) => {
    //  Query
    const query = `SELECT * FROM ${mysqlTable} ORDER BY id DESC LIMIT 10`
    // Send the query
    db.query(query, (err, result) => {
        if(err) { process.exit(1); }
    // Result
        console.table(result);
        res.send("Query sent!");
    })
    
});

// GET by ID
app.get("/class/:id", (req, res) => {
    // Parameter and Query
    const parameter = Number(req.params.id) // or req.params["id"]
    const query = `SELECT * FROM ${mysqlTable} WHERE id=?`;

    // Send Query
    db.query(query, [parameter], (err, result) => {
        if(err) { process.exit(1)}
        // Result
        console.table(result);
        res.send("Query sent!")

    })
})

// POST
app.post("/post", (req, res) => {
    // parameter and query
    // const parameter = {id: null, first_name: "Anthony", last_name: "Styles", email: "Style@fashion.com", gender: "m", ip_address: "your mom's"};
    const parameter = req.body
    const query = `INSERT INTO ${mysqlTable} SET ?`;

// Send Query
db.query(query, parameter, (err, result) => {
    if(err) { 
        console.error(err)
        process.exit(1)}

    // Result
    console.log(result);
    res.send("Post Added");
})
})


app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});