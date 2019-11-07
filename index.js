const express = require("express");
const server = express();
const firebase = require("./db");
const bcrypt =  require("bcrypt");
server.use(express.json());
// console.log(firebase)
const db = firebase.firestore();

const port = process.env.PORT || 8000;


// register
server.post("/",(req,res) =>{
    console.log("hi",req.body);
    let user = req.body.username;
    let pass = req.body.password;
    // let name = req.body.name;
    bcrypt.hash(pass, 8, function(err, hash) {
        // Store hash in your password DB.

        db.collection("users").add({
            user,
            pass: hash,
            id:[]
        })
        .then(function(docRef) {
        
            res.send({
                obj:"success",
                id:docRef.id,
                list:[]
            })
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

      });
   
})

// add bookmark
server.post("/bookmark",(req,res) =>{
    let id = req.body.id;
    // let arr = req.body.list;// need array
    let val = req.body.val;
    db.collection("bookmark").where("url","==",val.url).get().then( function(snap){
        var flag = false;
        snap.forEach( (doc) =>{
            flag = true;
            db.collection("users").doc(id).get().then( (rest) =>{
                let arr = rest.data().id;
                arr.push(doc.id);
                db.collection("users").doc(id).set({id: arr},{merge: true});
                res.send({
                    obj:"success",
                    id:"null",
                    list:[]

                })
            }).catch( e=> console.log(e))

        })
        if(!flag){
            db.collection("bookmark").add(val).then( doc =>{
                db.collection("users").doc(id).get().then( rest =>{
                let arr = rest.data().id;
                arr.push(doc.id);
                db.collection("users").doc(id).set({id: arr},{merge: true});
                res.send({
                    obj:"success new",
                    id:"null",
                    list:[]

                })
                });
            })
        }
    })
})

//login

server.post("/test",(req,res) =>{
    let user = req.body.username;
    let pass = req.body.password;
    let flag = false;
    db.collection("users").where("user","==",user).get().then( function(snap){
        let check = false;
        snap.forEach( function(doc){
            check = true;
                bcrypt.compare(pass, doc.data().pass,function(err, result){
                    if(result ){
                        let arr = doc.data().id;
                        let prom=[];
                        arr.forEach( val=>{
                            prom.push(db.collection("bookmark").doc(val).get());
                        });
                        Promise.all(prom).then(val =>{
                            let tosend=[];  
                            val.forEach(doc=>{
                                tosend.push(doc.data());
                            });
                            res.send({
                                obj: "true",
                                id: doc.id,
                                list:tosend
                            });
                            check = true;
                        }).catch(e => console.log(e))
                    }  
                });
           
        })
        if(!check){
            res.send({
                obj: "false",
                id:"null",
                list:"null"           
            })
        }
    }).catch(e => console.log(e));
});

//remove bookmark
server.post("/del", (req,res) =>{
    let id = req.body.id;
    let data = req.body.val;
    db.collection("bookmark").where("url","==",data.url).get().then( snap =>{
        snap.forEach( doc =>{
              let rem = doc.id;
              db.collection("users").doc(id).get().then( val=>{
                  let arr = val.data().id;
                  let tosend= arr.filter(val =>{
                      return val != rem
                  })
                  db.collection("users").doc(id).set({ id: tosend},{merge: true});
                  res.send({"status":"success"})
              })
        })
    })
})

server.get("/in", (req,res) =>{
     res.send({
         status:"succe"
     })
})

server.get("*", (req, res) => {
    res.send({"error":"no page available"});
})




server.listen(port,() =>{
    console.log("started");
})



