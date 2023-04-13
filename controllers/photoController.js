const {photo,user} = require('../models')

module.exports = class {
    static async getAllPhoto(req, res) {
        try {
            const data = await photo.findAll({
                where: {
                  userId: req.userLogin.id
                },
                include: [
                  {
                    model: user
                  }
                ]
              })
        
              res.status(200).json(data)
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    }
    static async getPhotoById(req, res) {
        try {
            const dataPhoto = await photo.findOne({
                where: {
                  id : req.params.id
                },
                include: [
                  {
                    model: user
                  }
                ]
              })
             
              if (!dataPhoto) {
                throw{
                  code: 404,
                  message: "Data not found!"
                }
              }
              console.log('--------2');
              if (dataPhoto.userId !== req.userLogin.id) {
                throw{
                  code: 403,
                  message: "Forbiden"
                }
              } 
        
              res.status(200).json(dataPhoto)
        } catch (error) {
          res.status(error?.code || 500).json(error)
        }
    }
    static async updatePhoto(req, res) {
        try {
            const update = await photo.update({
                title : req.body.title,
                caption: req.body.caption ,
                image_url: req.body.image 
              }, {
                where: {
                 id: req.params.id
                },
                returning: true
              })
             
              res.status(201).json(update)
            
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    }
    static async deletePhoto(req, res) {
        try {
            const deletePhoto = await photo.destroy({
                where: {
                  id:req.params.id
                }
              })
    
              if (!deletePhoto) {
                throw {
                  code: 404,
                  message: "Data not found!"
                }
              }
    
              res.status(201).json(deletePhoto)
            
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    }
    static async createPhoto(req, res) {
        try {
          
            const create = await photo.create({
                title: req.body.title,
                caption: req.body.caption,
                image_url:req.body.image,
                userId: req.userLogin.id
            })
            res.status(201).json(create)
            
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    }
}
