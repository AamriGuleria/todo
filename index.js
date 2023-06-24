const express=require("express")
const path=require("path")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const sqlite3=require("sqlite3")
const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(path.join((__dirname,"public"))))

const db=new sqlite3.Database("data.db",(err)=>{
    if(err){
        console.log("could not create database")
    }
    console.log("database created")
})

const create=`CREATE TABLE IF NOT EXISTS Todo(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Title VARCHAR(50) NOT NULL,
    Todo VARCHAR(100) NOT NULL
);`
db.run(create,(err)=>{
    if(err){
        console.log(err.message)
    }
    console.log("table created successfully")
})
app.get("/",(req,res)=>{
    res.render("home",{model:"hey"})
})
 app.get("/write",(req,res)=>{
    res.render("write")
 })

app.get("/delete/:id",(req,res)=>{
    const ii=req.params.id
    const q="DELETE FROM Todo WHERE Id=?"
    db.run(q,ii,(err)=>{
        if(err){
            console.log(err)
        }
        res.redirect("/display")
    })
})
 app.post("/write",(req,res)=>{
    const query="INSERT INTO Todo (Title,Todo) Values (?,?)";
    const entry=[req.body.title,req.body.desc]
    db.run(query,entry,(err)=>{
        if(err){
            return console.log(err)
        }
    })
    res.redirect("/display")
 })
app.get("/edit/:id",(req,res)=>{
    const i=req.params.id;
    const s="SELECT * FROM Todo WHERE Id=?";
    db.get(s,i,(err,row)=>{
        if(err){
            return console.log(err)
        }
        console.log(row)
        res.render("edit",{model:row})
    })
})
 app.post("/edit/:id",(req,res)=>{
    const ent=[req.body.title,req.body.desc,req.params.id]
    const sql="UPDATE Todo SET Title=?,Todo=? WHERE (Id=?)"
    db.run(sql,ent,(err)=>{
        console.log(err)
    })
    res.redirect("/display")
 })
 app.get("/display",(req,res)=>{
    const select="SELECT * FROM Todo;"
    db.all(select,(err,row)=>{
        if(err){
            return console.log(err)
        }
        res.render("display",{model:row})
    })
 })
app.get("")
app.listen(4000,()=>{
    console.log("app running on 3000 port")
})