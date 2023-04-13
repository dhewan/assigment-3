const {user} = require('../models')
const jwt= require('../helper/jwt')

module.exports = async (req,res,next)=>{
    try {
        const payload = jwt.verifyToken(req.headers.access_token)
        if (!payload) {
            res.status(404).send({ message: 'user not found payload' })
        }
        const userData = await user.findOne({
            where: { id: payload.id, email: payload.email }
        })
        if (!userData) {
            res.status(404).send({ message: 'user not found' })
        }
         else {
            req.userLogin = userData.dataValues
  
            next()
        }
    } catch (error) {
        res.status(error?.code || 500).json(error)}
}