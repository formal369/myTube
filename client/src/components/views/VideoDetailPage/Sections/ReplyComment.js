import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

const ReplyComment = (props) => {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);


    useEffect(() => {

        let commentNumber = 0;  // 대댓글 갯수

        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber)

    }, [props.commentLists])    // commentLists에 변동이 있을 때마다 재실행


    // 대댓글을 렌더링해주는 함수
    const renderReplyComment = (parentCommentId) => 

        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&       
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} postId={props.videoId} parentCommentId={comment._id} />
                    </div>
                }
            </React.Fragment>
        ))

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>

            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange} >
                    View {ChildCommentNumber} more comment(s)
                </p>
            
            }

            {OpenReplyComments &&            
                renderReplyComment(props.parentCommentId)
            }
        </div>
    );
};

export default ReplyComment;