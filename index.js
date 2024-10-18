import express from 'express';
import {MongoClient} from "mongodb"

let app = express();
let port = 3000 

//Set templating engine
app.set("views","./views");
app.set("view engine","pug");

//Set static assets
app.use(express.static("public"));

//Body parser
app.use(express.urlencoded({extended:true}));


let uri = `mongodb+srv://mbuguamartha786:BopgatzGpgUPJXow@cluster0.9tv1j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
let client = new MongoClient(uri)


app.get("/", async (req, res) => {
    
    try {
         await client.connect()
        let db = client.db('school')
        let studentCollection = db.collection('student')
        let result = await studentCollection.find({}).toArray()
        console.log(result)
        res.render('index', {
            students: result
        })
       
    } catch (error) {
        console.log(error)
    }

        
    });
    app.get('/students/:id',async(req,res)=>{
        let id=req.params.id;

        let db=client.db("school");
        let collection=db.collection("student")
    })

    app.post("/", async (req,res)=>{
        console.log("Form Submitted");
        

        let body=req.body;
        console.log({body});

        let studentObj={
            first_name:body["first-name"],
            last_name:body["last-name"],
            age:body.age,
            phone:body.phone,
            gender:body.gender,
            email:body.email,
            admission_number:Math.floor(Math.random()*100),
            address:body.address
        };
        //2)Validation
        if (Number(body.age)<=0){
            console.error("Invalid age");
            return res.render("index",[
                error ("Invalid Input")
            ]);
        }
        //2)Post it to the db
        let db=client.db("school");
        let studentsCollections = db.collection('student');
        let result = await studentsCollections.insertOne(studentObj);
        console.log({result});

        res.redirect("/");
    });
     //2)Validation

// let theatresCollection=db.collection("theaters");
// let theaters= await theatresCollection
//  .find({"location.address.zipcode":"92691" },{limit:20})
//  .toArray();
//   return res.json()
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});