import React from 'react';
import Select from 'react-select';
import './MainPage.css';

const MainPage = ({
  recipes,
  dishTypes,
  tags,
  selectedDishType,
  setSelectedDishType,
  selectedTags,
  setSelectedTags,
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

  const tagOptions = tags.map(tag => ({ value: tag.tag, label: tag.tag }));

  return (
    <main className="main-content">
      <div className="filters">
        <select onChange={e => setSelectedDishType(e.target.value)} value={selectedDishType}>
          <option value="">All Dish Types</option>
          {dishTypes.map(dishType => (
            <option key={dishType.id} value={dishType.id}>{dishType.name}</option>
          ))}
        </select>
        <Select
          isMulti
          options={tagOptions}
          value={selectedTags.map(tag => ({ value: tag, label: tag }))}
          onChange={selectedOptions => setSelectedTags(selectedOptions.map(option => option.value))}
        />
        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      <table className="recipe-table">
        <thead>
          <tr>
            <th className="id-column" onClick={() => handleSort('id')}>ID{getSortIndicator('id')}</th>
            <th className="name-column" onClick={() => handleSort('name')}>Name{getSortIndicator('name')}</th>
            <th className="thumbnail-column">Thumbnail</th>
            <th className="source-url-column">Source URL</th>
            <th className="creation-date-column" onClick={() => handleSort('created_at')}>Creation Date{getSortIndicator('created_at')}</th>
            <th className="dish-type-column" onClick={() => handleSort('dish_type')}>Dish Type{getSortIndicator('dish_type')}</th>
            <th className="tags-column">Tags</th>
            <th className="actions-column">Actions</th>
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
                    <button onClick={() => handleEditRecipe(recipe)}><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVuY2lsIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xMi4xNDYuMTQ2YS41LjUgMCAwIDEgLjcwOCAwbDMgM2EuNS41IDAgMCAxIDAgLjcwOGwtMTAgMTBhLjUuNSAwIDAgMS0uMTY4LjExbC01IDJhLjUuNSAwIDAgMS0uNjUtLjY1bDMtNWEuNS41IDAgMCAxIC4xMS0uMTY4ek0xMS4yMDcgMi41IDEzLjUgNC43OTMgMTQuNzkzIDMuNSAxMi41IDEuMjA3em0xLjU4NiAzTDEwLjUgMy4yMDcgNCA5LjcwN1YxMGguNWEuNS41IDAgMCAxIC41LjV2LjVoLjVhLjUuNSAwIDAgMSAuNS41di41aC4yOTN6bS05Ljc2MSA1LjE3NS0uMTA2LjEwNi0xLjUyOCAzLjgyMSAzLjgyMS0xLjUyOC4xMDYtLjEwNkEuNS41IDAgMCAxIDUgMTIuNVYxMmgtLjVhLjUuNSAwIDAgMS0uNS0uNVYxMWgtLjVhLjUuNSAwIDAgMS0uNDY4LS4zMjVaIi8+Cjwvc3ZnPg==" alt="Edit" /></button>
                    <button onClick={() => handleDeleteRecipe(recipe.id)}><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktdHJhc2giIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTUuNSAyLjVBNi41LjUgMCAwIDEgNiAwSDEwYTEuNS41IDAgMCAxIC41LjV2MWgxLjVBNi41LjUgMCAwIDEgMTYgM3YxLjVBNi41LjUgMCAwIDEgMTUuNSAzSDE0djEwLjVBNi41LjUgMCAwIDEgMTIuNSAxNkgzLjVBNi41LjUgMCAwIDEgMiAxMy41VjNIMS41QS41LjUgMCAwIDEgMSAydi0uNUEuNS41IDAgMCAxIDEuNSAyaDF2LTFoLjV6TTMgM2gxMHYxMC41YS41LjUgMCAwIDEgLS41LjVIMy41YS41LjUgMCAwIDEgLS41LS41VjN6TTUuNSA1LjVBNS41IDAgMCAxIDYgNWgxYTkuNSA5LjUgMCAwIDEgMSAwdjZoLTFhLjUuNSAwIDAgMS0uNS0uNVY1eiIvPgo8L3N2Zz4=" alt="Delete" /></button>
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