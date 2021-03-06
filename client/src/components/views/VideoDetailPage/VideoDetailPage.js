import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislike from './Sections/LikeDislike';

const VideoDetailPage = (props) => {

    const { videoId } = useParams();
    const [VideoDetail, setVideoDetail] = useState({});
    const [Comments, setComments] = useState([]);
    
    const variable = { videoId: videoId }

    useEffect(() => {
        // 비디오 정보를 가져오기
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.VideoDetail)
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })

        // 코멘트 정보를 가져오기
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success) {
                    setComments(response.data.comments)
                    console.log("코멘트정보: " + Comments);
                } else {
                    alert('코멘트 정보를 가져오는데 실패했습니다.')
                }
            })
    }, [])

    // 하위 컴포넌트의 코멘트를 상위 컴포넌트의 코멘트와 병합하는 함수 (댓글과 대댓글을 달 때마다 상위 컴포넌트에 업데이트를 해줘야 됨)
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }


    if(VideoDetail.writer) {       // * image 정보를 가져오는 중에 발생하는 undefined 에러 처리
        // 자신의 영상은 구독할 수 없게 처리
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />;

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions={[ <LikeDislike video userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}      // * image 정보를 가져오기 전에 화면이 렌더링이 되버려서 이미지가 undefined가 됨
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
    
                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        );
    } else {
        return (
            <div>Loading...</div>
        )
    }
};

export default VideoDetailPage;