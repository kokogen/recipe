from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

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

@router.post("/dish-types/", response_model=schemas.DishType)
def create_dish_type(dish_type: schemas.DishTypeCreate, db: Session = Depends(get_db)):
    return crud.create_dish_type(db=db, dish_type=dish_type)

@router.get("/dish-types/", response_model=List[schemas.DishType])
def read_dish_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    dish_types = crud.get_dish_types(db, skip=skip, limit=limit)
    return dish_types

@router.get("/dish-types/{dish_type_id}", response_model=schemas.DishType)
def read_dish_type(dish_type_id: int, db: Session = Depends(get_db)):
    db_dish_type = crud.get_dish_type(db, dish_type_id=dish_type_id)
    if db_dish_type is None:
        raise HTTPException(status_code=404, detail="Dish type not found")
    return db_dish_type

@router.delete("/dish-types/{dish_type_id}", response_model=schemas.DishType)
def delete_dish_type(dish_type_id: int, db: Session = Depends(get_db)):
    db_dish_type = crud.delete_dish_type(db, dish_type_id=dish_type_id)
    if db_dish_type is None:
        raise HTTPException(status_code=404, detail="Dish type not found")
    return db_dish_type
