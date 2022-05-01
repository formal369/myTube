import React, { useEffect, useState } from 'react';
import { Tooltip } from "antd";
import {LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import Axios from 'axios';

const LikeDislike = (props) => {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);
    
    let variable = {

    }

    if(props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
        variable = { commentId: props.commentId , userId: props.userId }
    }


    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
        .catch(response => {
            if(response.data.success) {
                // 얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)

                // 내가 이미 좋아요를 눌렀는지
                response.data.likes.map(like => {
                    if(like.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })

            } else {
                alert('좋아요 정보를 가져오는데 실패했습니다.')
            }
        })

        Axios.post('/api/like/getDislikes', variable)
        .catch(response => {
            if(response.data.success) {
                // 얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length)

                // 내가 이미 싫어요를 눌렀는지
                response.data.dislikes.map(dislike => {
                    if(dislike.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })

            } else {
                alert('싫어요 정보를 가져오는데 실패했습니다.')
            }
        })
    }, [])

    const onLike = () => {
        if(LikeAction === null) {
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success) {

                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if(DislikeAction !== null) {    // '싫어요'가 클릭이 되어있을 때
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }

                    } else {
                        alert('좋아요 올리기를 실패했습니다.')
                    }
                })
        } else {
            Axios.post('/api/like/downLike', variable)
            .then(response => {
                if(response.data.success) {

                    setLikes(Likes - 1)
                    setLikeAction(null)
                
                } else {
                    alert('좋아요 내리기를 실패했습니다.')
                }
            })
        }
    }

    const onDislike = () => {

        if(DislikeAction !== null) {    // '싫어요'가 클릭이 되어있을 때
            Axios.post('/api/like/downDislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    } else {
                        alert('싫어요 내리기를 실패했습니다.ㄹ')
                    }
                })
        } else {
            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null) {    // '좋아요'가 클릭이 되어있을 때
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }

                } else {
                    alert('싫어요 내리기를 실패했습니다.ㄹ')
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