const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackluque:${password}@cluster0.q58hehj.mongodb.net/blogApp?retryWrites=true&w=majority`

const blogSchema = new mongoose.Schema({
  tittle: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log(`connected ${result}`)

    const blog = new Blog({
      tittle: process.argv[3],
      author: process.argv[4],
      url: process.argv[5],
      likes: process.argv[6],
    })

    return blog.save()
  })
  .then(() => {
    Blog.find({}).then((result) => {
      result.forEach((blog) => {
        console.log(blog)
      })
      console.log('blog saved!')
      return mongoose.connection.close()
    })
      .catch((err) => console.log(err))
  })
