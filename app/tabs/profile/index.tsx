import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { DataContext } from '@/context/datacontext/DataContext';
import { PostProps } from "@/interfaces/postinterface"; 
import { Link, useRouter } from 'expo-router';

const Profile = () => {
  const { state, getPosts, getUser } = useContext(DataContext);
  const { user, posts } = state;
  const router = useRouter();

  useEffect(() => {
    const fetchPostsAndUser = async () => {
      if (user) {
        try {
          await getUser(); 
          await getPosts();
        } catch (error) {
          Alert.alert("Error", "No se pudieron cargar los posts o la información del usuario.");
        }
      }
    };

    fetchPostsAndUser();
  }, [user]);

  if (!posts || !user) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderItem = ({ item }: { item: PostProps }) => (
    <TouchableOpacity

    >
      <View style={styles.postContainer}>
        <Image source={{ uri: Array.isArray(item.image) ? item.image[0] : item.image }} style={styles.image} />
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          <Image source={{ uri: user.image }} style={styles.profileImage} />
          <Text style={styles.userEmail}>{user.email}</Text>
          <TouchableOpacity style={styles.button}>
            <Link href="/tabs/profile/editprofile" style={styles.buttonText}>Editar perfil</Link>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.title}>Mis Posts ({posts.length})</Text>
      
      <FlatList
        data={posts}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  userInfoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  postContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  description: {
    padding: 5,
    fontSize: 14,
    color: '#555',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 9,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Profile;
