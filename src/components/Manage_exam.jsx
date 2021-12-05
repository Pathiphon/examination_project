import React, { useEffect, useState } from "react"
import moment from "moment"

import ErrorMessage from "./ErrorMessage"
import {UserContext} from "../context/UserContext"

const Manage_exam = ()=>{
    const [token] = useContext(UserContext)
    const [exam_heading,setExam_heading] = useState(null)
    const [errorMessage,setErrorMessage] = useState("")
    const [ loaded,setLoaded]=useState(false)
    const [ activeModal,setActiveModal]= useState(false)
    coonst[id,setId] = useState(null)

    const getExam_heading = async()=>{
        const requestOptions = {
            method:"GET",
            headers:{"Content-Type":"application/json"},
            Authorization:"Bearer"+token,
        },
    }
    const response = await fetch("/api/exam_heading",requestOptions)

    if(!response.ok){
        setErrorMessage("Something went wrong. Couldn't load the Exam_heading")
    }else{
        const data = await response.json()
        setExam_heading(data)
        setLoaded(true)
    }
    useEffect(()=>{
        getExam_heading()
    },[])

    return(
        <>
        
        </>
    )
}