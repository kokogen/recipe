import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dishTypeId, setDishTypeId] = useState('');
  const [dishTypes, setDishTypes] = useState([]);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [tags, setTags] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/dish-types/')
      .then(response => {
        setDishTypes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dish types!', error);
      });

    if (id) {
      axios.get(`http://localhost:8000/recipes/${id}`)
        .then(response => {
          const recipe = response.data;
          setName(recipe.name);
          setDescription(recipe.description);
          setDishTypeId(recipe.dish_type.id);
          setIngredients(recipe.ingredients);
          setTags(recipe.tags.map(tag => tag.name).join(', '));
        })
        .catch(error => {
          console.error('There was an error fetching the recipe!', error);
        });
    }
  }, [id]);

  const handleIngredientChange = (index, event) => {
    const values = [...ingredients];
    values[index][event.target.name] = event.target.value;
    setIngredients(values);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleRemoveIngredient = index => {
    const values = [...ingredients];
    values.splice(index, 1);
    setIngredients(values);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const recipe = {
      name,
      description,
      dish_type_id: dishTypeId,
      ingredients,
      tags: tags.split(',').map(tag => tag.trim()),
    };

    if (id) {
      axios.put(`http://localhost:8000/recipes/${id}`, recipe)
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error('There was an error updating the recipe!', error);
        });
    } else {
      axios.post('http://localhost:8000/recipes/', recipe)
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error('There was an error creating the recipe!', error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Recipe Name" value={name} onChange={e => setName(e.target.value)} required />
      <textarea name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <select name="dishTypeId" value={dishTypeId} onChange={e => setDishTypeId(e.target.value)} required>
        <option value="">Select Dish Type</option>
        {dishTypes.map(dishType => (
          <option key={dishType.id} value={dishType.id}>{dishType.name}</option>
        ))}
      </select>
      <h3>Ingredients</h3>
      <table className="ingredients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={index}>
              <td><input type="text" name="name" placeholder="Ingredient Name" value={ingredient.name} onChange={event => handleIngredientChange(index, event)} required /></td>
              <td><input type="text" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={event => handleIngredientChange(index, event)} required /></td>
              <td><button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => handleAddIngredient()}>Add Ingredient</button>
      <input type="text" name="tags" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
      <button type="submit">{id ? 'Update Recipe' : 'Add Recipe'}</button>
    </form>
  );
};

export default RecipeForm;
