const express = require('express');
const router = express.Router();
var ffmpeg = require("fluent-ffmpeg");
const multer = require('multer');

const { auth } = require('../middleware/auth');
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('mp4 형식만 가능합니다.'), false);
        }
        cb(null, true);
    }
});

const upload = multer({ storage: storage }).single("file");

// ================================================================
//                             Video
// ================================================================

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err: err });
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
    })
})

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보들을 저장한다.

    const video = new Video(req.body);

    video.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.

        Video.find()
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
})

router.post("/getVideoDetail", (req, res) => {
    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer')
        .exec((err, VideoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, VideoDetail })
        })
})

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임도 가져오기
    let thumbsFilePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.filePath)
    .on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '));
        thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    
    .on('end', function() {
        console.log('스크린샷이 찍혔습니다.');
        return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration });
    })
    .on('error', function(err) {
        console.error(err);
        return res.json({ success: false, err });
    })
    .screenshots({
        // 비디오의 20%, 40%, 60%, 80% 스크린샷이 찍힘
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        // '%b' : input basename (filename w/o extension)
        filename: 'thumbnail-%b.png'
    })
})

router.post("getSubscriptionVideos", (req, res) => {

    // 자신의 아이디로 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if(err) return res.status(400).send(err);

            let subscribeUser = [];

            subscriberInfo.map((subscriber, index) => {
                subscribeUser.push(subscriber.userTo)
            })
        })


    // 찾은 사람들의 비디오를 가지고 온다.

    Video.find({ writer : { $in: subscribeUser }})      // $in : subscribeUser 배열 안에 속하는 값을 찾는 기능
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videos })
        })

})

module.exports = router;
