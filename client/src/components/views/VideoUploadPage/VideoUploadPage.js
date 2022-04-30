import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Typography, Button, Form, message, Input } from 'antd';
import Icon from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Sports" },
]


function VideoUploadPage() {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Privacy, setPrivacy] = useState(0);
    const [Categories, setCategories] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const handleChangeTitle = (event) => {
        setVideoTitle(event.currentTarget.value)
    }

    const handleChangeDescription = (event) => {
        setDescription(event.currentTarget.value)
    }

    const handleChangePrivacy = (event) => {
        setPrivacy(event.currentTarget.value)
    }

    const handleChangeCategory = (event) => {
        setCategories(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        
        event.preventDefault();

        if (user.userData && !user.userData.isAuth) {
            return alert('먼저 로그인해주세요')
        }

        if (VideoTitle === "" || Description === "" ||
            Categories === "" || FilePath === "" ||
            Duration === "" || ThumbnailPath === "") {
            return alert('빈칸을 전부 채워주세요')
        }

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Privacy,
            filePath: FilePath,
            category: Categories,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    message.success('비디오를 성공적으로 업로드했습니다.')

                    setTimeout(() => {
                        navigate('/')
                    }, 3000)
                } else {
                    alert('비디오 업로드에 실패했습니다.')
                }
            })

    }

    const onDrop = (files) => {

        let formData = new FormData();

        // 파일을 보낼 때 오류를 방지하기 위해 content-type을 보내준다.
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log(files)
        formData.append("file", files[0])

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {

                    let variable = {
                        filePath: response.data.filePath,
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    setFilePath(response.data.filePath)

                    //generate thumbnail with this filepath ! 

                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.thumbsFilePath)
                            } else {
                                alert('썸네일 생성을 실패했습니다.');
                            }
                        })


                } else {
                    alert('비디오 업로드를 실패했습니다.')
                }
            })

    }
    return (
        (
            <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Title level={2} > Upload Video</Title>
                </div>
    
                <Form onSubmit={onSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Dropzone
                            onDrop={onDrop}
                            multiple={false}
                            maxSize={800000000}>
                            {({ getRootProps, getInputProps }) => (
                                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <Icon type="plus" style={{ fontSize: '3rem' }} />
    
                                </div>
                            )}
                        </Dropzone>
    
                        {ThumbnailPath !== "" &&
                            <div>
                                <img src={`http://localhost:5000/${ThumbnailPath}`} alt="haha" />
                            </div>
                        }
                    </div>
    
                    <br /><br />
                    <label>Title</label>
                    <Input
                        onChange={handleChangeTitle}
                        value={VideoTitle}
                    />
                    <br /><br />
                    <label>Description</label>
                    <TextArea
                        onChange={handleChangeDescription}
                        value={Description}
                    />
                    <br /><br />
    
                    <select onChange={handleChangePrivacy}>
                        {PrivateOptions.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <br /><br />
    
                    <select onChange={handleChangeCategory}>
                        {CategoryOptions.map((item, index) => (
                            <option key={index} value={item.label}>{item.label}</option>
                        ))}
                    </select>
                    <br /><br />
    
                    <Button type="primary" size="large" onClick={onSubmit}>
                        Submit
                </Button>
    
                </Form>
            </div>
        )
    )
}

export default VideoUploadPage;