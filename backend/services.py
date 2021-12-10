import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import uvicorn
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

async def create_exam_question(exam_heading: _schemas.Exam_heading, db: _orm.Session, exam_question: _schemas.Exam_questionCreate):
    exam_question = _models.Exam_question(**exam_question.dict(), heading_id=exam_heading.id)
    db.add(exam_question)
    db.commit()
    db.refresh(exam_question)
    return _schemas.Exam_question.from_orm(exam_question)

async def get_exam_questions(exam_heading: _schemas.Exam_heading, db: _orm.Session):
    exam_questions = db.query(_models.Exam_question).filter_by(heading_id=exam_heading.id)

    return list(map(_schemas.Exam_question.from_orm, exam_questions))

async def _exam_question_selector(exam_question_id: int, exam_heading: _schemas.Exam_heading, db: _orm.Session):
    exam_question = (
        db.query(_models.Exam_question)
        .filter_by(heading_id=exam_heading.id)
        .filter(_models.Exam_question.ques_id == exam_question_id)
        .first()
    )

    if exam_question is None:
        raise _fastapi.HTTPException(status_code=404, detail="Exam_question does not exist")

    return exam_question

async def get_exam_question(exam_question_id: int, exam_heading: _schemas.Exam_heading, db: _orm.Session):
    exam_question = await _exam_question_selector(exam_question_id=exam_question_id, exam_heading=exam_heading, db=db)

    return _schemas.Exam_question.from_orm(exam_question)
