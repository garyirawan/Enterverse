import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FavoritesContext } from '../components/FavoritesContext'; // Import FavoritesContext
import axios from 'axios';
import Modal from 'react-native-modal'; // Import react-native-modal

const DetailScreen = ({ route, navigation }) => {
  const { item, type } = route.params;
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for trailer modal visibility
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext); // Favorites context

  // Check if the item is already a favorite
  const isFavorite = favorites.some((fav) => fav.id === item.id);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      let response;
      if (type === 'movie') {
        response = await axios.get(
          `https://api.themoviedb.org/3/movie/${item.id}?api_key=9634e103c05aa8d8623d8a6385ecd62c&language=en-US`
        );

        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${item.id}/videos?api_key=9634e103c05aa8d8623d8a6385ecd62c&language=en-US`
        );

        const trailer = trailerResponse.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
        setDetails(response.data);
      } else if (type === 'book') {
        response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${item.id}`);
        setDetails(response.data);
      } else if (type === 'game') {
        response = await axios.get(
          `https://api.rawg.io/api/games/${item.id}?key=c99b20d375e24b9299bafa42106ee74c`
        );
        setDetails(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching details:', error);
      setLoading(false);
    }
  };

  const handleAddFavorite = () => {
    const favoriteItem = {
      id: details.id,
      title: details.title || details.name || details.volumeInfo?.title,
      image: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : details.volumeInfo?.imageLinks?.thumbnail || details.background_image,
      type,
    };
    addFavorite(favoriteItem);
  };
  

  const handleRemoveFavorite = () => {
    removeFavorite(item.id);
  };

  const openTrailer = () => {
    if (trailerKey) {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`);
    } else {
      setIsModalVisible(true); // Show modal if trailer is not available
    }
  };

  const closeModal = () => {
    setIsModalVisible(false); // Close modal
  };

  const renderImage = (url) => {
    if (url) {
      return <Image source={{ uri: url }} style={styles.image} />;
    }
    return (
      <View style={styles.iconContainer}>
        <Ionicons name="book-outline" size={100} color="#fff" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to fetch details. Please try again later.</Text>
      </View>
    );
  }

  // Extract details
  let title, description, imageUrl, genres, rating, authors, publisher, publishedDate, runtime, releaseYear;
  if (type === 'movie') {
    title = details.title;
    description = details.overview || 'No description available.';
    imageUrl = `https://image.tmdb.org/t/p/w500${details.poster_path || details.backdrop_path}`;
    genres = details.genres ? details.genres.map((genre) => genre.name).join(', ') : 'N/A';
    rating = details.vote_average;
    runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}min` : 'N/A';
    releaseYear = details.release_date ? details.release_date.split('-')[0] : 'N/A';
  } else if (type === 'book') {
    const volumeInfo = details.volumeInfo || {};
    title = volumeInfo.title || 'No Title';
    description = volumeInfo.description || 'No description available.';
    imageUrl = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://github.com/user-attachments/assets/e5961e4b-c3bd-4f2b-9353-a8b1b60343e5';
    genres = volumeInfo.categories ? volumeInfo.categories.join(', ') : 'N/A';
    rating = volumeInfo.averageRating ? `${volumeInfo.averageRating} / 5` : 'N/A';
    authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown';
    publisher = volumeInfo.publisher || 'Unknown';
    publishedDate = volumeInfo.publishedDate || 'Unknown';
  } else if (type === 'game') {
    title = details.name;
    description = details.description_raw || 'No description available.';
    imageUrl = details.background_image;
    genres = details.genres ? details.genres.map((genre) => genre.name).join(', ') : 'N/A';
    rating = details.rating;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Gunakan fungsi renderImage untuk menampilkan gambar */}
      {renderImage(imageUrl)}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {type === 'movie' && (
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{releaseYear}</Text>
            <Text style={styles.metaText}> • </Text>
            <Text style={styles.metaText}>{runtime}</Text>
            <Text style={styles.metaText}> • </Text>
            <Text style={styles.metaText}>{genres}</Text>
          </View>
        )}
        {type === 'book' && (
          <View>
            <Text style={styles.metaText}>Authors: {authors}</Text>
            <Text style={styles.metaText}>Publisher: {publisher}</Text>
            <Text style={styles.metaText}>Published: {publishedDate}</Text>
          </View>
        )}
        <Text style={styles.metaText}>Genres: {genres}</Text>
        <Text style={styles.metaText}>Rating: {rating}</Text>
        <Text style={styles.sectionTitle}>Storyline</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonContainer}>
          {type === 'movie' && (
            <TouchableOpacity style={styles.trailerButton} onPress={openTrailer}>
              <Text style={styles.buttonText}>Watch Trailer</Text>
            </TouchableOpacity>
          )}
          {isFavorite ? (
            <TouchableOpacity style={styles.favoriteActiveButton} onPress={handleRemoveFavorite}>
              <Text style={styles.buttonText}>Remove Favorite</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.favoriteButton} onPress={handleAddFavorite}>
              <Text style={styles.buttonText}>Add to Favorite</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Modal Notification */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Trailer not available.</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  backButton: { position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 10, borderRadius: 50 },
  contentContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  metaContainer: { flexDirection: 'row', marginBottom: 10 },
  metaText: { color: '#fff', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  description: { fontSize: 14, color: '#ccc', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', marginTop: 10 },
  trailerButton: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 30, flex: 1, marginRight: 10, alignItems: 'center' },
  favoriteButton: { backgroundColor: '#ff6347', paddingVertical: 15, borderRadius: 30, flex: 1 },
  favoriteActiveButton: { backgroundColor: '#333', paddingVertical: 15, borderRadius: 30, flex: 1 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  modalContainer: { backgroundColor: '#333', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalText: { color: '#fff', fontSize: 16, marginBottom: 20 },
  modalCloseButton: { backgroundColor: '#ff6347', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  modalCloseText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  iconContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Warna latar belakang saat gambar tidak tersedia
  },
});

export default DetailScreen;
