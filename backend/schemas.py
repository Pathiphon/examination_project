import datetime as _dt

import pydantic as _pydantic



class _UserBase(_pydantic.BaseModel):
    email: str
    firstname:str
    lastname:str


class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int

    class Config:
        orm_mode = True


class _Exam_headingBase(_pydantic.BaseModel):
    headerName:str
    date_pre:_dt.datetime
    date_post:_dt.datetime

class Exam_headingCreate(_Exam_headingBase):
    pass


class Exam_heading(_Exam_headingBase):
    id: int
    owner_id: int
    date_created: _dt.datetime
    date_last_updated: _dt.datetime

    class Config:
        orm_mode = True

# ***************************************
class _Exam_questionBase(_pydantic.BaseModel):
    question:str
    consider_bool :bool

class Exam_questionCreate(_Exam_questionBase):
    pass

class Exam_question(_Exam_questionBase):
    ques_id:int
    heading_id:int

    class Config:
        orm_mode = True

#******************คำตอบ*********************
class _Exam_answerBase(_pydantic.BaseModel):
    answer:str
    score:int

class Exam_answerCreate(_Exam_answerBase):
    pass

class Exam_answer(_Exam_answerBase):
    ans_id:int
    ques_id:int
    score:int

    class Config:
        orm_mode = True