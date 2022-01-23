from typing import List
import fastapi as _fastapi
import fastapi.security as _security
import database as _database, models as _models
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas

app = _fastapi.FastAPI()
def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/users")
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)
    

    return await _services.create_token(user)


@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

# ***************************************************************************************
@app.post("/api/exam", response_model=_schemas.Exam)
async def create_exam(
    exam: _schemas.ExamCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_exam(user=user, db=db, exam=exam)


@app.get("/api/exam", response_model=List[_schemas.Exam])
async def get_exams(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_exams(user=user, db=db)


@app.get("/api/exams/{exam_id}", status_code=200)
async def get_exam(
    exam_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_exam(exam_id, user, db)


@app.delete("/api/exams/{exam_id}", status_code=204)
async def delete_exam(
    exam_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_exam(exam_id, user, db)
    return {"message", "Successfully Deleted"}


@app.put("/api/exams/{exam_id}", status_code=200)
async def update_exam(
    exam_id: int,
    exam: _schemas.ExamCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.update_exam(exam_id, exam, user, db)
    return {"message", "Successfully Updated"}

@app.get("/api")
async def root():
    return {"message": "Awesome Leads Manager"}



# **********************************คำถาม*************************************

@app.get("/exams/{exam_id}",response_model=_schemas.ExamSchema,response_model_exclude={'blurb'},response_model_by_alias=False)
async def get_questions(exam_id:int,db:_orm.Session() = _fastapi.Depends(get_db)):
    db_question = db.query(_models.Exam).options(_orm.joinedload(_models.Exam.question)).where(_models.Exam.exam_id==exam_id).one()
    return db_question

@app.get("/questions/{exam_id}",response_model=_schemas.ExamSchema,response_model_exclude={'blurb'},response_model_by_alias=False)
async def get_questions(exam_id:int,db:_orm.Session() = _fastapi.Depends(get_db)):
    db_question = db.query(_models.Exam).options(_orm.joinedload(_models.Exam.question)).where(_models.Exam.exam_id==exam_id).one()
    return db_question

@app.post("/api/question", response_model=_schemas.Question)
async def create_question(
    question: _schemas.QuestionCreate,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_question( db=db,question=question)

@app.get("/api/exams/{exam_id}/question", response_model=List[_schemas.Question])
async def get_questions(
    exam_id: int,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_questions(exam=exam_id, db=db)

@app.get("/api/exams/{exam_id}/questions/{question_id}", status_code=200)
async def get_question(
    question_id: int,
    exam_id:int,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_question(question_id, exam_id, db)

@app.delete("/api/exams/{exam_id}/questions/{question_id}",status_code=204)
async def delete_question(
    question_id:int,
    exam_id:int,
    db:_orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_question(question_id,exam_id,db)
    return {"message","Successfully Deleted"}

@app.put("/api/exams/{exam_id}/questions/{question_id}",status_code=200)
async def update_question(
    question_id:int,
    question:_schemas.QuestionCreate,
    exam_id:int,
    db:_orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.update_question(question_id,question,exam_id,db)
    return {"message","Successfully Updated"}



#****************** คำตอบ ******************************
# @app.post("/api/exam_scores/{exam_score_id}/exam_answer", response_model=_schemas.Exam_answer)
# async def create_exam_answer(
#     exam_answer: _schemas.Exam_answerCreate,
#     exam_score_id:int,
#     db: _orm.Session = _fastapi.Depends(_services.get_db),
# ):
#     return await _services.create_exam_answer(exam_score=exam_score_id, db=db,exam_answer=exam_answer)

# @app.get("/api/exam_scores/{exam_score_id}/exam_answer", response_model=List[_schemas.Exam_answer])
# async def get_exam_answers(
#     exam_score_id: int,
#     db: _orm.Session = _fastapi.Depends(_services.get_db),
# ):
#     return await _services.get_exam_answers(exam_score=exam_score_id, db=db)

# @app.get("/api/exam_scores/{exam_score_id}/exam_answers/{exam_answer_id}", status_code=200)
# async def get_exam_answer(
#     exam_answer_id: int,
#     exam_score_id:int,
#     db: _orm.Session = _fastapi.Depends(_services.get_db),
# ):
#     return await _services.get_exam_answer(exam_answer_id, exam_score_id, db)

# @app.delete("/api/exam_scores/{exam_score_id}/exam_answers/{exam_answer_id}",status_code=204)
# async def delete_exam_answer(
#     exam_answer_id:int,
#     exam_score_id:int,
#     db:_orm.Session = _fastapi.Depends(_services.get_db),
# ):
#     await _services.delete_exam_answer(exam_answer_id,exam_score_id,db)
#     return {"message","Successfully Deleted"}

# @app.put("/api/exam_scores/{exam_score_id}/exam_answers/{exam_answer_id}",status_code=200)
# async def update_exam_answer(
#     exam_answer_id:int,
#     exam_answer:_schemas.Exam_answerCreate,
#     exam_score_id:int,
#     db:_orm.Session = _fastapi.Depends(_services.get_db),
# ):
#     await _services.update_exam_answer(exam_answer_id,exam_answer,exam_score_id,db)
#     return {"message","Successfully Updated"}