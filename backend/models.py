import datetime as _dt

from pydantic import BaseModel
from typing import List, Optional

import timezone as tz
from sqlalchemy import Column,Table
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import  Float,Boolean, DateTime, Integer,String,Text
import sqlalchemy as _sql
from sqlalchemy.schema import Column
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database


class User(_database.Base):
    __tablename__ = "teacher"
    T_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(64), unique=True, index=True)
    hashed_password = Column(String(255))
    name = Column(String(100))


    exam = _orm.relationship("Exam", back_populates="owner")

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)

class Exam(_database.Base):
    __tablename__ = "exam"
    exam_id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey('teacher.T_id'))
    name = Column(String(255))
    exam_status = Column(Boolean)
    date_pre = Column(DateTime)
    date_post = Column(DateTime)
    date_created = Column(DateTime, default=tz.date.isoformat(sep = " "))
    date_last_updated = Column(DateTime, default=tz.date.isoformat(sep = " "))

    owner = _orm.relationship("User", back_populates="exam")
    question = _orm.relationship("Question",secondary="exam_question",back_populates='exam')

class Question(_database.Base):
    __tablename__="question"
    ques_id = Column(Integer,primary_key=True,index=True)
    question = Column(String(255))
    persent_checking = Column(Float(5))
    exam = _orm.relationship("Exam",secondary="exam_question",back_populates='question')
    

    # exam_headings = _orm.relationship("Exam_heading", back_populates="exam_questions")

Exam_question = Table('exam_question',_database.Base.metadata,
    Column('exam_id',ForeignKey("exam.exam_id"),primary_key=True),
    Column('ques_id',ForeignKey("question.ques_id"),primary_key=True)

)
# class Exam_Question(_database.Base):
#     __tablename__ = "exam_question"
#     id2 = Column(Integer, primary_key=True, index=True)
#     exam_id = Column(Integer, ForeignKey('exam.exam_id'))
#     ques_id = Column(Integer, ForeignKey('question.ques_id'))
#     score_full = Column(Float(5))



# class Exam_Answer(_database.Base):
#     __tablename__="answers"
#     ans_id = Column(Integer,primary_key=True,index=True)
#     score_id = Column(Integer,ForeignKey('score.score_id'))
#     answer = Column(Text)
    

    