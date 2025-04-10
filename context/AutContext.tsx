import { createContext, useEffect, useReducer } from "react";
import { authReducer, AuthState } from "./autReducer";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

const defaultValues: AuthState = {
    user: undefined,
    isLogged: false,
};

interface AuthContextProps {
    state: any;  
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, username: string, lastname: string) => Promise<void>;
    currentUserId: () => string | undefined; // Add this line
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const auth = getAuth();
    const [state, dispatch] = useReducer(authReducer, defaultValues);

    useEffect(() => {
        console.log(state);
    }, [state]);

    const login = async (email: string, password: string) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const docRef = doc(db, "Users", response.user.uid);
            const docSnap = await getDoc(docRef);
            dispatch({
                type: "LOGIN",
                payload: response.user,
            });
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error during login:", error);
            throw error; // Re-lanzar el error para manejarlo en el componente
        }
    };

    const signup = async (email: string, password: string, name: string, lastname: string, username: string) => {
        try {
            // Verificar si el nombre de usuario ya existe
            const q = query(collection(db, "Users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                throw new Error("El nombre de usuario ya está en uso");
            }

            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            const uid = user.uid;

            await setDoc(doc(db, "Users", uid), {
                name,
                lastname,
                username,
                photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                email,
            });

            dispatch({ type: "LOGIN", payload: response.user });
        } catch (error) {
            console.log(error);
        }
    };

    // Function to get current user ID
    const currentUserId = () => {
        return state.user ? state.user.uid : undefined;
    };

    return (
        <AuthContext.Provider 
            value={{
                state,
                login,
                signup,
                currentUserId, // Add this line
            }}
        >     
            {children}
        </AuthContext.Provider>
    );
};
