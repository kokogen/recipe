import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MainPage from './components/MainPage';
import RecipeForm from './components/RecipeForm';
import DishTypeManager from './components/DishTypeManager';
import Modal from './components/Modal';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showDishTypeManager, setShowDishTypeManager] = useState(false);
  const [dishTypes, setDishTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedDishType, setSelectedDishType] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    axios.get('http://localhost:8000/dish-types/')
      .then(response => {
        setDishTypes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dish types!', error);
      });
    axios.get('http://localhost:8000/tags/')
      .then(response => {
        setTags(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tags!', error);
      });
  }, []);

  useEffect(() => {
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    fetchRecipes(1, true);
  }, [selectedDishType, selectedTags, searchTerm, sortBy, sortOrder]);

  const fetchRecipes = (page, newSearch = false) => {
    let url = 'http://localhost:8000/recipes/';
    const params = { 
      skip: (page - 1) * 10, 
      limit: 10,
      sort_by: sortBy,
      sort_order: sortOrder,
      tags: selectedTags.join(','),
    };
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

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleRecipeAdded = (recipe) => {
    setShowForm(false);
    fetchRecipes(1, true);
  };

  const handleRecipeUpdated = (recipe) => {
    console.log('Recipe updated:', recipe);
    setEditingRecipe(null);
    setShowForm(false);
    fetchRecipes(1, true);
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
        <MainPage
          recipes={recipes}
          dishTypes={dishTypes}
          tags={tags}
          selectedDishType={selectedDishType}
          setSelectedDishType={setSelectedDishType}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          fetchRecipes={fetchRecipes}
          hasMore={hasMore}
          handleEditRecipe={handleEditRecipe}
          handleDeleteRecipe={handleDeleteRecipe}
          page={page}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />
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
