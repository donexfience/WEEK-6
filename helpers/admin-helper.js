var db = require('../config/connection');
var collection=require('../config/collection');
const { ObjectId } = require('mongodb');
const { response } = require('express');

module.exports = {
    adduser:async (user) => {
        try {
          const data = await db.get().collection(collection.USER_COLLECTION).insertOne(user);
          console.log("User added successfully:", data.ops[0]);
          return { success: true, user: data.ops[0] };
        } catch (err) {
          console.log("Error adding user:", err);
          return { success: false, error: err.message };
        }
    },
    getalluser:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users);
        })
    },
    dologin: (userdata) => {
        let loginStatus = false;
        let response = {};
        const admin = { Email: "admin@gmail.com", password: "123456" }; 
        return new Promise(async (resolve, reject) => {
            try {
                if (admin) {
                    if (admin.password === userdata.password) {
                        loginStatus = true;
                        response.user = admin; 
                        response.status = true;
                        resolve(response);
                        console.log("success");
                    } else {
                        response.status = false;
                        resolve(response);
                        console.log("admin exist, but password is wrong");
                    }
                } else {
                    response.status = false;
                    resolve(response);
                    console.log("admin does not exist");
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    deleteuser: (prodId) => {
        return new Promise((resolve, reject) => {
          db.get().collection(collection.USER_COLLECTION)
            .deleteOne({ _id: new ObjectId(prodId) })
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
    },
    getuserdetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .findOne({ _id: new ObjectId(userId) })
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    updateuser: (userDetails, userId) => {
        return new Promise((resolve, reject) => {
            try {
                const objectId = new ObjectId(userId); // Attempt to create ObjectId
                db.get().collection(collection.USER_COLLECTION)
                    .updateOne(
                        { _id: objectId },
                        {
                            $set: {
                                Username: userDetails.Username,
                                password: userDetails.password,
                                Email: userDetails.Email,
                                Number: userDetails.Number
                            }
                        }
                    )
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } catch (error) {
                console.error("Error creating ObjectId:", error);
                reject("Invalid ObjectId format");
            }
        });
    },
    searchUsers:async (query) => {
       
        const searchResults = await db.get().collection(collection.USER_COLLECTION)
            .find({ $or: [{ Username: { $regex: query, $options: 'i' } }, { Email: { $regex: query, $options: 'i' } }] })
            .toArray();
        return searchResults;
    }
    
    
    
    
}

    


