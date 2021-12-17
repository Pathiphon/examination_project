import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Divider,
  Button,

} from "@mui/material";
import ErrorMessage from "./ErrorMessage";
import DataUsageIcon from "@mui/icons-material/DataUsage";

export default function AnsModal({
  active,
  ans_id,
  ques_id,
  score,
  answer,
  handleModalAns,
  token,
}) {
  const [answer_sub, setAnswer_sub] = useState(null);
  const [score_sub, setScore_sub] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (active) {
      setAnswer_sub(answer);
      setScore_sub(score);
    }
  }, [active]);

  const handleUpdateAnswer = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        answer: answer_sub,
        score: score_sub,
      }),
    };
    const response = await fetch(
      `/api/exam_questions/${ques_id}/exam_answers/${ans_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong when updating Exam");
    } else {
      handleModalAns();
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalAns}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered">แก้ไขเฉลย</h1>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalAns}
          ></button>
        </header>
        <section className="modal-card-body">
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item>
                <DataUsageIcon
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="คะแนน"
                  type="number"
                  value={score_sub}
                  onChange={(e) => setScore_sub(e.target.value)}
                  required
                  variant="standard"
                  color="warning"
                  focused
                />
              </Grid>
            </Grid>
            <Divider />
            <div>
              <TextField
                label="เฉลย"
                placeholder="MultiLine with rows: 2 and rowsMax: 4"
                value={answer_sub}
                onChange={(e) => setAnswer_sub(e.target.value)}
                multiline
                rows={5}
                defaultValue=""
              />
            </div>
          </Box>
        </section>

        <footer className="modal-card-foot">
          <div>{errorMessage ? <ErrorMessage message={errorMessage} /> : <></>}</div>
          <Button className="Button is-info" onClick={handleUpdateAnswer}>แก้ไข</Button>

          <Button variant="outlined" color="error">
            ยกเลิก
          </Button>
        </footer>
      </div>
    </div>
  );
}
