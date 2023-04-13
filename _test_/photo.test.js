const request = require('supertest')
const app = require('../app')
const {user} = require('../models')
const {photo} = require('../models')
const jwt= require('../helper/jwt')




describe("POST /create-photo", () => {
    afterAll(async () => {
        // destroy data users
        try {
          await user.destroy({ where: {} });
          await photo.destroy({ where: {} },{truncate: true});
        } catch (error) {
          console.log(error);
        }
      });

    beforeAll(async () => { 
        try {
          const result = await user.create({
            username: "admin",
            email: "admin@mail.com",
            password: "123456",
          });
        } catch (error) {
          console.log(error);
        }
      });
      
      let auth = null

      it('should loged in', (done) => {
        request(app)
        .post("/login")
        .send({
          email: "admin@mail.com",
          password: "123456"
        })
        .expect(200)
        .end((err, res) => {  
          if (err) {
            return done(err);
          }
          // console.log(res.body);
          auth = res.body.access_token;  
          done(); 
      });})

        it("Should response 201", (done) => {
            request(app)
              .post("/create-photo")
              .set('access_token',  auth)
              .send({
                title: "sql",
                caption : "sql logo",
                image : "sql link"
              })
              .expect(201)
              .end((err, res) => {
                if (err) {
                  done(err);
                }
        
                expect(res.body.title).toEqual("sql");
                expect(res.body.caption).toEqual("sql logo");
                expect(res.body.image_url).toEqual("sql link");
                done();
              })
})
it("Should be response 500 without auth", (done) => {
  request(app)
    .post("/create-photo")
    .send({
      title: "sql",
      caption : "sql logo",
      image : "sql link"
    })
    .expect(500)
    .end((err, res) => {
      if (err) done(err);
      expect(res.body.message).toEqual("jwt must be provided");
      done();
    });
});
})

describe("POST /all-photo", () => {
  afterAll(async () => {
      // destroy data users
      try {
        await user.destroy({ where: {} });
        await photo.destroy({ where: {} },{truncate: true});
      } catch (error) {
        console.log(error);
      }
    });

  beforeAll(async () => { 
      try {

        const response ={
          username: "admin",
          email: "admin@mail.com",
          password: "123456",
        }
        const result = await user.create(response);

      } catch (error) {
        console.log(error);
      }
    });
    
    let auth = null

    it('should loged in', (done) => {
      request(app)
      .post("/login")
      .send({
        email: "admin@mail.com",
        password: "123456"
      })
      .expect(200)
      .end((err, res) => {  
        if (err) {
          return done(err);
        }
        // console.log(res.body);
        auth = res.body.access_token;  
        done(); 
    });})

    it("Should create photo with response 201", (done) => {
      request(app)
        .post("/create-photo")
        .set('access_token',  auth)
        .send({
          title: "sql",
          caption : "sql logo",
          image : "sql link"
        }
        )
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          done();
        })
})

it("Should create photo with response 201", (done) => {
  request(app)
    .post("/create-photo")
    .set('access_token',  auth)
    .send({
        title: "mongo",
        caption : "mongo logo",
        image : "mongo link"
    }
    )
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(err);
      }
      done();
    })
})

it("Should create photo with response 201", (done) => {
  request(app)
    .post("/create-photo")
    .set('access_token',  auth)
    .send({
      title: "postgres",
      caption : "postgres logo",
      image : "postgres link"
    }
    )
    .expect(201)
    .end((err, res) => {
      if (err) {
        done(err);
      }
      done();
    })
})

it("Should get all photo 200", (done) => {
  const payload = jwt.verifyToken(auth)
  request(app)
  .get("/all-photo")
  .set('access_token',  auth)
  .expect(200)
  .end((err, res) => {
    if (err) {
      done(err);
    }
    // console.log(res.body);
    expect(res.body.length).toBe(3);
    // expect(res.body[]).toEqual("sql logo");
    expect(res.body[0].user.id).toEqual(payload.id);
    expect(res.body[1].user.id).toEqual(payload.id);
    expect(res.body[2].user.id).toEqual(payload.id);
    expect(res.body[0].title).toEqual("sql");
    expect(res.body[1].title).toEqual("mongo");
    expect(res.body[2].title).toEqual("postgres");
    done();
  })
})

it("Should get all photo 500", (done) => {

  request(app)
  .get("/all-photo")
  .expect(500)
  .end((err, res) => {
    if (err) {
      done(err);
    }
    expect(res.body.message).toEqual("jwt must be provided");

    done();

  })
})
  })

  describe("POST /get-photo/:id", () => {
    afterAll(async () => {
        // destroy data users
        try {
          await user.destroy({ where: {} });
          await photo.destroy({ where: {}});
        } catch (error) {
          console.log(error);
        }
      });
  
    beforeAll(async () => { 
        try {
  
          const response ={
            username: "admin",
            email: "admin@mail.com",
            password: "123456",
          }
          const result = await user.create(response);
  
        } catch (error) {
          console.log(error);
        }
      });
      
      let auth = null
  
      it('should loged in', (done) => {
        request(app)
        .post("/login")
        .send({
          email: "admin@mail.com",
          password: "123456"
        })
        .expect(200)
        .end((err, res) => {  
          if (err) {
            return done(err);
          }
          // console.log(res.body);
          auth = res.body.access_token;  
          done(); 
      });})
  
      it("Should create photo with response 201", (done) => {
        request(app)
          .post("/create-photo")
          .set('access_token',  auth)
          .send({
            title: "sql",
            caption : "sql logo",
            image : "sql link"
          }
          )
          .expect(201)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            photoId = res.body.id

            done();
          })
  })

  let photoId=null 

  it("Should get photo by id 200", (done) => {
    const payload = jwt.verifyToken(auth)

    request(app)
    .get(`/get-photo/${photoId}`)
    .set('access_token',  auth)
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      }

      expect(res.body.user.id).toEqual(payload.id);
      expect(res.body.id).toEqual(photoId);
      expect(res.body.title).toEqual("sql");
      expect(res.body.caption).toEqual("sql logo");
      expect(res.body.image_url).toEqual("sql link");
      done();
    })
  })

  let notId 

  for (let index = 1; index < 100; index++) {
    if (index !== photoId) {
      notId = index
      break
    }
  }


  it("Should get photo by id 404", (done) => {
    const payload = jwt.verifyToken(auth)

    request(app)
    .get(`/get-photo/${notId}`)
    .set('access_token',  auth)
    .expect(404)
    .end((err, res) => {
      if (err) {
        done(err);
      }
      expect(res.body.message).toEqual("Data not found!");
      done()
    })
  })
})