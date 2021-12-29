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
        email=user.email,firstname=user.firstname,lastname=user.lastname, hashed_password=_hash.bcrypt.hash(user.hashed_password)
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
        user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return _schemas.User.from_orm(user)


# *************************************************************************

async def create_exam_heading(user: _schemas.User, db: _orm.Session, exam_heading: _schemas.Exam_headingCreate):
    exam_heading = _models.Exam_heading(**exam_heading.dict(), owner_id=user.id)
    db.add(exam_heading)
    db.commit()
    db.refresh(exam_heading)
    return _schemas.Exam_heading.from_orm(exam_heading)


async def get_exam_headings(user: _schemas.User, db: _orm.Session):
    exam_headings = db.query(_models.Exam_heading).filter_by(owner_id=user.id)

    return list(map(_schemas.Exam_heading.from_orm, exam_headings))


async def _exam_heading_selector(exam_heading_id: int, user: _schemas.User, db: _orm.Session):
    exam_heading = (
        db.query(_models.Exam_heading)
        .filter_by(owner_id=user.id)
        .filter(_models.Exam_heading.id == exam_heading_id)
        .first()
    )

    if exam_heading is None:
        raise _fastapi.HTTPException(status_code=404, detail="Exam_heading does not exist")

    return exam_heading


async def get_exam_heading(exam_heading_id: int, user: _schemas.User, db: _orm.Session):
    exam_heading = await _exam_heading_selector(exam_heading_id=exam_heading_id, user=user, db=db)

    return _schemas.Exam_heading.from_orm(exam_heading)


async def delete_exam_heading(exam_heading_id: int, user: _schemas.User, db: _orm.Session):
    exam_heading = await _exam_heading_selector(exam_heading_id, user, db)

    db.delete(exam_heading)
    db.commit()

async def update_exam_heading(exam_heading_id: int, exam_heading: _schemas.Exam_headingCreate, user: _schemas.User, db: _orm.Session):
    exam_heading_db = await _exam_heading_selector(exam_heading_id, user, db)

    exam_heading_db.headerName = exam_heading.headerName
    exam_heading_db.date_pre = exam_heading.date_pre
    exam_heading_db.date_post = exam_heading.date_post
    exam_heading_db.date_last_updated = tz.date.isoformat(sep = " ")

    db.commit()
    db.refresh(exam_heading_db)

    return _schemas.Exam_heading.from_orm(exam_heading_db)

# *************************ข้อสอบ**********************************************

async def create_exam_question(exam_heading: id, db: _orm.Session, exam_question: _schemas.Exam_questionCreate):
    exam_question = _models.Exam_question(**exam_question.dict(), heading_id=exam_heading)
    db.add(exam_question)
    db.commit()
    db.refresh(exam_question)
    return _schemas.Exam_question.from_orm(exam_question)

async def get_exam_questions(exam_heading:id, db: _orm.Session):
    exam_questions = db.query(_models.Exam_question).filter_by(heading_id=exam_heading)

    return list(map(_schemas.Exam_question.from_orm, exam_questions))

async def _exam_question_selector(exam_question_id: int, exam_heading: id, db: _orm.Session):
    exam_question = (
        db.query(_models.Exam_question)
        .filter_by(heading_id=exam_heading)
        .filter(_models.Exam_question.ques_id == exam_question_id)
        .first()
    )

    if exam_question is None:
        raise _fastapi.HTTPException(status_code=404, detail="Exam_question does not exist")

    return exam_question

async def get_exam_question(exam_question_id: int, exam_heading: id, db: _orm.Session):
    exam_question = await _exam_question_selector(exam_question_id=exam_question_id, exam_heading=exam_heading, db=db)

    return _schemas.Exam_question.from_orm(exam_question)

async def delete_exam_question(exam_question_id:int,exam_heading:_schemas.Exam_heading,db: _orm.Session):
    exam_question = await _exam_question_selector(exam_question_id,exam_heading,db)

    db.delete(exam_question)
    db.commit()

async def update_exam_question(exam_question_id:int , exam_question:_schemas.Exam_questionCreate,exam_heading:_schemas.Exam_heading,db:_orm.Session):
    exam_question_db = await _exam_question_selector(exam_question_id,exam_heading,db)

    exam_question_db.question = exam_question.question
    exam_question_db.consider_bool = exam_question.consider_bool

    db.commit()
    db.refresh(exam_question_db)

    return _schemas.Exam_question.from_orm(exam_question_db)

