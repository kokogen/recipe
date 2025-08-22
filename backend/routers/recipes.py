from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import shutil

import crud, models, schemas
from database import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    return crud.create_recipe(db=db, recipe=recipe)

@router.post("/recipes/{recipe_id}/thumbnail")
def upload_thumbnail(recipe_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    file_path = f"media/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    db_recipe.thumbnail = file_path
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.get("/recipes/", response_model=List[schemas.Recipe])
def read_recipes(skip: int = 0, limit: int = 100, dish_type_id: int = None, search: str = None, sort_by: str = None, sort_order: str = 'asc', db: Session = Depends(get_db)):
    recipes = crud.get_recipes(db, skip=skip, limit=limit, dish_type_id=dish_type_id, search=search, sort_by=sort_by, sort_order=sort_order)
    return recipes

@router.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@router.delete("/recipes/{recipe_id}", response_model=schemas.Recipe)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = crud.delete_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@router.put("/recipes/{recipe_id}", response_model=schemas.Recipe)
def update_recipe(recipe_id: int, recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    db_recipe = crud.update_recipe(db, recipe_id=recipe_id, recipe=recipe)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe