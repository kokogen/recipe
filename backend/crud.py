from sqlalchemy.orm import Session

import models, schemas


def get_dish_type(db: Session, dish_type_id: int):
    return db.query(models.DishType).filter(models.DishType.id == dish_type_id).first()


def get_dish_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DishType).offset(skip).limit(limit).all()


def create_dish_type(db: Session, dish_type: schemas.DishTypeCreate):
    db_dish_type = models.DishType(name=dish_type.name)
    db.add(db_dish_type)
    db.commit()
    db.refresh(db_dish_type)
    return db_dish_type

def delete_dish_type(db: Session, dish_type_id: int):
    db_dish_type = db.query(models.DishType).filter(models.DishType.id == dish_type_id).first()
    if db_dish_type:
        db.delete(db_dish_type)
        db.commit()
    return db_dish_type

def get_tag(db: Session, tag_id: int):
    return db.query(models.Tag).filter(models.Tag.id == tag_id).first()

def get_tag_by_name(db: Session, name: str):
    return db.query(models.Tag).filter(models.Tag.name == name).first()

def get_tags(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tag).offset(skip).limit(limit).all()

def create_tag(db: Session, tag: schemas.TagCreate):
    db_tag = models.Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_recipe(db: Session, recipe_id: int):
    return db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()

def get_recipes(db: Session, skip: int = 0, limit: int = 100, dish_type_id: int = None, search: str = None, sort_by: str = None, sort_order: str = 'asc'):
    query = db.query(models.Recipe)
    if dish_type_id:
        query = query.filter(models.Recipe.dish_type_id == dish_type_id)
    if search:
        query = query.filter(models.Recipe.name.contains(search) | models.Recipe.description.contains(search))
    
    if sort_by:
        if sort_by == 'dish_type':
            query = query.join(models.DishType)
            if sort_order == 'asc':
                query = query.order_by(models.DishType.name.asc())
            else:
                query = query.order_by(models.DishType.name.desc())
        else:
            sort_map = {
                'id': models.Recipe.id,
                'name': models.Recipe.name,
                'created_at': models.Recipe.created_at
            }
            column = sort_map.get(sort_by)
            if column is not None:
                if sort_order == 'asc':
                    query = query.order_by(column.asc())
                else:
                    query = query.order_by(column.desc())

    return query.offset(skip).limit(limit).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(
        name=recipe.name,
        description=recipe.description,
        source_url=recipe.source_url,
        dish_type_id=recipe.dish_type_id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)

    for ingredient_data in recipe.ingredients:
        db_ingredient = models.Ingredient(**ingredient_data.dict(), recipe_id=db_recipe.id)
        db.add(db_ingredient)

    for tag_name in recipe.tags:
        tag = get_tag_by_name(db, name=tag_name)
        if not tag:
            tag = create_tag(db, schemas.TagCreate(name=tag_name))
        db_recipe.tags.append(tag)

    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def delete_recipe(db: Session, recipe_id: int):
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if db_recipe:
        db.delete(db_recipe)
        db.commit()
    return db_recipe

def update_recipe(db: Session, recipe_id: int, recipe: schemas.RecipeCreate):
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if db_recipe:
        db_recipe.name = recipe.name
        db_recipe.description = recipe.description
        db_recipe.source_url = recipe.source_url
        db_recipe.dish_type_id = recipe.dish_type_id

        # Clear existing ingredients and tags
        for ingredient in db_recipe.ingredients:
            db.delete(ingredient)
        db_recipe.tags.clear()

        for ingredient_data in recipe.ingredients:
            db_ingredient = models.Ingredient(**ingredient_data.dict(), recipe_id=db_recipe.id)
            db.add(db_ingredient)

        for tag_name in recipe.tags:
            tag = get_tag_by_name(db, name=tag_name)
            if not tag:
                tag = create_tag(db, schemas.TagCreate(name=tag_name))
            db_recipe.tags.append(tag)

        db.commit()
        db.refresh(db_recipe)
    return db_recipe
