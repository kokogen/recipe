import React from 'react';

const MainPage = ({
  recipes,
  dishTypes,
  selectedDishType,
  setSelectedDishType,
  searchTerm,
  setSearchTerm,
  fetchRecipes,
  hasMore,
  handleEditRecipe,
  handleDeleteRecipe,
  page,
  sortBy,
  sortOrder,
  handleSort,
}) => {
  const getSortIndicator = (key) => {
    if (sortBy === key) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
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
      <table className="recipe-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID{getSortIndicator('id')}</th>
            <th onClick={() => handleSort('name')}>Name{getSortIndicator('name')}</th>
            <th>Thumbnail</th>
            <th>Source URL</th>
            <th onClick={() => handleSort('created_at')}>Creation Date{getSortIndicator('created_at')}</th>
            <th onClick={() => handleSort('dish_type')}>Dish Type{getSortIndicator('dish_type')}</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map(recipe => (
            <tr key={recipe.id}>
              <td>{recipe.id}</td>
              <td>{recipe.name}</td>
              <td>{recipe.thumbnail && <img src={`http://localhost:8000/${recipe.thumbnail}`} alt={recipe.name} style={{width: '100px'}} />}</td>
              <td><a href={recipe.source_url} target="_blank" rel="noopener noreferrer">{recipe.source_url}</a></td>
              <td>{new Date(recipe.created_at).toLocaleDateString()}</td>
              <td>{recipe.dish_type.name}</td>
              <td>{recipe.tags.map(tag => tag.tag).join(', ')}</td>
              <td>
                <div className="actions-menu">
                  <button>...</button>
                  <div className="actions-dropdown">
                    <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
                    <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasMore && <button onClick={() => fetchRecipes(page)}>Load More</button>}
    </main>
  );
};

export default MainPage;