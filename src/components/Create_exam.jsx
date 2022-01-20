import React, { useEffect, useState, useContext } from 'react'
import Manage_exam_full from '../img/manage_exam_full.png'
import { useNavigate,useLocation,useParams } from 'react-router-dom';
import ExamModal from './ExamModal'
import QModal from './QModal';
import { UserContext } from "../context/UserContext"
import dayjs from 'dayjs'
import Table_Ques from './Table_Ques';
import Manage_exam from './Manage_exam';

import Button from '@mui/material/Button';
import { Box, Drawer, TextField, Grid } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import CardMedia from '@mui/material/CardMedia';
import Toolbar from '@mui/material/Toolbar';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArticleIcon from '@mui/icons-material/Article';


export default function Create_exam({data}) {
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalQ,setActiveModalQ] = useState(false)
    const [name, setName] = useState("")
    const [date_pre, setDate_pre] = useState("")
    const [date_post, setDate_post] = useState("")
    const [date_last_updated, setDate_last_updated] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [exam, setExam] = useState(null)
    const [id, setId] = useState(null)
    const [ques_id,setQues_id]= useState(null)
    const [token] = useContext(UserContext)
    
    const location = useLocation();

    
    let navigate = useNavigate();
    

    const handleModal = () => {
        setActiveModal(!activeModal);
        get_Exam()
    }
    const handleModalQ = () =>{
        setActiveModalQ(!activeModalQ)
    }

    const Id_toperent = (id) => {
        setId(id)
    }

    function handleClick() {
        navigate('/')
    }
    useEffect(() => {
        if (id) {
            get_Exam()
        }
        if(location.state!==null){
            setId(location.state.id)
        }
    },[id])
    const get_Exam = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
        const response = await fetch(`/api/exams/${id}`, requestOptions)
        if (!response.ok) {
            setErrorMessage("Could not get the Exam");
        } else {
            const data = await response.json()
            setName(data.name)
            setDate_pre(dayjs(data.date_pre).format('DD/MM/YYYY HH:mm'))
            setDate_post(dayjs(data.date_post).format('DD/MM/YYYY HH:mm'))
            setDate_last_updated(dayjs(data.date_last_updated).format('DD/MM/YYYY HH:mm'))
        }

    }  

    const get_modal_create_exam = ()=>{
        setActiveModalQ(!activeModalQ)
      }

    return (
        <Box className="container">
            <ExamModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                id={id}
                Id_toperent={Id_toperent}
                setErrorMessage={setErrorMessage}
            />
            <QModal
                active={activeModalQ}
                handleModalQ={handleModalQ}
                token={token}
                ques_id={ques_id}
                heading_id={id}
                setErrorMessage={setErrorMessage}  
            />
            <Box>
                <CssBaseline />
                {activeModalQ === false?(
                <AppBar
                    position="fixed"
                    sx={{ width: `calc(100% )` }} style={{ background: 'white'}}
                >
                    <Toolbar >
                        <Button variant="outlined"  size="large" startIcon={<ArrowBackIosIcon />} style={{ fontSize: '18px' }} onClick={handleClick}> จัดการข้อสอบ</Button>
                    </Toolbar>
                </AppBar>
                ):(
                    <AppBar
                    position="fixed"
                    sx={{ width: `calc(100% )` }} style={{ background: 'white',ZIndex:-1}}
                >
                </AppBar>
                )}
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                <Toolbar />
                <Card sx={{ display: "flex", borderRadius: 5 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 150, padding: 1, borderRadius: 5 }}
                        src={Manage_exam_full}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }} flexGrow={1}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" sx={{ display: 'flex' }} variant="h6" className="mb-5" >
                                หัวข้อสอบ : {id ? (name) : (<h6>-</h6>)}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex' }} component="div" className="mb-1">
                                ระยะเวลาทำข้อสอบ : {id ? <>{date_pre}  -  {date_post}</> : (<Typography>-</Typography>)}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ display: 'flex' }} color="text.secondary" component="div">
                                แก้ไขล่าสุดเมื่อ : {id ? (date_last_updated) : (<Typography> - </Typography>)}
                            </Typography>
                        </CardContent>
                    </Box>
                    <Box sx={{ p: 2, flexDirection: "column" }}
                display="flex"
                alignItems="flex-end"
                flexGrow={0}>

                        <Button variant="outlined" color="warning" className="is-fullwidth"
                            startIcon={<EditIcon />} onClick={() => setActiveModal(true)}>
                            แก้ไข
                        </Button>
                    </Box>
                </Card>
            </Box>
            <Box >
                <Divider variant="middle" />

                <Box sx={{ flexGrow: 1, display: 'flex', p: 1 }}  >
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <ArticleIcon sx={{ m: 1 }} />
                        <Typography component="div" variant="p" sx={{ m: 1 }}>
                            จำนวนข้อ :
                        </Typography>
                        <Typography sx={{ bgcolor: '#DDF4E1', 
                        color: 'text.primary', borderRadius: '16px',
                        m: 1, 
                        p: 1 }}>
                            จำนวนข้อ :
                        </Typography>
                        <Typography component="div" variant="h5" sx={{ m: 1 }}>
                            |
                        </Typography>
                        <Button  
                            variant="contained" 
                            size="large" 
                            sx={{borderRadius: '20px'}}
                            onClick={() => setActiveModalQ(true)}
                            >
                            เพิ่มโจทย์ <AddCircleIcon sx={{ ml: 3 }}/>
                        </Button>
                    </Grid>

                </Box>
                <Table_Ques 
                heading_id={id} 
                get_modal_create_exam={get_modal_create_exam}
                />
                
            </Box>
            
        </Box>
    )
}
