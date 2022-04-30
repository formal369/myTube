const express = require('express');
const router = express.Router();

const { Comment } = require('../models/Comment');


// ================================================================
//                             Comment
// ================================================================

router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body);

    comment.save((err, comment) => {
        if(err) return res.json({ success: false, err })
        
        Comment.find({ '_id' : comment._id })       // comment.find()를 쓰면 .populate('writer')를 사용해서
        .populate('writer')                         // writer의 정보를 가져올 수 없기 때문에 Comment를 사용함 
        .exec( (err, result) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, result })
            })
    })
})

router.post('/getComments', (req, res) => {
    
    Comment.find({ "postId": req.body.videoId })
    .populate('writer')
    .exec( (err, comments) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, comments })
    })
})



module.exports = router;
