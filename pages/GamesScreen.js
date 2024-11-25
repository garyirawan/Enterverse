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

export default function GamesScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [page, query]);

  const fetchGames = async () => {
    try {
      setIsFetchingMore(true);
      const response = await axios.get(
        `https://api.rawg.io/api/games?key=c99b20d375e24b9299bafa42106ee74c&search=${query}&page=${page}`
      );
      setGames((prevGames) => [...prevGames, ...response.data.results]);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch = (text) => {
    setGames([]); // Clear previous results
    setQuery(text); // Update query
    setPage(1); // Reset pagination
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailScreen', { item, type: 'game' })}
    >
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{item.rating ? item.rating.toFixed(1) : 'N/A'}</Text>
      </View>
      <Image
        source={{
          uri: item.background_image
            ? item.background_image
            : 'https://via.placeholder.com/150',
        }}
        style={styles.image}
      />
      <Text style={styles.cardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Games</Text>
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
          placeholder="Search games..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={query}
          onChangeText={(text) => handleSearch(text)}
        />
      </View>

      {/* Games List */}
      {isLoading && page === 1 ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
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
  ratingBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 1,
  },
  ratingText: {
    fontSize: 10,
    color: '#fff',
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
