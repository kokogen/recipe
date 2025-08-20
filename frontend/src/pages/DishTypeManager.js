import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DishTypeManager = () => {
  const [dishTypes, setDishTypes] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/dish-types/')
      .then(response => {
        setDishTypes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dish types!', error);
      });
  }, []);

  const handleAddDishType = event => {
    event.preventDefault();
    axios.post('http://localhost:8000/dish-types/', { name })
      .then(response => {
        setDishTypes([...dishTypes, response.data]);
        setName('');
      })
      .catch(error => {
        console.error('There was an error creating the dish type!', error);
      });
  };

  const handleDeleteDishType = (dishTypeId) => {
    axios.delete(`http://localhost:8000/dish-types/${dishTypeId}`)
      .then(() => {
        setDishTypes(dishTypes.filter(dishType => dishType.id !== dishTypeId));
      })
      .catch(error => {
        console.error('There was an error deleting the dish type!', error);
      });
  };

  return (
    <div>
      <h2>Dish Type Manager</h2>
      <form onSubmit={handleAddDishType}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="New Dish Type" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {dishTypes.map(dishType => (
          <li key={dishType.id}>
            {dishType.name}
            <button onClick={() => handleDeleteDishType(dishType.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishTypeManager;
