from pydantic import BaseModel
from typing import List, Optional
import datetime

class IngredientBase(BaseModel):
    name: str
    quantity: str

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    recipe_id: int

    class Config:
        orm_mode = True

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int

    class Config:
        orm_mode = True

class DishTypeBase(BaseModel):
    name: str

class DishTypeCreate(DishTypeBase):
    pass

class DishType(DishTypeBase):
    id: int

    class Config:
        orm_mode = True

class RecipeBase(BaseModel):
    name: str
    description: str
    source_url: Optional[str] = None
    dish_type_id: int

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientCreate]
    tags: List[str]

class Recipe(RecipeBase):
    id: int
    created_at: datetime.datetime
    ingredients: List[Ingredient] = []
    tags: List[Tag] = []
    dish_type: DishType

    class Config:
        orm_mode = True
