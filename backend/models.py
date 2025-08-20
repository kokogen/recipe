from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base
import datetime

recipe_tags = Table('recipe_tags', Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    source_url = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    dish_type_id = Column(Integer, ForeignKey('dish_types.id'))

    dish_type = relationship("DishType", back_populates="recipes")
    ingredients = relationship("Ingredient", back_populates="recipe")
    tags = relationship("Tag", secondary=recipe_tags, back_populates="recipes")

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(String)
    recipe_id = Column(Integer, ForeignKey('recipes.id'))

    recipe = relationship("Recipe", back_populates="ingredients")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    recipes = relationship("Recipe", secondary=recipe_tags, back_populates="tags")

class DishType(Base):
    __tablename__ = "dish_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    recipes = relationship("Recipe", back_populates="dish_type")
