const http = require("http");
const url = require("url");
const fs = require("fs");


const server = http.createServer((req,res)=>{
    const path = url.parse(req.url,true);

    if(path.pathname === "/"){
        fs.readFile("./index.html","utf-8",(error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            res.writeHead(200,{"Content-Type":"text/html"});
            res.write(data);
            res.end() 
        })
    }
    if(path.pathname === "/set-todo"){
        let query = path.query;
        fs.readFile("./data.json","utf-8",(error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            let todo = data ? JSON.parse(data) : [];
            todo.push(query)
            fs.writeFile("./data.json",JSON.stringify(todo),(error,data)=>{
                if(error){
                    console.log(error);
                    return;
                }
                console.log("data successfully added")
                res.end()
            })
        })
    }
    if(path.pathname === "/get-data"){
        fs.readFile("./data.json","utf-8",(error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            res.writeHead(200,{"Content-Type":"application/json"});
            res.write(data)
            res.end()
        })
    }
    if(path.pathname === "/del-data"){
        let {id} = path.query
        fs.readFile("./data.json",'utf-8',(error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            let array = data ? JSON.parse(data) : [];
           array = array.filter((item,index)=> id != index)
           fs.writeFile("./data.json",JSON.stringify(array),(error,data)=>{
            if(error){
                console.log(error);
                return;
            }
            console.log(`successfully deleted : ${path.query.id}`);
            res.end();
           })
        })
    }
    if(path.pathname === "/edit-data"){
        let {id,new_data} = path.query;
        fs.readFile("./data.json","utf-8",(error,data)=>{
            if(error){
                console.log(error);
                res.end("error");
                return;
            }
            todos = data ? JSON.parse(data) : [];
            todos = todos.map((item,ind)=>{
                if(ind == id){
                    return {todo:new_data}
                }
                return item
            })
            fs.writeFile("./data.json",JSON.stringify(todos),(error)=>{
                if(error){
                    console.log(error);
                    res.end("error");
                    return;
                }
                console.log("edited successfully");
            })
        })
    }
})



server.listen(3000,(error)=>{
    if(error){
        console.log(error);
        return;
    }
    console.log("server start");
})