#*******************************คะแนน*******************************************
async def create_exam_score(exam_question: id, db: _orm.Session, exam_score: _schemas.Exam_scoreCreate):
    exam_score = _models.Exam_Score(**exam_score.dict(), ques_id=exam_question)
    db.add(exam_score)
    db.commit()
    db.refresh(exam_score)
    return _schemas.Exam_score.from_orm(exam_score)

async def get_exam_scores(exam_question:id, db: _orm.Session):
    exam_scores = db.query(_models.Exam_Score).filter_by(ques_id=exam_question).order_by(desc(_models.Exam_Score.score))
    return list(map(_schemas.Exam_score.from_orm, exam_scores))

async def _exam_score_selector(exam_score_id: int, exam_question: id, db: _orm.Session):
    exam_score = (
        db.query(_models.Exam_Score)
        .filter_by(ques_id=exam_question)
        .filter(_models.Exam_Score.score_id == exam_score_id)
        .first()
    )

    if exam_score is None:
        raise _fastapi.HTTPException(status_code=404, detail="Exam_Score does not exist")

    return exam_score

async def get_exam_score(exam_score_id: int, exam_question: id, db: _orm.Session):
    exam_score = await _exam_score_selector(exam_score_id=exam_score_id, exam_question=exam_question, db=db)

    return _schemas.Exam_score.from_orm(exam_score)

async def delete_exam_score(exam_score_id:int,exam_question:_schemas.Exam_question,db: _orm.Session):
    exam_score = await _exam_score_selector(exam_score_id,exam_question,db)

    db.delete(exam_score)
    db.commit()

async def update_exam_score(exam_score_id:int , exam_score:_schemas.Exam_scoreCreate,exam_question:_schemas.Exam_question,db:_orm.Session):
    exam_score_db = await _exam_score_selector(exam_score_id,exam_question,db)

    exam_score_db.score = exam_score.score

    db.commit()
    db.refresh(exam_score_db)

    return _schemas.Exam_score.from_orm(exam_score_db)

#*******************************คำตอบ*******************************************
async def create_exam_answer(exam_score: id, db: _orm.Session, exam_answer: _schemas.Exam_answerCreate):
    exam_answer = _models.Exam_Answer(**exam_answer.dict(), score_id=exam_score)
    db.add(exam_answer)
    db.commit()
    db.refresh(exam_answer)
    return _schemas.Exam_answer.from_orm(exam_answer)

async def get_exam_answers(exam_score:id, db: _orm.Session):
    exam_answers = db.query(_models.Exam_Answer).filter_by(score_id=exam_score)
    return list(map(_schemas.Exam_answer.from_orm, exam_answers))

async def _exam_answer_selector(exam_answer_id: int, exam_score: id, db: _orm.Session):
    exam_answer = (
        db.query(_models.Exam_Answer)
        .filter_by(score_id=exam_score)
        .filter(_models.Exam_Answer.ans_id == exam_answer_id)
        .first()
    )

    if exam_answer is None:
        raise _fastapi.HTTPException(status_code=404, detail="Exam_answer does not exist")

    return exam_answer

async def get_exam_answer(exam_answer_id: int, exam_score: id, db: _orm.Session):
    exam_answer = await _exam_answer_selector(exam_answer_id=exam_answer_id, exam_score=exam_score, db=db)

    return _schemas.Exam_answer.from_orm(exam_answer)

async def delete_exam_answer(exam_answer_id:int,exam_score:_schemas.Exam_score,db: _orm.Session):
    exam_answer = await _exam_answer_selector(exam_answer_id,exam_score,db)

    db.delete(exam_answer)
    db.commit()

async def update_exam_answer(exam_answer_id:int , exam_answer:_schemas.Exam_answerCreate,exam_score:_schemas.Exam_score,db:_orm.Session):
    exam_answer_db = await _exam_answer_selector(exam_answer_id,exam_score,db)

    exam_answer_db.answer =exam_answer.answer

    db.commit()
    db.refresh(exam_answer_db)

    return _schemas.Exam_answer.from_orm(exam_answer_db)