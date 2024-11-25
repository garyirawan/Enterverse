import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Fungsi untuk menyimpan data favorit ke AsyncStorage
  const saveFavoritesToStorage = async (favorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to storage:', error);
    }
  };

  // Fungsi untuk memuat data favorit dari AsyncStorage
  const loadFavoritesFromStorage = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from storage:', error);
    }
  };

  // Tambahkan favorit ke state dan simpan ke AsyncStorage
  const addFavorite = (item) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === item.id)) return prevFavorites;
  
      // Normalisasi data untuk film, buku, dan game
      const formattedItem = {
        id: item.id,
        title: item.title || item.volumeInfo?.title || item.name,
        image: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : item.volumeInfo?.imageLinks?.thumbnail || item.background_image,
        type: item.type || 'movie', // Tambahkan tipe untuk navigasi
      };
  
      return [...prevFavorites, formattedItem];
    });
  };
  

  // Hapus favorit dari state dan AsyncStorage
  const removeFavorite = (id) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((fav) => fav.id !== id);
      saveFavoritesToStorage(updatedFavorites); // Simpan perubahan ke AsyncStorage
      return updatedFavorites;
    });
  };

  // Muat data favorit dari AsyncStorage saat komponen pertama kali dirender
  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
