import { View, Text, FlatList, Image, StyleSheet, Button, SafeAreaView, TextInput } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'expo-router';
import { db } from '@/firebaseConfig';
import { DataContext } from '@/context/datacontext/DataContext';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const { addcomment, addlike } = useContext(DataContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <View style={styles.messageButtonContainer}>
        <Link href={"/tabs/home/message"} asChild>
          <Button title="Ir a Mensajes" onPress={() => {}} />
        </Link>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.username}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.postDescription}>{item.description}</Text>

            <View style={styles.commentsContainer}>
              <Text style={styles.commentsTitle}>Comentarios:</Text>
              {(Array.isArray(item.comments) ? item.comments : []).map((comment: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                <View key={index} style={styles.commentBubble}>
                  <Text style={styles.commentText}>{comment}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.likesText}>Likes: {item.likes}</Text>

            <TextInput
              placeholder="Añadir un comentario..."
              value={newComment}
              onChangeText={setNewComment}
              style={styles.input}
            />
            <Button title="Comentar" onPress={() => addcomment(item.id, newComment)} />

            <Button title="Like" onPress={() => addlike(item.id)} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  messageButtonContainer: {
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 10,
  },
  postDescription: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  commentsContainer: {
    marginTop: 15,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  commentBubble: {
    backgroundColor: '#f0f0f5',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  likesText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  listContent: {
    paddingBottom: 20,
  },
});
