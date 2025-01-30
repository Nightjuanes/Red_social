import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { dataReducer } from "./Datareducer";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { chatprops, DefaultResponse, messageProps, PostProps, UpdateUserParams } from "@/interfaces/postinterface";
import { AuthContext } from "../AutContext";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export interface DataState {
  posts: PostProps[];
  message: messageProps[];

  user: any; // Información del usuario
}

const dataStateDefault: DataState = {
  posts: [],
  message:[],
  user: null,
};

interface DataContextProps {
  state: DataState;
  newPost: (newPost: PostProps) => Promise<DefaultResponse>;
  getPosts: () => void;
  getUser: () => void;
  deletePost: (postId: string) => Promise<DefaultResponse>;
  allposts: () => void;
  addlike: (postId: string) => void;
  addcomment: (postId: string, comment: string) => void;
  updateUser: (params: UpdateUserParams) => Promise<void>;
}

export const DataContext = createContext({} as DataContextProps);

export function DataProvider({ children }: any) {
  const [state, dispatch] = useReducer(dataReducer, dataStateDefault);
  const { state: authState } = useContext(AuthContext);
  const { user } = authState;
  const [messages, setMessages] = useState<messageProps[]>([]);

  // Efecto para cargar los posts y la información del usuario
  useEffect(() => {
    if (user) {
      getUser(); // Obtén la información del usuario
      getPosts();
      allposts(); // Obtén los posts del usuario
    }
  }, [user]);

  useEffect(() => {
    if (!user) return; 
    const unsubscribe = openListener();
    return () => unsubscribe && unsubscribe();
  }, [user])

// Función para crear o recuperar el chat entre dos usuarios
const createOrGetChat = async (userSend: string, userReceive: string) => {
  try {
    const chatRef = collection(db, 'chats');

    // Consultamos si ya existe un chat entre los dos usuarios
    const q = query(chatRef, 
      where('user_send', 'in', [userSend, userReceive]), 
      where('user_receive', 'in', [userSend, userReceive])
    );
    
    const querySnapshot = await getDocs(q);

    // Si el chat ya existe, retornamos el ID del chat
    if (!querySnapshot.empty) {
      const existingChat = querySnapshot.docs[0];
      return existingChat.id;
    }

    // Si no existe, creamos uno nuevo
    const newChatRef = await addDoc(collection(db, 'chats'), {
      user_send: userSend,
      user_receive: userReceive,
      messages: [],
    });

    return newChatRef.id; // Retornamos el ID del nuevo chat creado

  } catch (error) {
    console.error('Error al crear o recuperar el chat: ', error);
    throw new Error('Error al crear o recuperar el chat.');
  }
};
    
  const sendMessage = async (chatId: string, message: messageProps) => {
    try {
      // Referencia al documento de la conversación
      const chatRef = doc(db, "chats", chatId);
  
      // Añadir el nuevo mensaje al array de mensajes en la conversación
      await updateDoc(chatRef, {
        messages: arrayUnion(message) 
      });
  
      console.log("Message sent to chat ID: ", chatId);
    } catch (error) {
      console.error("Error sending message: ", error);
      throw error;
    }
  };
  




  
  const openListener = () => {  
    const messageRef = collection(db, "message");
    
    const unsubscribe = onSnapshot(messageRef, (snapshot) => {
      const newmessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(newmessages as any);
      

        
      },(error:any)=>{
        console.error("Error fetching messages message:", error)
      });

    return unsubscribe;
  }

  const uploadImage = async (uri: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, "posts/" + Date.now());
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url ?? "";
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId: string): Promise<DefaultResponse> => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      dispatch({ type: "deletepost", payload: postId });

      return {
        isSuccess: true,
        message: "Post eliminado con éxito",
      };
    } catch (error) {
      console.log("Error eliminando post: ", error);
      return {
        isSuccess: false,
        message: "Hubo un error: " + error,
      };
    }
  };

  const uploadProfileImage = async (uri: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, "profile/" + Date.now());
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url ?? "";
    } catch (error) {
      console.log(error);
    }
  };

  const newPost = async (newPost: PostProps): Promise<DefaultResponse> => {
    try {
      const urlImage = await uploadImage(newPost.image);
      const docRef = doc(collection(db, "posts"));
      await setDoc(docRef, {
        ...newPost,
        id: docRef.id,
        image: urlImage,
        date: new Date(),
        username: user.email,
        postedBy: user.uid,
        likes: 0,
      });
      dispatch({ type: "addPost", payload: { ...newPost, id: docRef.id, image: urlImage } });
      return {
        isSuccess: true,
        message: "Creado con éxito",
      };
    } catch (error) {
      console.log(error);
      return {
        isSuccess: false,
        message: "Hubo un error: " + error,
      };
    }
  };

  const updateUser = async ({ name, lastname, image }: UpdateUserParams): Promise<void> => {
    const { uid } = user;

    try {
      const imageUrl = image ? await uploadProfileImage(image) : user.image || "";

      await setDoc(
        doc(db, "Users", uid),
        { name, lastname, image: imageUrl },
        { merge: true }
      );

      dispatch({
        type: "setUser",
        payload: {
          ...user,
          name,
          lastname,
          image: imageUrl,
        },
      });

      console.log("Usuario actualizado correctamente");
    } catch (error) {
      console.log("Error actualizando usuario: ", error);
      throw error;
    }
  };

  const getPosts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("postedBy", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch({ type: "getPosts", payload: posts });
    } catch (error) {
      console.log("Error obteniendo posts: ", error);
    }
  };


  const allposts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const querySnapshot = await getDocs(postsRef);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: "allposts", payload: posts });
    } catch (error) {
      console.log("Error obteniendo posts: ", error);
    }
  };


  const getUser = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          dispatch({ type: "setUser", payload: userDoc.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting user: ", error);
      }
    }
  };

  const addcomment = async (postId: string, comment: string) => {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const currentComments = docSnap.data().comments || [];
        const updatedComments = Array.isArray(currentComments) ? [...currentComments, comment] : [comment];
  
        await updateDoc(docRef, { comments: updatedComments });
  
        // Return the updated post data directly
        return { ...docSnap.data(), comments: updatedComments };
      } else {
        console.log("Post not found");
        return null;
      }
    } catch (error) {
      console.log("Error adding comment: ", error);
      return null;
    }
  };
  
  const addlike = async (postId: string) => {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const updatedLikes = docSnap.data().likes + 1;
        await updateDoc(docRef, { likes: updatedLikes });
  
        // Return the updated post data directly
        return { ...docSnap.data(), likes: updatedLikes };
      } else {
        console.log("Post not found");
        return null;
      }
    } catch (error) {
      console.log("Error adding like: ", error);
      return null;
    }
  };
  


  return (
    <DataContext.Provider
      value={{
        state,
        newPost,
        getPosts,
        getUser,
        allposts,
        updateUser,
        deletePost,
        addlike,
        addcomment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
function dispatch(arg0: { type: string; payload: PostProps[]; }) {
  throw new Error("Function not implemented.");
}

