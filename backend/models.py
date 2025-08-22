from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base
import datetime

recipe_tags = Table('recipe_tags', Base.metadata,
    Column('recipe_id', Integer, ForeignKey('recipes.id', ondelete="CASCADE"), primary_key=True),
    Column('tag', String, ForeignKey('tags.tag', ondelete="CASCADE"), primary_key=True)
)

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    source_url = Column(String)
    thumbnail = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    dish_type_id = Column(Integer, ForeignKey('dish_types.id'), nullable=False)

    dish_type = relationship("DishType", back_populates="recipes")
    ingredients = relationship("Ingredient", back_populates="recipe", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary=recipe_tags, back_populates="recipes")

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    quantity = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    recipe_id = Column(Integer, ForeignKey('recipes.id', ondelete="CASCADE"), nullable=False)

    recipe = relationship("Recipe", back_populates="ingredients")

class Tag(Base):
    __tablename__ = "tags"

    tag = Column(String, primary_key=True, index=True)

    recipes = relationship("Recipe", secondary=recipe_tags, back_populates="tags")

class DishType(Base):
    __tablename__ = "dish_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    recipes = relationship("Recipe", back_populates="dish_type")
