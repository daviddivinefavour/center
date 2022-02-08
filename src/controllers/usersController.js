const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const user = require("../models/user");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4e0acd747fca61",
      pass: "8b30c9f4b4e114"
    }
  });
let data = {}
const yup = require('yup');
const { TokenExpiredError } = require("jsonwebtoken");

//Create a new user and save user data to datbase
exports.register = async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;
    // create yup schema object
     let val = yup.object().shape({
        firstname: yup.string().required("The firstname field is required"),
        lastname: yup.string().required("The lastname field is required"),
        email: yup.string().email().required("The email field is required"),
        phone: yup.string().required("The phone field is required"),
        password: yup.string().min(6).required("The password field is required"),
     });
    // validate the schema object
    val.validate(req.body).then((data) => {
            console.log("All required data fields are filled");
        }).catch(err => {
           return res.status(500).json({ type: err.name, message: err.message });
    });

    let hashPassword = bcrypt.hashSync(password, saltRounds); // hashes the password for ssecurity purposes
    let trimmedPhone = phone.replaceAll(/\s/g, '') // remove whitespaces from phone number
    const _id = uuidv4();
    const user = await new userModel({
        _id,
        firstname,
        lastname,
        email,
        phone:trimmedPhone,
        password:hashPassword,
    }).save();

    const verificationToken = user.generateVerificationToken(); // Generate a verification token with the user's ID
    user.token = verificationToken;     // save user token to the user object in the database

    const url = `http://localhost:8080/api/v1/user/verify/${verificationToken}` // link that will be sent to the user email address for email verification
 

    try{

           transporter.sendMail({
             to: email,
             subject: 'Verify Account',
             html: `Click <a href = '${url}'>here</a> to confirm your email.`
           })


            // Returning a response to the client after successfully sending verification email
            return res.json({
                    user:user,
                     message: `Success!!! New user created. Sent a verification email to ${email}`
                });
       } catch(err){
           return res.status(500).send(err);
       }
    }

// Login as an existing user
exports.login = async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await userModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const userToken = jwt.sign(
                { email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            // user.token = userToken

            // user
            return res.status(200).json({
                user,
                message: "The user is logged in!!!",
                token: userToken
            });
        }
    
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
};

//Update a users profile in the database
exports.updateUserProfile = async (req, res) => {
    try {
        const { firstname, lastname, phone, email } = req.body;
        const {id} = req.params
        let user = await userModel.findById(id).exec();
        user.set({
            firstname,
            lastname,
            phone,
            email
        });
        await user.save();

        data.user = user
        data.message = ("Success!!! User Profile updated...")
        data.status = 200
        return res.json(data)   
    } catch (error) {
        return Promise.reject(error);
    }
};

//Change user passwor    // Our register logic ends hered and save to database.
exports.changePassword = async (req, res) => {
    try {
       // deconstruct request body and save details in variables for easy manipulations 
        const { current_password, new_password,confirm_password} = req.body;
        const { id } = req.params // deconstruct the requests parameters and save id 
        let user = await userModel.findById(id).exec(); // returns user detail based the id passed in request parameter.
        const comparedPassword = await user.comparePassword(current_password) // compares the current password to the password saved to the database.
        const passwordReset = confirmPassword(new_password, confirm_password) // compares the new_password and confirm_password fields 
        if (comparedPassword) {
            if (passwordReset) {
                const hashPassword = bcrypt.hashSync(new_password, 10);
                user.set({ password: hashPassword });
                await user.save();
                return res
                    .status(200) // ok
                    .json({ succeed: "Password updated successfully" }); 
            }
            return res
                .status(400) //bad request
                .json({ error: "new password and confirm password must be the same!!!" });        
        }
        return res
            .status(400) //bad request
            .json({ error: "Incorrect Password" }); // in current password is not same as password stored in database
        } catch (error) {
            return Promise.reject(error);
  }
};

// Verify user email address
exports.verifyUser = async (req,res) => {

    const {token} = req.params

    console.log(token)

// if(user.verifiedStatus===false){


//  }

};

const confirmPassword = (p1, p2) => p1 === p2;