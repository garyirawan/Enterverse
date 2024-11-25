import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState({}); // Store genres mapping

  useEffect(() => {
    fetchGenres(); // Fetch genre names
    fetchMovies();
    fetchBooks();
    fetchGames();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=9634e103c05aa8d8623d8a6385ecd62c&language=en-US'
      );
      const genresArray = response.data.genres;
      const genresMap = {};
      genresArray.forEach((genre) => {
        genresMap[genre.id] = genre.name;
      });
      setGenres(genresMap); // Save genres as an object for quick lookup
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/movie/popular?api_key=9634e103c05aa8d8623d8a6385ecd62c&language=en-US&page=1'
      );
      setMovies(response.data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=api');
      setBooks(response.data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get(
        'https://api.rawg.io/api/games?key=c99b20d375e24b9299bafa42106ee74c'
      );
      setGames(response.data.results || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const renderBigCard = (item, type) => {
    let imageUrl, title, genresDisplay;
    if (type === 'movie') {
      imageUrl = `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`;
      title = item.title || item.name;
      genresDisplay = item.genre_ids
        .map((id) => genres[id]) // Map genre IDs to genre names
        .join(', ');
    } else if (type === 'book') {
      imageUrl =
        item.volumeInfo && item.volumeInfo.imageLinks
          ? item.volumeInfo.imageLinks.thumbnail
          : 'https://via.placeholder.com/300x200';
      title = item.volumeInfo ? item.volumeInfo.title : 'No Title';
      genresDisplay =
        item.volumeInfo && item.volumeInfo.categories ? item.volumeInfo.categories.join(', ') : 'N/A';
    } else if (type === 'game') {
      imageUrl = item.background_image || 'https://via.placeholder.com/300x200';
      title = item.name || 'No Name';
      genresDisplay = item.genres ? item.genres.map((genre) => genre.name).join(', ') : 'N/A';
    }

    return (
      <TouchableOpacity
        key={item.id || item.key}
        style={styles.bigCard}
        onPress={() => navigation.navigate('DetailScreen', { item, type })}
      >
        <Image source={{ uri: imageUrl }} style={styles.bigCardImage} />
        <View style={styles.bigCardContent}>
          <Text style={styles.bigCardTitle}>{title}</Text>
          <Text style={styles.bigCardSubtitle}>{genresDisplay || 'N/A'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enterverse</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <FontAwesome name="user" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Ionicons name="settings-outline" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView>
        {/* Movies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Movies</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MoviesScreen')}>
              <View style={styles.viewMoreButton}>
                <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
                <Text style={styles.viewMoreText}>View More</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={movies}
            renderItem={({ item }) => renderBigCard(item, 'movie')}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Books Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Books</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BooksScreen')}>
              <View style={styles.viewMoreButton}>
                <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
                <Text style={styles.viewMoreText}>View More</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={books}
            renderItem={({ item }) => renderBigCard(item, 'book')}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Games Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Games</Text>
            <TouchableOpacity onPress={() => navigation.navigate('GamesScreen')}>
              <View style={styles.viewMoreButton}>
                <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
                <Text style={styles.viewMoreText}>View More</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={games}
            renderItem={({ item }) => renderBigCard(item, 'game')}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.navItem}>
          <FontAwesome name="home" size={24} color="#fff" />
          <Text style={styles.navbarText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MoviesScreen')} style={styles.navItem}>
          <FontAwesome name="film" size={24} color="#fff" />
          <Text style={styles.navbarText}>Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('BooksScreen')} style={styles.navItem}>
          <FontAwesome name="book" size={24} color="#fff" />
          <Text style={styles.navbarText}>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GamesScreen')} style={styles.navItem}>
          <FontAwesome name="gamepad" size={24} color="#fff" />
          <Text style={styles.navbarText}>Games</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#222',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  bigCard: {
    width: 300,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  bigCardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  bigCardContent: {
    padding: 12,
  },
  bigCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bigCardSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 10,
    borderTopColor: '#333',
    borderTopWidth: 1,
  },
  navbarText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default HomeScreen;
