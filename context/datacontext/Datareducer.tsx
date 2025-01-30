import { DataState } from "./DataContext";

type ActionsProps =
  | { type: "login"; payload: any }
  | { type: "getPosts"; payload: any[] } // Nueva acción para obtener posts
  | { type: "addPost"; payload: any }   // Nueva acción para añadir un post
  | { type: "deletepost"; payload: any }
  | { type: "setUser"; payload: any }
  | { type: "upadateuser"; payload: any }
  | { type: "addcomment"; payload: any }
  | { type: "allposts"; payload: any };

  

export const dataReducer = (state: DataState, actions: ActionsProps): DataState => {
  switch (actions.type) {
    case "login":
      return {
        ...state,
        user: actions.payload, // Manejo del login
      };
      case "deletepost":
        return {
          ...state,
          posts: state.posts.filter(post => post.id !== actions.payload), // Filtra el post eliminado
        };
      case "upadateuser":
        return {
          ...state,
          user: actions.payload, 
        };


    case "getPosts":
      return {
        ...state,
        posts: actions.payload, // Actualiza el estado con los posts obtenidos
      };

    case "allposts":
      return {
        ...state,
        posts: actions.payload, // Actualiza el estado con los posts obtenidos
      };

    case "addPost":
      return {
        ...state,
        posts: [actions.payload, ...state.posts], // Añade el nuevo post al estado
      };
    case "setUser":
      return {
        ...state,
        user: actions.payload,
      };
    default:
      return state;
  }
};
