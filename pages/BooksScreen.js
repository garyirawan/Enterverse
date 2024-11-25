import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('Harry Potter'); // Default query
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0); // Pagination untuk Google Books API
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [query, page]);

  const fetchBooks = async () => {
    try {
      setIsFetchingMore(true);
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${page * 10}&maxResults=10`
      );
      setBooks((prevBooks) => [...prevBooks, ...(response.data.items || [])]);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSearch = (text) => {
    setBooks([]); // Clear previous results
    setQuery(text || 'bestsellers'); // Set default query if input is empty
    setPage(0); // Reset pagination
  };

  const handleEndReached = () => {
    if (!isFetchingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderCard = ({ item }) => {
    const volumeInfo = item.volumeInfo || {};
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('DetailScreen', { item, type: 'book' })
        }
      >
        <Image
          source={{
            uri: volumeInfo.imageLinks
              ? volumeInfo.imageLinks.thumbnail
              : 'https://github.com/user-attachments/assets/e5961e4b-c3bd-4f2b-9353-a8b1b60343e5', // Ganti dengan URL gambar buku default
          }}
          style={styles.image}
        />
        <Text style={styles.cardTitle}>{volumeInfo.title || 'Unknown Title'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Books</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <FontAwesome name="user" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Ionicons name="settings-outline" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search books..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={query}
          onChangeText={(text) => handleSearch(text)}
        />
      </View>

      {/* Books List */}
      {isLoading && page === 0 ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderCard}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore && <ActivityIndicator size="small" color="#4a90e2" />
          }
        />
      )}

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
}

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
    flex: 1,
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#222',
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '30%',
    aspectRatio: 2 / 3,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 12,
    color: '#fff',
    padding: 5,
    textAlign: 'center',
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
