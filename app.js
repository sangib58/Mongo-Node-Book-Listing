const express=require('express')
const {connectToDb,getDb}=require('./db')
const { ObjectId } = require('mongodb')

//init app & middleware
const port=3000
const app=express()
app.use(express.json())

let db

connectToDb((err)=>{
    if(!err){
        app.listen(port,()=>{
            console.log(`Listening to port ${port}`)
        })
    }
    db=getDb()
})



//routes
app.get('/books',(req,res)=>{
    let page=req.query.page||0
    let booksPerPage=2
    let books=[]

    db.collection('books')
    .find()
    .sort({author:1})
    .skip(page*booksPerPage)
    .limit(booksPerPage)
    .forEach((book)=>books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(()=>{
        res.status(500).json({error:'Could not fetch the documents!'})
    })
})

app.get('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(()=>{
            res.status(500).json({error:'An unhandled error occurred!'})
        })
    }else{
        res.status(500).json({error:'Wrong Id!'})
    }
})

app.post('/books',(req,res)=>{
    const book=req.body

    db.collection('books')
    .insertOne(book)
    .then((result)=>{
        res.status(201).json(result)
    })
    .catch((err)=>{
        res.status(500).json({err:'An Error Occurred!'})
    })
})

app.delete('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(()=>{
            res.status(500).json({error:'An unhandled error occurred!'})
        })
    }else{
        res.status(500).json({error:'Wrong Id!'})
    }
})

app.patch('/books/:id',(req,res)=>{
    if(ObjectId.isValid(req.params.id)){

        const updateObj=req.body

        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)},{$set:updateObj})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(()=>{
            res.status(500).json({error:'An unhandled error occurred!'})
        })
    }else{
        res.status(500).json({error:'Wrong Id!'})
    }
})