import { ID, Account, Client, Avatars, Databases, Storage } from 'appwrite'

export const appwriteConfig = {
    url: import.meta.env.VITE_APPWRITE_URL,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_BUCKET_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_USER_ID,
    postsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_POSTS_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_SAVES_ID,
};

const appwriteClient = new Client()

const APPWRITE_ENDPOINT: string = appwriteConfig.url;
const APPWRITE_PROJECT_ID:string = appwriteConfig.projectId;

export const avatars = new Avatars(appwriteClient)
export const databases = new Databases(appwriteClient)
export const storage = new Storage(appwriteClient)

export const account = new Account(appwriteClient)

type CreateUserAccount = {
    email: string;
    password: string;
    name: string;
    username: string
}

class AppwriteService {
    account;

    constructor(){
        appwriteClient
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)

        this.account = new Account(appwriteClient)
    }


    async createAccount({email, password, name, username}: CreateUserAccount){
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name,
            )
            if (userAccount) {
                const avatarUrl = avatars.getInitials(name);

                const newUserAccount = await this.saveToDatabase({
                    accountId: userAccount.$id,
                    email: userAccount.email,
                    name: userAccount.name,
                    imageUrl: avatarUrl,
                    username: username
                });
                return newUserAccount

                return userAccount;
            } else {
                return null;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount() :: " + error);
            
        }
    }

    async saveToDatabase(user : {accountId:string, email:string, name:string, imageUrl:URL, username?:string}){
        try {
            const response = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                ID.unique(),
                user
            )
            return response
        } catch (error) {
            console.log("Appwrite service :: saveToDatabase() :: " + error);
        }
    }


    async sessionCreate(email: string, password: string){
        try {
            return await this.account.createSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: sessionCreate() :: " + error);
        }
    }

    async login(email:string, password:string){
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.log("Appwrite service :: loginAccount() :: " + error);
            
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite service :: getCurrentAccount() :: " + error);
        }
    }

    async logout(){
        try {
            // const session_id = window.localStorage.getItem("session_id");
            // console.log(session_id, typeof session_id)
            // return await this.account.deleteSession(JSON.parse(session_id!));
            window.localStorage.removeItem("session_id");
            return;


        } catch (error) {
            console.log("Appwrite service :: deleteSession() :: " + error);
        }
    }

    async userDetailsRecord(userId: string) {
        try {
            const promise = databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId);
            const response = await promise;
            console.log(userId)
            return response.documents;
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            throw error;
        }
    }

      async userIdentity(){
        try {
            const promise = this.account.listIdentities();
            const response = await promise;
            return response;
          } catch (error) {
            console.error('Failed to get user identity:', error);
            throw error;
          }
        }

        async likePost(postId: string, likesArray: string[]) {
            try {
              const updatedPost = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.postsCollectionId,
                postId,
                {
                  likes: likesArray,
                }
              );
          
              if (!updatedPost) 
                throw Error;
          
              return updatedPost;
              
            } catch (error) {
              console.log(error);
            }
        }

        async savePost(postId: string, userId: string) {
            try {
              const response = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.savesCollectionId,
                ID.unique(),
                {
                  post: postId,
                  user: userId,
                }
              );
              if (!response) throw Error;
              
              return response;
            } catch (error) {
              console.log(error);
            }
        }

        async deleteSavedPost(recordId: string) {
            try {
              const response = await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.savesCollectionId,
                recordId
              );
              if (!response) throw Error;
              return response;
            } catch (error) {
              console.log(error);
            }
        }

          

    }

export default AppwriteService