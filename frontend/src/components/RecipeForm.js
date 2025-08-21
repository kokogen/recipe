import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RecipeForm = ({ onRecipeAdded, onRecipeUpdated, editingRecipe, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dishTypeId, setDishTypeId] = useState('');
  const [dishTypes, setDishTypes] = useState([]);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [tags, setTags] = useState('');

  const units = ["грамм", "килограмм", "литр", "пучок", "стакан", "столовая ложка", "чайная ложка", "штука", "щепотка"].sort();

  useEffect(() => {
    axios.get('http://localhost:8000/dish-types/')
      .then(response => {
        setDishTypes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dish types!', error);
      });

    if (editingRecipe) {
      setName(editingRecipe.name);
      setDescription(editingRecipe.description);
      setDishTypeId(editingRecipe.dish_type.id);
      setIngredients(editingRecipe.ingredients);
      setTags(editingRecipe.tags.map(tag => tag.name).join(', '));
    }
  }, [editingRecipe]);

  const handleIngredientChange = (index, event) => {
    const values = [...ingredients];
    values[index][event.target.name] = event.target.value;
    setIngredients(values);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
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

    if (editingRecipe) {
      axios.put(`http://localhost:8000/recipes/${editingRecipe.id}`, recipe)
        .then((response) => {
          onRecipeUpdated(response.data);
          onClose();
        })
        .catch(error => {
          console.error('There was an error updating the recipe!', error);
        });
    } else {
      axios.post('http://localhost:8000/recipes/', recipe)
        .then((response) => {
          onRecipeAdded(response.data);
          onClose();
        })
        .catch(error => {
          console.error('There was an error creating the recipe!', error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Recipe Name" value={name} onChange={e => setName(e.target.value)} required />
      <ReactQuill value={description} onChange={setDescription} />
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
            <th>Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={index}>
              <td><input type="text" name="name" placeholder="Ingredient Name" value={ingredient.name} onChange={event => handleIngredientChange(index, event)} required /></td>
              <td><input type="text" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={event => handleIngredientChange(index, event)} required /></td>
              <td>
                <select name="unit" value={ingredient.unit || ''} onChange={event => handleIngredientChange(index, event)} required>
                  <option value="">Select Unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </td>
              <td><button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => handleAddIngredient()}>Add Ingredient</button>
      <input type="text" name="tags" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
      <button type="submit">{editingRecipe ? 'Update Recipe' : 'Add Recipe'}</button>
    </form>
  );
};

export default RecipeForm;