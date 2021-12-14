import { Card } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import QModal from "./QModal";

import {
  Divider,
  Chip,
  Box,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Table_Ques({ heading_id,get_modal_create_exam }) {
  const [All_question, setAll_question] = useState(null);
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState("");
  const [ques_id,setQues_id]=useState(null)
  const [activeModalQ,setActiveModalQ] = useState(false)
  const [token] = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState("");

  const get_Question = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/exam_headings/${heading_id}/exam_question`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Exam");
    } else {
      const data = await response.json();
      setAll_question(data);
    }
  };

  useEffect(() => {
    if(heading_id){
        get_Question();
    }
  });

  const handleModalQ = async (id) =>{
    setQues_id(id)
    get_Question()
    get_modal_create_exam(!activeModalQ)
    setActiveModalQ(!activeModalQ);
}



  return (
    <div>
      <QModal
                active={activeModalQ}
                handleModalQ={handleModalQ}
                token={token}
                ques_id={ques_id}
                heading_id={heading_id}
                setErrorMessage={setErrorMessage}  
            />
      {All_question  ? (
        <div>
          {All_question.map((All_questions) => (
            <Grid item sx={{mb:2 }} key={All_questions.ques_id}>
              <Card sx={{ display: "flex", borderRadius: 3,padding:1 }} >
                <Grid
                  justify="space-between" sx={{ml:2}}
                  container
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography component="div" variant="h5">
                        คำถาม : {All_questions.question}
                      </Typography>
                      <Divider sx={{ m: 1 }} />
                      <Typography variant="subtitle1" component="div">
                        จำนวนเฉลย
                      </Typography>
                    </CardContent>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{display:'flex'}}>
                    <Button
                    
                      variant="outlined"
                      color="warning"
                      startIcon={<EditIcon />} onClick={() => handleModalQ(All_questions.ques_id)}
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
                  </Box>
                </Grid>
              </Card>
            </Grid>
          ))}
        </div>
      ) : (
        <Divider sx={{ mt: 10 }}>ทำการสร้างโจทย์ใหม่</Divider>
      )}
    </div>
  );
}
