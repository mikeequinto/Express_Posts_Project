const multer = require('multer')

const Post = require('../models/post')

const extractFile = require('../middleware/file.js')

exports.getPosts = (req, res) => {
  const pageSize = req.query.pageSize
  const currentPage = req.query.page
  const postQuery = Post.find()
  let fetchedPosts 
  if (pageSize && currentPage) {
      postQuery
          .skip(pageSize * (currentPage - 1))
          .limit(parseInt(pageSize))
  }
  postQuery.then(posts => {
      fetchedPosts = posts
      return Post.countDocuments()
  })
  .then(count => {
      res.status(200).json({
          message: 'Posts fetched successfully',
          posts: fetchedPosts,
          maxPosts: count
      })
  })
  .catch(error => {
      res.status(500).json({
          message: 'Fetching posts failed!'
      })
  })
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id, (err, fetchedPost) => {
      if (err) {
          res.status(500).json({
              message: 'Fetching post failed!'
          })
      } else {
          if (fetchedPost) {
              res.status(200).json({
                  message: 'Post fetched successfully',
                  post: fetchedPost
              })
          } else {
              res.status(404).json({
                  message: 'Post not found!'
              })
          }
      }
  })
}

exports.createPost = (req, res, next) => {
  extractFile(req, res, function(err){
      if (err instanceof multer.MulterError) {
          console.log('error uploading');
      } else if (err) {
          let error = 'An unknown error occured!'
          if(err.message === 'Invalid mime type') {
              error = 'Invalid image file!'
          }
          res.status(500).json({
              message: error
          })
      } else {
          const url = req.protocol + '://' + req.get('host')
          const post = new Post({
              title: req.body.title,
              content: req.body.content,
              imagePath: url + '/images/' + req.file.filename,
              creator: req.userData.userId
          })
          post.save({}, (err, createdPost) => {
              if (err) {
                  res.status(500).json({
                      message: 'Creating a post failed!'
                  })
              } else {
                  res.status(201).json({
                      message: 'Post added successfully',
                      post: {
                          ...createdPost,
                          id: createdPost._id,
                      }
                  })
              }
          })
      }
  })
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath
  if (req.file) {
      const url = req.protocol + '://' + req.get('host')
      imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post, (err, result) => {
      if (err) {
          res.status(500).json({
              message: "Couldn't update post!"
          })
      } else {
          if (result.n > 0) {
              res.status(200).json({
                  message: 'Update successful!',
                  imagePath: imagePath
              })
          } else {
              res.status(401).json({
                  message: 'Not Authorized!'
              })
          }
      } 
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}, (err, result) => {
      if (err) {
          res.status(500).json({
              message: 'Fetching posts failed'
          })
      } else {
          if (result.n > 0) {
              res.status(200).json({
                  message: 'Delete successful!'
              })
          } else {
              res.status(401).json({
                  message: 'Not Authorized!'
              })
          }
      }
  })
}