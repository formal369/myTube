import React, { useEffect, useState } from 'react';
import { Tooltip } from "antd";
import {LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import Axios from 'axios';

const LikeDislike = (props) => {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);
    
    let variable = { }

    if(props.video) {   // 비디오 Like인 경우
        variable = { videoId: props.videoId, userId: props.userId }
    } else {            // 댓글 Like인 경우
        variable = { commentId: props.commentId , userId: props.userId }
    }


    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
        .catch(response => {
            if(response.data.success) {
                // 얼마나 많은 Like를 받았는지
                setLikes(response.data.likes.length)

                // 내가 이미 Like를 눌렀는지
                response.data.likes.map(like => {
                    if(like.userId === props.userId) {      // LocalStorage의 userId와 같은 userId가 있다면
                        setLikeAction('liked')
                    }
                })

            } else {
                alert('Like 정보를 가져오는데 실패했습니다.')
            }
        })

        Axios.post('/api/like/getDislikes', variable)
        .catch(response => {
            if(response.data.success) {
                // 얼마나 많은 Dislike를 받았는지
                setDislikes(response.data.dislikes.length)

                // 내가 이미 Dislike를 눌렀는지
                response.data.dislikes.map(dislike => {
                    if(dislike.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })

            } else {
                alert('Dislike 정보를 가져오는데 실패했습니다.')
            }
        })
    }, [])

    const onLike = () => {
        if(LikeAction === null) {       // 'Like'가 클릭되어 있지 않을 때
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success) {

                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if(DislikeAction !== null) {    // 'Dislike'가 클릭이 되어있을 때
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }

                    } else {
                        alert('Like 올리기를 실패했습니다.')
                    }
                })
        } else {
            Axios.post('/api/like/downLike', variable)
            .then(response => {
                if(response.data.success) {

                    setLikes(Likes - 1)
                    setLikeAction(null)
                
                } else {
                    alert('Like 내리기를 실패했습니다.')
                }
            })
        }
    }

    const onDislike = () => {

        if(DislikeAction !== null) {    // 'Dislike'가 클릭이 되어있을 때
            Axios.post('/api/like/downDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    } else {
                        alert('Dislike 내리기를 실패했습니다.')
                    }
                })
        } else {
            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null) {    // 'Like'가 클릭이 되어있을 때
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }

                } else {
                    alert('Dislike 내리기를 실패했습니다.')
                }
            })
        }

    }


    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <LikeOutlined 
                        type="like" 
                        theme={LikeAction === 'liked'? 'filled' : 'outlined'} 
                        onClick={onLike} 
                        />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <DislikeOutlined 
                        type="dislike" 
                        theme={DislikeAction === "disliked"? 'filled' : 'outlined'}
                        onClick={onDislike} 
                        />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    );
};

export default LikeDislike;