import React, { useState, useEffect } from 'react';
import './user.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;

const FavoriteList = ({ profileId }) => {
    const [favorites, setFavorites] = useState([]);
  
    useEffect(() => {
        const fetchFavorites = async () => {
          try {
            const response = await axios.get(`${VITE_APP_BACKEND_URL}/favoritelist/${profileId}/idfavoritelist`);
            setFavorites(response.data);
          } catch (error) {
            console.error('Virhe suosikkien hakemisessa:', error);
          }
        };
    
        fetchFavorites();
      }, [profileId]);
  
    return (
      <div>
        <ul>
          {favorites.map((favorite, index) => (
            <li key={index}>{favorite.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FavoriteList;