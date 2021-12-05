from typing import List
import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas

app = _fastapi.FastAPI()


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


@app.post("/api/exam_heading", response_model=_schemas.Exam_heading)
async def create_exam_heading(
    exam_heading: _schemas.Exam_headingCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_exam_heading(user=user, db=db, exam_heading=exam_heading)


@app.get("/api/exam_heading", response_model=List[_schemas.Exam_heading])
async def get_exam_headings(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_exam_headings(user=user, db=db)


@app.get("/api/exam_headings/{exam_heading_id}", status_code=200)
async def get_exam_heading(
    exam_heading_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_exam_heading(exam_heading_id, user, db)


@app.delete("/api/exam_headings/{exam_heading_id}", status_code=204)
async def delete_exam_heading(
    exam_heading_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_exam_heading(exam_heading_id, user, db)
    return {"message", "Successfully Deleted"}


@app.put("/api/exam_headings/{exam_heading_id}", status_code=200)
async def update_exam_heading(
    exam_heading_id: int,
    exam_heading: _schemas.Exam_headingCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.update_exam_heading(exam_heading_id, exam_heading, user, db)
    return {"message", "Successfully Updated"}

@app.get("/api")
async def root():
    return {"message": "Awesome Leads Manager"}

    
