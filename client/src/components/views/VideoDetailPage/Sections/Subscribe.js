import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Subscribe = (props) => {
    const userTo = props.userTo
    const userFrom = props.userFrom

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    
    
    const onSubscribe = () => {

        let subscribeVariables  = { 
            userTo: userTo,
            userFrom: userFrom
            }

        // 이미 구독 중이라면
        if(Subscribed) {

            axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then((response) => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소하는데 실패했습니다.')
                    }
                })

        // 아직 구독 중이 아니라면    
        } else {

            axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then((response) => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독하는데 실패했습니다.')
                    }
                })
        }
        
    }

    useEffect(() => {

        let subscribeNumberVariables  = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables )
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('구독자 수 정보를 받아오는데 실패했습니다.')
                }
            })

        

        axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if(response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('구독여부 정보를 받아오는데 실패했습니다.')
                }
            })
        }, [])
    
    return (
        <div>
            <button 
            onClick={onSubscribe}
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}>
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    );
};

export default Subscribe;