const {user,photo} =require('../models')
const jwt = require('../helper/jwt');
const bcrypt = require("../helper/bcrypt")


module.exports = class {
  static async register(req, res) {
    try {
        const userData = await user.findOne({
          where: {
              username : req.body.username
          }
      });
      
      if (userData) {
          res.status(400).json({
              message: "User sudah tersedia"
          });
          return;
      }

      const newUser = await  user.create({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
      })

      const secure = JSON.parse(JSON.stringify(newUser))
      delete secure.password

      res.status(201).json({
        message : "User Created",
        data : secure
      })
    } catch (error) {
      res.status(400).json({
        status: "Create user fail",
        message: error.message
      })
    }
  }

static async login(req,res){
    try {
    
        const userAccount =await user.findOne({
          where: {
              email : req.body.email
          }
         });
     
        if (!userAccount) {
            throw {
              code: 404,
              message: "Username tidak ditemukan"
            }
          }
          
        const isCorrect = await bcrypt.comparePassword(req.body.password, userAccount.password)
      
        if (!isCorrect) {
          throw {
            code: 401,
            message: "Password salah"
          }
        }
        
        const response = {
            id: userAccount.id,
            email: userAccount.email,
            username: userAccount.username
          }
          const access_token = jwt.generateToken(response)
          res.status(200).json({
            access_token
          })
            
          
    } catch (error) {
        res.status(error?.code || 500).json(error)
    }
}
static async getAllUsers(req,res){
  try {
    const allData = user.findAll({
      include: [
        {
          model: photo
        }
      ]
    })
    res.status(200).json({
      data : allData
    })
  } catch (error) {
    res.status(error?.code || 500).json(error)
  }
}
}