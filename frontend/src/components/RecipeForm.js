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
  const [thumbnail, setThumbnail] = useState(null);

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
      setTags(editingRecipe.tags.map(tag => tag.tag).join(', '));
      setThumbnail(editingRecipe.thumbnail);
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

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setThumbnail(blob);
        break;
      }
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const recipe = {
      name,
      description,
      dish_type_id: dishTypeId,
      ingredients,
      tags: tags.split(',').map(tag => tag.trim()),
      thumbnail: typeof thumbnail === 'string' ? thumbnail : null,
    };

    let updatedRecipe;

    if (editingRecipe) {
      const response = await axios.put(`http://localhost:8000/recipes/${editingRecipe.id}`, recipe);
      updatedRecipe = response.data;
    } else {
      const response = await axios.post('http://localhost:8000/recipes/', recipe);
      updatedRecipe = response.data;
    }

    if (thumbnail && typeof thumbnail !== 'string') {
      const formData = new FormData();
      formData.append('file', thumbnail);
      const response = await axios.post(`http://localhost:8000/recipes/${updatedRecipe.id}/thumbnail`, formData);
      updatedRecipe = response.data;
    }

    if (editingRecipe) {
      onRecipeUpdated(updatedRecipe);
    } else {
      onRecipeAdded(updatedRecipe);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Recipe Name" value={name} onChange={e => setName(e.target.value)} required />
      <div className="description-editor">
        <ReactQuill value={description} onChange={setDescription} />
      </div>
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
              <td><input type="number" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={event => handleIngredientChange(index, event)} required /></td>
              <td>
                <select name="unit" value={ingredient.unit || ''} onChange={event => handleIngredientChange(index, event)} required>
                  <option value="">Select Unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </td>
              <td><button type="button" onClick={() => handleRemoveIngredient(index)} className="delete-ingredient-btn"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktdHJhc2giIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTUuNSAyLjVBNi41LjUgMCAwIDEgNiAwSDEwYTEuNS41IDAgMCAxIC41LjV2MWgxLjVBNi41LjUgMCAwIDEgMTYgM3YxLjVBNi41LjUgMCAwIDEgMTUuNSAzSDE0djEwLjVBNi41LjUgMCAwIDEgMTIuNSAxNkgzLjVBNi41LjUgMCAwIDEgMiAxMy41VjNIMS41QS41LjUgMCAwIDEgMSAydi0uNUEuNS41IDAgMCAxIDEuNSAyaDF2LTFoLjV6TTMgM2gxMHYxMC41YS41LjUgMCAwIDEgLS41LjVIMy41YS41LjUgMCAwIDEgLS41LS41VjN6TTUuNSA1LjVBNS41IDAgMCAxIDYgNWgxYTkuNSA5LjUgMCAwIDEgMSAwdjZoLTFhLjUuNSAwIDAgMS0uNS0uNVY1eiIvPgo8L3N2Zz4=" alt="Delete" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => handleAddIngredient()}>Add Ingredient</button>
      <input type="text" name="tags" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
      <h3>Thumbnail</h3>
      {thumbnail && <img src={typeof thumbnail === 'string' ? `http://localhost:8000/${thumbnail}` : URL.createObjectURL(thumbnail)} alt="Thumbnail" style={{width: '100px'}}/>}
      <input type="file" name="thumbnail" onChange={handleThumbnailChange} onPaste={handlePaste} />
      <button type="submit">{editingRecipe ? 'Update Recipe' : 'Add Recipe'}</button>
    </form>
  );
};

export default RecipeForm;