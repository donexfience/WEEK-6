var db = require('../config/connection');
var collection = require('../config/collection');

module.exports = {
    dologin: (userdata) => {
        let loginStatus = false;
        let response = {};
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userdata.Email });

                if (user) {
                    if (user.password === userdata.password) {
                        loginStatus = true;
                        response.user = user;
                        response.status = true;
                        resolve(response);
                        console.log("success");
                    } else {
                        response.status = false;
                        resolve(response);
                        console.log("user exist password wrong")
                    }
                } else {
                    response.status = false;
                    resolve(response);
                    console.log("all wrong");
                }
            } catch (error) {
                reject(error);
            }
        });
    }
};
