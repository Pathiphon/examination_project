import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog ,
  DialogActions ,DialogContent ,DialogContentText ,DialogTitle ,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AnsModal from "./AnsModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Table_Ans({ ques_id, token }) {
  const [activeModalAns, setActiveModalAns] = useState(false);
  const [all_score, setall_score] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(null);
  const [score_id,setScore_id] =useState(null)
  const [ans_id, setAns_id] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleModalAns = () => {
    get_Answer();
    setActiveModalAns(!activeModalAns);
    setAns_id(null);
    setScore(null);
    setAnswer(null);
  };
  const handleClickAns = (score_id) => {
    setScore_id(score_id)
    setActiveModalAns(true);
  };

  const get_Answer = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/exam_questions/${ques_id}/exam_score`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Answer");
    } else {
      const data = await response.json();
      setall_score(data);
    }
  };

  useEffect(() => {
    if (ques_id) {
      get_Answer();
    }
  }, [ques_id]);

  const handleDeleteAns = async (ans_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/exam_questions/${ques_id}/exam_scores/${ans_id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Failed to delete Answer");
    }
    console.log(ans_id);
    handleClose()
    get_Answer();
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen =async (id,answer) => {
    setAns_id(id)
    setAnswer(answer)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAns_id(null)
    setAnswer(null)
  };

  return (
    <>
      <AnsModal
        active={activeModalAns}
        handleModalAns={handleModalAns}
        score_id={score_id}
        ques_id={ques_id}
        token={token}
      />
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
            {all_score ? (
              <>
                {all_score.map((scores) => (
                  <TableRow
                    key={scores.score_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography
                        sx={{
                          textOverflow: "ellipsis",
                          width: "15rem",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{scores.score}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() =>
                          handleClickAns(
                            scores.score_id
                          )
                        }
                      >
                        แก้ไข
                      </Button>
                      <Button
                        sx={{ ml: 1 }}
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteForeverIcon />}
                        onClick={()=>handleClickOpen(scores.score_id,scores.score)}
                      >
                        ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <></>
            )}
          </TableBody>
          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"ยืนยันการลบ"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {answer}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={()=>handleDeleteAns(ans_id)} autoFocus>
           ลบ
          </Button>
        </DialogActions>
      </Dialog>
        </Table>
      </TableContainer>
    </>
  );
}
