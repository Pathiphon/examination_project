import datetime as _dt
from typing import Optional,List

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
    # name:str
    # date_pre:_dt.datetime
    # exam_status:bool
    # date_post:_dt.datetime
    name:Optional[str]=None
    exam_status:Optional[bool]=None
    date_pre:Optional[_dt.datetime]=None
    date_post:Optional[_dt.datetime]=None


class ExamCreate(_ExamBase):
    name:str
    exam_status:bool
    date_pre:_dt.datetime
    date_post:_dt.datetime
    
class ExamUpdate(_ExamBase):
    pass


class Exam(_ExamBase):
    exam_id: int
    owner_id: int
    date_created: _dt.datetime
    date_last_updated: _dt.datetime


    class Config:
        orm_mode = True




# ****************คำถาม***********************
class _QuestionBase(_pydantic.BaseModel):
    question:str
    persent_checking :float

class QuestionCreate(_QuestionBase):
    pass

class Question(_QuestionBase):
    ques_id:int
    

    class Config:
        orm_mode = True

# ************คำถามของแบบทดสอบ*************
class ExamSchema(Exam):
    question:List[Question]

class QuestionSchema(Question):
    exam:List[Exam]
# class _Exam_questionBase(_pydantic.BaseModel):
#     score_full:float

# class Exam_questionCreate(_Exam_questionBase):
#     pass

# class Exam_question(_Exam_questionBase):
#     id2:int
#     ques_id:int
#     exam_id:int

#     class Config:
#         orm_mode = True


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