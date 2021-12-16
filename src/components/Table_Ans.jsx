import React, { useEffect, useState } from 'react'
import { Box, TextField, Card, CardHeader, Grid, Divider, Button, Chip, Checkbox,Table,TableBody ,TableCell 
    , TableContainer,TableHead,TableRow, Typography   } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

    
export default function Table_Ans({ques_id,token}) {
  const [all_answer,setAll_answer] = useState(null)
  const [ans_id,setAns_id]=useState(null)
  const [errorMessage,setErrorMessage] = useState(null)


  const get_Answer = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/exam_questions/${ques_id}/exam_answer`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Answer");
    } else {
      const data = await response.json();
      setAll_answer(data);
    }
  }
  useEffect(() => {
    if(ques_id){
        get_Answer();
    }
  },[ques_id]);

  const handleModalAns = async (id) =>{
    setAns_id(id)
    get_Answer()
    // get_modal_create_exam(!activeModalQ)
    // setActiveModalQ(!activeModalQ);
}

    return (
      <TableContainer>
        <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>เฉลย</TableCell>
            <TableCell align="center">คะแนน</TableCell>
            <TableCell align="center">การจัดการ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {all_answer?(
            <>
          {all_answer.map((answers) => (
            <TableRow
              key={answers.ans_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" >
                <Typography sx={{textOverflow:'ellipsis',width:'15rem',overflow:'hidden',whiteSpace:'nowrap'}}>
                {answers.answer}
                </Typography>
              </TableCell>
              <TableCell align="center">{answers.score}</TableCell>
              <TableCell align="center">
              <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<EditIcon />} onClick={() => handleModalAns(answers.ques_id)}
                  >
                    แก้ไข
                  </Button>
                  <Button sx={{ml:1}}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForeverIcon />}
                  >
                    ลบ
                  </Button>
                </TableCell>
              
            </TableRow>
            
          ))}
          </>
          ):(<></>)}
        </TableBody>
      </Table>
      </TableContainer>
    )
}
