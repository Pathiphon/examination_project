import React, { useEffect, useState, useContext } from 'react'
import Manage_exam_full from '../img/manage_exam_full.png'
import { useNavigate } from 'react-router-dom';
import ExamModal from './ExamModal'
import { UserContext } from "../context/UserContext"
import dayjs from 'dayjs'

import Button from '@mui/material/Button';
import { Box, Drawer, TextField } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import CardMedia from '@mui/material/CardMedia';
import Toolbar from '@mui/material/Toolbar';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FaceIcon from '@mui/icons-material/Face';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import DescriptionIcon from '@mui/icons-material/Description';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Create_exam() {
    const [activeModal, setActiveModal] = useState(false);
    const [headerName, setHeaderName] = useState("")
    const [date_pre, setDate_pre] = useState("")
    const [date_post, setDate_post] = useState("")
    const [date_last_updated, setDate_last_updated] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [exam, setExam] = useState(null)
    const [id, setId] = useState(null)
    const [token] = useContext(UserContext)

    let navigate = useNavigate();

    const handleModal = () => {
        setActiveModal(!activeModal);
        get_Exam()
    }

    const Id_toperent = (id) => {
        setId(id)
    }

    function handleClick() {
        navigate('/Manage_exam')
    }
    useEffect(() => {
        if (id) {
            get_Exam()
        }
        console.log(id);
    })
    const get_Exam = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
        const response = await fetch(`/api/exam_headings/${id}`, requestOptions)
        if (!response.ok) {
            setErrorMessage("Could not get the Exam");
        } else {
            const data = await response.json()
            setHeaderName(data.headerName)
            setDate_pre(data.date_pre)
            setDate_post(data.date_post)
            setDate_last_updated(data.date_last_updated)
        }

    }

    return (
        <Box>
        
            <ExamModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                id={id}
                Id_toperent={Id_toperent}
                setErrorMessage={setErrorMessage}
            />
            <Box>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{ width: `calc(100% )` }} style={{ background: 'white' }}
                >
                    <Toolbar >
                        <Button variant="text" size="large" startIcon={<ArrowBackIosIcon />} onClick={handleClick}> จัดการข้อสอบ</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 2 }}>
                <Toolbar />
                <Card sx={{ display: "flex", borderRadius: 5 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 200, padding: 1, borderRadius: 5 }}
                        src={Manage_exam_full}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h6" className="mb-3" >
                                หัวข้อสอบ : {id ? (headerName) : (<Typography>-</Typography>)}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div" className="mb-1">
                                ระยะเวลาทำข้อสอบ : {id ? (dayjs(date_pre).format('DD/MM/YYYY HH:MM')) + "  -  " + (dayjs(date_post).format('DD-MM-YYYY HH:MM')) : (<p>-</p>)}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                แก้ไขล่าสุดเมื่อ : {id ? (date_last_updated) : (<p>-</p>)}
                            </Typography>
                        </CardContent>
                    </Box>
                    <Box sx={{ flexDirection: 'column' }} justifyContent="flex-end">

                        <Button variant="outlined" color="warning" className="is-fullwidth"
                            startIcon={<EditIcon />} onClick={() => setActiveModal(true)}>
                            แก้ไข
                        </Button>
                    </Box>
                </Card>
            </Box>

        </Box>
    )
}