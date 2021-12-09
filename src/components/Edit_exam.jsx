import React, { useContext, useEffect, useState } from 'react'
import moment from "moment"
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage"
import { UserContext } from "../context/UserContext"
import Manage_exam_full from '../img/manage_exam_full.png'
import ExamModal from './ExamModal';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import CardMedia from '@mui/material/CardMedia';
import Toolbar from '@mui/material/Toolbar';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';


export default function Edit_exam({token,id}) {
    const [errorMessage, setErrorMessage] = useState("");
    const [exam, setExam] = useState(null)

    const [activeModal, setActiveModal] = useState(false);
    const [headerName, setHeaderName] = useState("")
    const [date_pre, setDate_pre] = useState("")
    const [date_post, setDate_post] = useState("")
    const [date_last_updated, setDate_last_updated] = useState("")

    useEffect(()=>{
        const get_Exam = async()=>{
            const requestOptions = {
                method:"GET",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
            const response = await fetch(`/api/exam_headings/${id}`,requestOptions)
            if(!response.ok){
                setErrorMessage("Could not get the Exam");
            }else{
                const data = await response.json()
                setHeaderName(data.headerName)
                setDate_pre(data.date_pre)
                setDate_post(data.date_post)
                setDate_last_updated(data.date_last_updated)
            }
        }
        if(id){
            get_Exam()
        }

    },[id,token])

    const get_Exam = async () => {
        const requestOptions = {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },            
        };
        const response = await fetch("/api/exam_heading", requestOptions)
        if (!response.ok) {
            alert("Something went wrong.Couldn't load the Exam")
        } else {
            const data = await response.json()
            setExam(data)
        }
    };
    useEffect(() => {
        get_Exam()
    }, [])


    const handleModal = ()=>{
        setActiveModal(!activeModal);
        get_Exam()
    }


    return (
        <div>
            <ExamModal 
                    active={activeModal}
                    handleModal={handleModal}
                    token={token} 
                    id={id}
                    setErrorMessage={setErrorMessage}
                    />
            <Card sx={{ display: 'flex', borderRadius: 5 }}>
                <CardMedia
                    component="img"
                    sx={{ width: 151, padding: 1 }}
                    src={Manage_exam_full}

                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h6" className="mb-3">
                            หัวข้อสอบ : {id ? (headerName):(<p>-</p>)}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" className="mb-1">
                            ระยะเวลาทำข้อสอบ : {id ? (date_pre)+"  -  "+(date_post):(<p>-</p>)}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            แก้ไขล่าสุดเมื่อ : {id ? (date_last_updated):(<p>-</p>)}
                        </Typography>
                    </CardContent>
                </Box>
                <Box sx={{  flexDirection: 'column' }} justifyContent="flex-end">
                    
                <Button  variant="outlined" color="warning"  className="is-fullwidth"
                startIcon={<EditIcon />} onClick={() => setActiveModal(true)}>
                    แก้ไข
                </Button>
                </Box>
            </Card>
        </div>
    )
}
