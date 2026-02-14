const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const config = {
    connectionString:
    `Driver={ODBC Driver 18 for SQL Server};Server=process.env.DATABASE_PASS;Database=MyContacts;Trusted_Connection=yes;Encrypt=no;TrustServerCertificate=yes`,
};

async function connectToTheDatabase(){
    console.log("Loading Database Connection....");
    try{
        await sql.connect(config);
        console.log("Database connected, good to go...");
    }catch(err){
        console.log("Error in connecting: " , err);
    }
}


module.exports = {sql, connectToTheDatabase};
