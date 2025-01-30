import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput, SafeAreaView } from 'react-native';
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { messageProps } from '@/interfaces/postinterface';
import { getAuth } from 'firebase/auth';

export default function Message() {
  const [users, setUsers] = useState<any[]>([]); // Estado para almacenar los usuarios
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Usuario seleccionado
  const [newMessage, setNewMessage] = useState(''); // Estado para nuevo mensaje
  const [messages, setMessages] = useState<messageProps[]>([]); // Estado para almacenar los mensajes
  
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : ''; // ID del usuario autenticado
  
  // Obtener los usuarios existentes desde Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'Users')); // Suponiendo que tienes una colección de 'Users'
        const usersData = usersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.id !== currentUserId); // Filtrar el usuario actual
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, [currentUserId]); // Dependencia para que se actualice si currentUserId cambia

  // Función para enviar un mensaje
  const sendMessage = async (chatId: string, message: messageProps) => {
    try {
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        messages: arrayUnion(message),
      });
      console.log("Message sent to chat ID: ", chatId);
    } catch (error) {
      console.error("Error sending message: ", error);
      throw error;
    }
  };

  // Verificar si el chat existe o crearlo si no
  const getOrCreateChat = async (recipientId: string) => {
    try {
      const chatQuery = query(
        collection(db, 'chats'),
        where('users', 'array-contains', currentUserId)
      );
      const chatsSnapshot = await getDocs(chatQuery);
      const chat = chatsSnapshot.docs.find(doc => {
        const data = doc.data();
        return data.users.includes(recipientId);
      });
      if (chat) {
        return chat.id;
      } else {
        const newChatRef = await addDoc(collection(db, 'chats'), {
          users: [currentUserId, recipientId],
          messages: [],
        });
        return newChatRef.id;
      }
    } catch (error) {
      console.error("Error creating or fetching chat: ", error);
      throw error;
    }
  };

  // Manejar el envío del mensaje
  const handleSendMessage = async () => {
    if (selectedUser && newMessage) {
      const messageData: messageProps = {
        message: newMessage,
        time: new Date(),
        user_send: currentUserId, // ID del usuario que envía el mensaje
        user_receive: selectedUser, // ID del usuario que recibe el mensaje
      };
      try {
        const chatId = await getOrCreateChat(selectedUser);
        await sendMessage(chatId, messageData);
        setNewMessage('');
      } catch (error) {
        console.error("Error handling send message: ", error);
      }
    } else {
      console.error("No user selected or message is empty");
    }
  };

  // Obtener mensajes del chat seleccionado
  const fetchMessages = async (chatId: string) => {
    const chatRef = doc(db, 'chats', chatId);
    onSnapshot(chatRef, (doc) => {
      const data = doc.data();
      if (data && data.messages) {
        setMessages(data.messages); // Actualiza el estado con los mensajes del chat
      }
    });
  };

  // Manejar la selección de usuario
  const handleUserSelect = async (userId: string) => {
    setSelectedUser(userId);
    const chatId = await getOrCreateChat(userId); // Obtener o crear el chat
    fetchMessages(chatId); // Obtener mensajes del chat
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mensajes</Text>
      <Text style={styles.subtitle}>Selecciona un usuario:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name} // Suponiendo que los usuarios tienen un campo "name"
            onPress={() => handleUserSelect(item.id)} // Actualizar la función de selección
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      {selectedUser && (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()} // Puedes usar un índice como key si los mensajes no tienen ID únicos
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text style={item.user_send === currentUserId ? styles.myMessage : styles.receivedMessage}>
                  {item.message}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.messageList}
          />
          <TextInput
            placeholder="Escribe tu mensaje..."
            value={newMessage}
            onChangeText={setNewMessage}
            style={styles.input}
          />
          <Button title="Enviar mensaje" onPress={handleSendMessage} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  messageContainer: {
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  timestamp: {
    fontSize: 10,
    color: '#aaa',
  },
  messageList: {
    flexGrow: 1,
    paddingBottom: 10,
  },
});
