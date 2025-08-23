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
        <button type="submit"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ4IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNCIvPgogIDxsaW5lIHgxPSIzMCIgeTE9IjUwIiB4Mj0iNzAiIHkyPSI1MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxsaW5lIHgxPSI1MCIgeTE9IjMwIiB4Mj0iNTAiIHkyPSI3MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saWJlY2FwPSJyb3VuZCIvPgo8L3N2Zz4K" alt="Add Dish Type" /></button>
      </form>
      <ul>
        {dishTypes.map(dishType => (
          <li key={dishType.id}>
            {dishType.name}
            <button onClick={() => handleDeleteDishType(dishType.id)}><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktdHJhc2giIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTUuNSAyLjVBNi41LjUgMCAwIDEgNiAwSDEwYTEuNS41IDAgMCAxIC41LjV2MWgxLjVBNi41LjUgMCAwIDEgMTYgM3YxLjVBNi41LjUgMCAwIDEgMTUuNSAzSDE0djEwLjVBNi41LjUgMCAwIDEgMTIuNSAxNkgzLjVBNi41LjUgMCAwIDEgMiAxMy41VjNIMS41QS41LjUgMCAwIDEgMSAydi0uNUEuNS41IDAgMCAxIDEuNSAyaDF2LTFoLjV6TTMgM2gxMHYxMC41YS41LjUgMCAwIDEgLS41LjVIMy41YS41LjUgMCAwIDEgLS41LS41VjN6TTUuNSA1LjVBNS41IDAgMCAxIDYgNWgxYTkuNSA5LjUgMCAwIDEgMSAwdjZoLTFhLjUuNSAwIDAgMS0uNS0uNVY1eiIvPgo8L3N2Zz4=" alt="Delete" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishTypeManager;
