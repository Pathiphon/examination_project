import React, { useContext, useEffect, useState } from 'react'
import moment from "moment"

import ErrorMessage from "./ErrorMessage"
import { UserContext } from "../context/UserContext"
import Edit_exam from './Edit_exam'

import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';

export default function Manage_exam() {
    const [token] = useContext(UserContext)
    const [exam, setExam] = useState(null)
    const [erroorMessage, setErrorMessage] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [page_op,setPage_op] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const [id, setId] = useState(null)

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
            setErrorMessage("Something went wrong.Couldn't load the Exam")
        } else {
            const data = await response.json()
            setExam(data)
            setLoaded(true)
        }
    };
    useEffect(() => {
        get_Exam()
    }, [])

    const handleUpdate = async (id) => {
        setId(id);
        setPage_op(true)
      };

    return (
        <div>
            {!page_op ?(
                <>
            {/* <Button variant="contained" color="success" type="submit" className="w-50 mx-auto mb-2" 
            onClick={()=>setActiveModal(true)}>
                บันทึก
                </Button>
            <ErrorMessage message={erroorMessage} /> */}
            {loaded && exam ? (
                <table className="table">
                    <thead>
                        <th>หัวข้อสอบ</th>
                        <th>จำนวนข้อ</th>
                        <th>เวลาเริ่มสอบ</th>
                        <th>เวลาหมดสอบ</th>
                        <th>แก้ไขล่าสุด</th>
                    </thead>
                    <tbody>
                        {exam.map((exams) => (
                            <tr key={exams.id}>
                                <td>{exams.headerName}</td>
                                <td>10</td>
                                <td>{exams.date_pre}</td>
                                <td>{exams.date_post}</td>
                                <td>{moment(exams.date_last_updated).format('L,LT')}</td>
                                <td>
                                    <Button variant="outlined" color="warning" startIcon={<EditIcon />}onClick={() => handleUpdate(exams.id)}>
                                        แก้ไข
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="outlined" startIcon={<ShareIcon />}>
                                        ส่งลิงค์ข้อสอบ
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading</p>
            )}
            </>
            ):(
                <Edit_exam id={id} token={token} page_op={page_op}/>
            )}
            
        </div>

    )
}
