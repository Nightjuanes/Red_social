export interface PostProps {

    id?: string,
    address: string,
    description: string,
    image: string,
    date: Date,
    username?: string,
    postedBy?: string,
    likes?: number,
    comments?: string[],
}
export interface messageProps {
    message: string;
    time: Date;
    user_send: string;
    user_receive: string;
}

export interface chatprops {
    user_send: string;
    user_receive: string;
    messages: messageProps[];
}

export interface DefaultResponse {
    isSuccess: boolean;
    message: string;
}
export interface UserData {
    username: string;
    name: string;
    lastname: string;
    image: string;
    
  }
  export interface UpdateUserParams {
    name: string;
    lastname: string;
    image?: string; // Se mantiene opcional si no se desea actualizar
  }
  export type StackParamList = {
    index: undefined; // No parameters for the profile screen
    editprofile: undefined; // No parameters for edit profile screen
    postdetail: { post: PostProps }; // Parameters for post detail screen
  };
