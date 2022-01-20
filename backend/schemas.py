import datetime as _dt

import pydantic as _pydantic



class _UserBase(_pydantic.BaseModel):
    email: str
    name:str


class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    T_id: int

    class Config:
        orm_mode = True


class _ExamBase(_pydantic.BaseModel):
    name:str
    date_pre:_dt.datetime
    exam_status:bool
    date_post:_dt.datetime

class ExamCreate(_ExamBase):
    pass


class Exam(_ExamBase):
    exam_id: int
    owner_id: int
    date_created: _dt.datetime
    date_last_updated: _dt.datetime

    class Config:
        orm_mode = True

# ***************************************
class _QuestionBase(_pydantic.BaseModel):
    question:str
    persent_checking :bool

class QuestionCreate(_QuestionBase):
    pass

class Question(_QuestionBase):
    ques_id:int

    class Config:
        orm_mode = True



#******************คำตอบ*********************
# class _Exam_answerBase(_pydantic.BaseModel):
#     answer:str

# class Exam_answerCreate(_Exam_answerBase):
#     pass

# class Exam_answer(_Exam_answerBase):
#     ans_id:int
#     score_id:int

#     class Config:
#         orm_mode=True