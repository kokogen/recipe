import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import RecipeForm from './components/RecipeForm';
import DishTypeManager from './components/DishTypeManager';
import Modal from './components/Modal';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showDishTypeManager, setShowDishTypeManager] = useState(false);
  const [dishTypes, setDishTypes] = useState([]);
  const [selectedDishType, setSelectedDishType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/dish-types/')
      .then(response => {
        setDishTypes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dish types!', error);
      });
  }, []);

  useEffect(() => {
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    fetchRecipes(1, true);
  }, [selectedDishType, searchTerm]);

  const fetchRecipes = (page, newSearch = false) => {
    let url = 'http://localhost:8000/recipes/';
    const params = { skip: (page - 1) * 10, limit: 10 };
    if (selectedDishType) {
      params.dish_type_id = selectedDishType;
    }
    if (searchTerm) {
      params.search = searchTerm;
    }
    axios.get(url, { params })
      .then(response => {
        if (response.data.length === 0) {
          setHasMore(false);
        }
        if (newSearch) {
          setRecipes(response.data);
        } else {
          setRecipes([...recipes, ...response.data]);
        }
        setPage(page + 1);
      })
      .catch(error => {
        console.error('There was an error fetching the recipes!', error);
      });
  }

  const handleRecipeAdded = (recipe) => {
    setRecipes([recipe, ...recipes]);
    setShowForm(false);
  };

  const handleRecipeUpdated = (recipe) => {
    const newRecipes = recipes.map(r => (r.id === recipe.id ? recipe : r));
    setRecipes(newRecipes);
    setEditingRecipe(null);
    setShowForm(false);
  };

  const handleDeleteRecipe = (recipeId) => {
    axios.delete(`http://localhost:8000/recipes/${recipeId}`)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      })
      .catch(error => {
        console.error('There was an error deleting the recipe!', error);
      });
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipeum</h1>
        <div>
          <button onClick={() => { setShowForm(true); setEditingRecipe(null); }}>
            Add Recipe
          </button>
          <button onClick={() => setShowDishTypeManager(true)}>
            Manage Dish Types
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="filters">
          <select onChange={e => setSelectedDishType(e.target.value)} value={selectedDishType}>
            <option value="">All Dish Types</option>
            {dishTypes.map(dishType => (
              <option key={dishType.id} value={dishType.id}>{dishType.name}</option>
            ))}
          </select>
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="recipe-list">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h2>{recipe.name}</h2>
              <p>{recipe.description}</p>
              <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
              <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
            </div>
          ))}
        </div>
        {hasMore && <button onClick={() => fetchRecipes(page)}>Load More</button>}
      </main>
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <RecipeForm onRecipeAdded={handleRecipeAdded} onRecipeUpdated={handleRecipeUpdated} editingRecipe={editingRecipe} onClose={() => setShowForm(false)} />
        </Modal>
      )}
      {showDishTypeManager && (
        <Modal onClose={() => setShowDishTypeManager(false)}>
          <DishTypeManager />
        </Modal>
      )}
    </div>
  );
}

export default App;
