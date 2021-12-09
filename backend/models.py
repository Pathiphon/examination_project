import datetime as _dt
import timezone as tz
from sqlalchemy import Table,Column
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import DateTime, Integer,String
import sqlalchemy as _sql
from sqlalchemy.schema import Column
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database


class User(_database.Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String(255))
    firstname = Column(String(255))
    lastname = Column(String(255))


    exam_headings = _orm.relationship("Exam_heading", back_populates="owner")

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)

class Exam_heading(_database.Base):
    __tablename__ = "exam_headings"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    headerName = Column(String(255))
    date_pre = Column(DateTime)
    date_post = Column(DateTime)
    date_created = Column(DateTime, default=tz.date.isoformat(sep = " "))
    date_last_updated = Column(DateTime, default=tz.date.isoformat(sep = " "))

    owner = _orm.relationship("User", back_populates="exam_headings")