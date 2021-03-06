const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');


// ================================================================
//                             Like
// ================================================================


router.post('/getLikes', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  // 영상 좋아요일 경우
        variable = { videoId: req.body.videoId }
    } else {                // 코멘트 좋아요일 경우
        variable = { commentId: req.body.commentId }
    }

    Like.find(variable)
    .exec((err, likes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, likes })
    })
});

router.post('/getDislikes', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  // 영상 싫어요일 경우
        variable = { videoId: req.body.videoId }
    } else {                // 코멘트 싫어요일 경우
        variable = { commentId: req.body.commentId }
    }

    Dislike.find(variable)
    .exec((err, dislikes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, dislikes })
    })
});

router.post('/upLike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {      // 영상 좋아요일 경우
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {                    // 코멘트 좋아요일 경우
        variable = { commentId: req.body.commentId, userId: req.body.userId  }
    }

    // Like collection에 클릭정보를 넣는다.

    const like = new Like(variable)

    like.save((err, likeResult) => {
        if(err) return res.json({ success: false, err })
        
        // 만약 Dislike가 이미 클릭이 되어있다면, Dislike를 1 줄여준다.
        Dislike.findOneAndDelete(variable)
            .exec((err, dislikeResult) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })
})


router.post('/downLike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {      // 영상 좋아요일 경우
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {                    // 코멘트 좋아요일 경우
        variable = { commentId: req.body.commentId, userId: req.body.userId  }
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
})


router.post('/downDislike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {      // 영상 싫어요일 경우
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {                    // 코멘트 싫어요일 경우
        variable = { commentId: req.body.commentId, userId: req.body.userId  }
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
})

router.post('/upDislike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {      // 영상 싫어요일 경우
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {                    // 코멘트 싫어요일 경우
        variable = { commentId: req.body.commentId, userId: req.body.userId  }
    }

    // DisLike collection에 클릭정보를 넣는다.

    const dislike = new Dislike(variable)

    dislike.save((err, dislikeResult) => {
        if(err) return res.json({ success: false, err })
        
        // 만약 like가 이미 클릭이 되어있다면, like를 1 줄여준다.
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })
})




module.exports = router;
