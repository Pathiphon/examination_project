import React, { useEffect, useState } from 'react'
import { Box, TextField, Card, CardHeader, Grid, Divider, Button, Chip, Checkbox,Table,TableBody ,TableCell 
, TableContainer,TableHead,TableRow,Paper     } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorMessage from './ErrorMessage';
import Table_Ans from './Table_Ans';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { DataGrid } from '@mui/x-data-grid';

export default function QModal({ active, handleModalQ, token, id, setErrorMessage }) {
    const [errorMessage,] = useState("")
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [score, setScore] = useState("")

    


    return (
        <div className={`modal ${active && "is-active"}`} >
            <div className="modal-background" onClick={handleModalQ}></div>
            <div className="modal-card">
                <header className="modal-card-head has-text-white-ter">
                    <h1 className="modal-card-title has-text-centered">
                        {id ? "แก้ไขโจทย์" : "เพิ่มโจทย์"}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form >
                        <FormControlLabel
                            value="start"
                            control={<Checkbox />}
                            label="ส่งพิจารณาตรวจภายหลังได้"
                            labelPlacement="start"
                        />
                        <Box component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '100%' },
                            }}
                            noValidate
                            autoComplete="off" >
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <QuestionAnswerIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField label="คำถาม" variant="standard" id="margin-none"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <EventAvailableIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField label="เฉลย" variant="standard" id="margin-none"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                />
                                <TextField label="คะแนน" variant="standard" id="margin-none"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ borderRadius: '5px', p: 1 }}
                                >
                                    เพิ่ม <AddCircleIcon sx={{ ml: 0.5 }} />
                                </Button>
                            </Box>
                            <Divider sx={{m:1}}/>
                        </Box>
                        <Table_Ans/>
                    </form>
                </section>

                <footer className="modal-card-foot has-background-primary-light">
                    <ErrorMessage message={errorMessage} />
                    {id ? (
                        <Button className="Button is-info" >
                            แก้ไขโจทย์
                        </Button>
                    ) : (
                        <Button variant="contained" color="success" >
                            สร้างโจทย์
                        </Button>
                    )}
                    <Button variant="outlined" color="error">
                        ยกเลิก
                    </Button>
                </footer>
            </div>
        </div>
    )
}
