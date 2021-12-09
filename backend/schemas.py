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