import React, { useEffect, useState } from "react";
import AnsModal from "./AnsModal";
import {
  Box,
  TextField,
  Card,
  CardHeader,
  Grid,
  Divider,
  Button,
  Chip,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ErrorMessage from "./ErrorMessage";
import Table_Ans from "./Table_Ans";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function QModal({
  active,
  handleModalQ,
  token,
  heading_id,
  ques_id,
  setErrorMessage,
}) {
  const [activeModalAns, setActiveModalAns] = useState(false);
  const [errorMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState("");
  const [consider, setConsider] = useState(true);

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        question: question,
        consider_bool: consider,
      }),
    };
    const response = await fetch(
      `/api/exam_headings/${heading_id}/exam_question`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("มีข้อผิดพลาดในการเพิ่มข้อมูล");
    } else {
      handleModalQ();
    }
  };

  const handleCreateAnswer = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        answer: answer,
        score: score,
      }),
    };
    const response = await fetch(
      `/api/exam_questions/${ques_id}/exam_answer`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("มีข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  useEffect(() => {
    if (ques_id && heading_id) {
      get_Question();
    }
  }, [ques_id, heading_id]);

  const get_Question = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/exam_headings/${heading_id}/exam_questions/${ques_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Exam");
    } else {
      const data = await response.json();
      setConsider(data.consider_bool);
      setQuestion(data.question);
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        question: question,
        consider_bool: consider,
      }),
    };
    const response = await fetch(
      `/api/exam_headings/${heading_id}/exam_questions/${ques_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong when updating Exam");
    } else {
      handleModalQ();
    }
  };

  const handleModalAns = () => {
    setActiveModalAns(!activeModalAns);
  }
  const handleClickAns = () => {
    setActiveModalAns(true);
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalQ}></div>
      <div className="modal-card">
      <AnsModal
        active={activeModalAns}
        handleModalAns={handleModalAns}
        token={token}
      />
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered">
            {ques_id ? "แก้ไขโจทย์" : "เพิ่มโจทย์"}
          </h1>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalQ}
          ></button>
        </header>
        <section className="modal-card-body">
          <FormControlLabel
            value="start"
            control={
              <Checkbox
                checked={consider}
                onClick={() => setConsider(!consider)}
              />
            }
            label="ส่งพิจารณาตรวจภายหลังได้"
            labelPlacement="start"
          />
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <QuestionAnswerIcon
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                label="คำถาม"
                variant="standard"
                id="margin-none"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </Box>
            {ques_id ? (
              <Box sx={{ width: "100%",mt:2 }} container display="flex"
              justifyContent="center"
              alignItems="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ width: "75%" }}
                  startIcon={<AddCircleIcon />}
                  onClick={() =>
                    handleClickAns()}
                >
                  เพิ่มเฉลย
                </Button>
              </Box>
            ) : (
              <></>
            )}
            <Divider sx={{ m: 1 }} />
          </Box>
          {ques_id ? <Table_Ans ques_id={ques_id} token={token} /> : <></>}
        </section>

        <footer className="modal-card-foot">
          {ques_id ? (
            <Button className="Button is-info" onClick={handleUpdateQuestion}>
              แก้ไขโจทย์
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleCreateQuestion}
              color="success"
            >
              สร้างโจทย์
            </Button>
          )}
          <Button variant="outlined" color="error">
            ยกเลิก
          </Button>
        </footer>
      </div>
    </div>
  );
}
