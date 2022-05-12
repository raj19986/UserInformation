const jwt = require("jsonwebtoken");
const database = require('../userDatabase.json');
const bcrypt = require("bcrypt");
var fs = require('fs');
const { Console } = require("console");

const saltRounds = 10;

let User = []
const isLowercaseOnly = (string) => {
    const lowercaseOnly = /^[a-z]{4,}$/g;
    return lowercaseOnly.test(string);
  }

  const isPasswordCheck = (string) => {
    constpasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/;
    console.log(constpasswordRegex.test(string))
    return constpasswordRegex.test(string);
  }  
  const isFirstNameCheck = (string) => {
    constpasswordRegex =  /[A-Z,a-z]{1,}$/
    return constpasswordRegex.test(string);
  }  
function register(req, res){
    let userinfo = req.body
    let exists = false
    for(let i =0 ; i<User.length; i++) {
        if(User[i]['username']==req.body.username){
            exists = true
            break
        }
    } 
    console.log(req.body.password)
    if(isLowercaseOnly(req.body.username)  && isPasswordCheck(req.body.password) && isFirstNameCheck(req.body.firstName) && isFirstNameCheck(req.body.lastName)){
        if (exists==true) {
            res.json({"message":yes})
        }
        else {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash){
                if(err){
                    console.log(err);
                }
                else {
                    userinfo.password = hash
                    const newUser= {
                        username:req.body.username,
                        password:hash,
                        firstName:req.body.firstName,
                        lastName:req.body.lastName
                       
                    };
                    database.push(userinfo);
                    fs.writeFileSync ("userDatabase.json", JSON.stringify(database), function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.json({
                        "result": true,
                        "message": "SignUp success. Please proceed to Signin",
                        "User":newUser
                      })
                }
            })
    }
    } else {
        res.json({"message":"please enter lowercase only"})
    }
  
}
function getUser(req, res){
    const token = req.body.token
    let exists=false
    let user = {}
    if (!token) {
        res.json({message:"No token"})
    }
    for(let i =0 ; i<database.length; i++) {
        if(database[i]['jwt']==token){
            exists = true
            user = database[i]
            break
        }
    }
    if (exists == true) {
        res.json({user:user, message:"User found"})
    }
    else {
        res.json({message:"User not found"})
    }
}
function login(req, res){
    const username= req.body.username;
    const password= req.body.password;


    let exists = false
    let foundUser = {}
    for(let i =0 ; i<database.length; i++) {
        if(database[i]['username']==req.body.username){
            exists = true
            foundUser = database[i]
            break
        }
    } 

    if(exists==false){
        res.json({message:"User account does not exist"})
    }
    else {
        bcrypt.compare(password, foundUser.password, async function(err, response){
            console.log(foundUser)
            console.log(response)
            if(response === true){
                const token = await jwt.sign(
                    { name: foundUser.name},
                    "secretkey",
                    { expiresIn: "30d" }
                  );

                for(let i =0 ; i<database.length; i++) {
                    if(database[i]['username']==req.body.username){
                         database[i]['jwt']=token
                        break
                    }
                } 
                fs.writeFileSync ("userDatabase.json", JSON.stringify(database), function(err) {
                    if (err) {
                        console.log(err);
                    }
                });    
                res.json({auth: true, message:"user exists",foundUser:foundUser,});
            }
            else if(response===false){
                res.json({ auth:false, message:"Incorrect credentials"});
            }
        });
    }
    
}





module.exports = {register, login, getUser}