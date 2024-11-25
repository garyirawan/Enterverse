import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FavoritesContext } from "../components/FavoritesContext";

function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const { favorites } = useContext(FavoritesContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("https://reqres.in/api/users/2");
      const data = await response.json();
      setProfile(data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailScreen", { item, type: item.type })}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name="star" size={70} color="#ffd700" />
      </View>
      <Text style={styles.cardTitle}>{item.title || "No Title"}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
          <Ionicons name="settings-outline" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : (
        profile && (
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: profile.avatar || "https://via.placeholder.com/150",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{`${profile.first_name} ${profile.last_name}`}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        )
      )}

      {/* Favorites Section */}
      <View style={styles.favoritesContainer}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            key={`favorites-${2}`} // Memaksa FlatList untuk rerender
          />
        ) : (
          <Text style={styles.noFavoritesText}>No favorites yet</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#222",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    marginLeft: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#ccc",
  },
  favoritesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: "47%",
    aspectRatio: 0.7,
    backgroundColor: "#222",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: "#fff",
    padding: 5,
    textAlign: "center",
    flexWrap: "wrap",
  },
  noFavoritesText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
