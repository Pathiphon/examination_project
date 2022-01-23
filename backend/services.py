import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
from sqlalchemy.sql.operators import asc_op
import uvicorn
from sqlalchemy import desc,asc
import datetime as _dt
import timezone as tz
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database, models as _models, schemas as _schemas

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"

_database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        email=user.email,name=user.name, hashed_password=_hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

if __name__ == "__main__":
    uvicorn.run(_fastapi(), host="127.0.0.1", port=8081)

async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)

    token = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["T_id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return _schemas.User.from_orm(user)


# ********************************แบบทดสอบ*****************************************

async def create_exam(user: _schemas.User, db: _orm.Session, exam: _schemas.ExamCreate):
    exam = _models.Exam(**exam.dict(), owner_id=user.T_id)
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return _schemas.Exam.from_orm(exam)


async def get_exams(user: _schemas.User, db: _orm.Session):
    exams = db.query(_models.Exam).filter_by(owner_id=user.T_id)

    return list(map(_schemas.Exam.from_orm, exams))


async def _exam_selector(exam_id: int, user: _schemas.User, db: _orm.Session):
    exam = (
        db.query(_models.Exam)
        .filter_by(owner_id=user.T_id)
        .filter(_models.Exam.exam_id == exam_id)
        .first()
    )

    if exam is None:
        raise _fastapi.HTTPException(status_code=404, detail="Exam does not exist")

    return exam


async def get_exam(exam_id: int, user: _schemas.User, db: _orm.Session):
    exam = await _exam_selector(exam_id=exam_id, user=user, db=db)

    return _schemas.Exam.from_orm(exam)


async def delete_exam(exam_id: int, user: _schemas.User, db: _orm.Session):
    exam = await _exam_selector(exam_id, user, db)

    db.delete(exam)
    db.commit()

async def update_exam(exam_id: int, exam: _schemas.ExamCreate, user: _schemas.User, db: _orm.Session):
    exam_db = await _exam_selector(exam_id, user, db)

    exam_db.name = exam.name
    exam_db.exam_status=exam.exam_status
    exam_db.date_pre = exam.date_pre
    exam_db.date_post = exam.date_post
    exam_db.date_last_updated = tz.date.isoformat(sep = " ")

    db.commit()
    db.refresh(exam_db)

    return _schemas.Exam.from_orm(exam_db)

# *************************ข้อสอบ**********************************************

async def create_question( db: _orm.Session, question: _schemas.QuestionCreate):
    question = _models.Question(
        question=question.question,persent_checking=question.persent_checking
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return _schemas.Question.from_orm(question)

async def get_questions(exam:id, db: _orm.Session):
    questions = db.query(_models.Question).filter_by(exam_id=exam)

    return list(map(_schemas.Question.from_orm, questions))

async def _question_selector(question_id: int, exam: id, db: _orm.Session):
    question = (
        db.query(_models.Question)
        .filter_by(exam_id=exam)
        .filter(_models.Question.ques_id == question_id)
        .first()
    )

    if question is None:
        raise _fastapi.HTTPException(status_code=404, detail="question does not exist")

    return question

async def get_question(question_id: int, exam: id, db: _orm.Session):
    question = await _question_selector(question_id=question_id, exam=exam, db=db)

    return _schemas.Question.from_orm(question)

async def delete_question(question_id:int,exam:_schemas.Exam,db: _orm.Session):
    question = await _question_selector(question_id,exam,db)

    db.delete(question)
    db.commit()

async def update_question(question_id:int , question:_schemas.QuestionCreate,exam:_schemas.Exam,db:_orm.Session):
    question_db = await _question_selector(question_id,exam,db)

    question_db.question = question.question
    question_db.persent_checking = question.persent_checking

    db.commit()
    db.refresh(question_db)

    return _schemas.Question.from_orm(question_db)

