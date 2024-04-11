import AppwriteService, {
  appwriteConfig,
  databases,
  storage,
} from "./configure";
import { ID, Query } from "appwrite";



export async function createUserAccount(details: {
  email: string;
  password: string;
  name: string;
  username: string;
}) {
  try {
    const appwriteService = new AppwriteService();
    const newAccountUser = await appwriteService.createAccount(details);

    if (!newAccountUser) {
      throw new Error("User account creation failed");
    }

    return newAccountUser;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error;
  }
}


export async function login(details: { email: string; password: string }) {
  try {
    const appwriteService = new AppwriteService();
    const session = await appwriteService.login(
      details.email,
      details.password
    );
    return session;
  } catch (error) {
    console.error("Error logging in user:", error);
  }
}


export async function getCurrentUser() {
  try {
    const appwriteService = new AppwriteService();
    const response = await appwriteService.getCurrentUser();
    if (!response) {
      throw new Error("No user found");
    }
    return response;

    //return (await currentUser).documents[0];
  } catch (error) {
    console.error("Error getting current user:", error);
  }
}

export async function logout() {
  try {
    const appwriteService = new AppwriteService();
    const response = await appwriteService.logout();
    return response;
  } catch (error) {
    console.error("Error logging out user:", error);
  }
}

export async function userDetails(userId: string) {
  try {
    const appwriteService = new AppwriteService();
    return await appwriteService.userDetailsRecord(userId);
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw error;
  }
}

export async function userIdentity() {
  try {
    const appwriteService = new AppwriteService();
    const response = await appwriteService.userIdentity();
    return response;
  } catch (error) {
    console.error("Failed to get user identity:", error);
    throw error;
  }
}

export async function fetchCurrentUserData() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }
    const userIdString = currentUser.$id.toString();
    const userDetailsStored = await userDetails(userIdString);
    const response = userDetailsStored.find(
      (row) => row.accountId === userIdString
    );

    return response;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
  }
}

export async function uploadPost(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    console.log(uploadedFile);
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const urlToFilefile = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000
    );
    if (!urlToFilefile) {
      throw Error;
    }
    return urlToFilefile;
  } catch (error) {
    console.log(error);
  }
}


export async function deleteFile(fileId: string) {
  try {
    const response = await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    );
    console.log(response);

    return {status : "success", message : "File deleted successfully"};
  } catch (error) {
    console.log(error);
  }
}



export async function createPost(post: {
  userId: any;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
}) {

  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadPost(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = await getFilePreview(uploadedFile.$id);
    console.log(fileUrl);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// function stringToDate(dateString: string): Date {
//   return new Date(dateString);
// }

// // Sort Date objects from recent to past
// function sortDatesRecentToPast(dates: Date[]): Date[] {
//   return dates.sort((a, b) => b.getTime() - a.getTime());
// }

export async function fetchRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,);
    [Query.orderDesc("$createdAt")]


  // const JSONposts = JSON.stringify(posts);
  // const postsArray = JSON.parse(JSONposts);
  // postsArray.documents = postsArray.documents.map((post: any) => {
  //   post.$createdAt = stringToDate(post.$createdAt);
  //   return post;
  // }
  // );
  // postsArray.documents = sortDatesRecentToPast(postsArray.documents);
  // console.log(postsArray);

  
  if(!posts) {
    throw Error;
  }
    return posts;
}



export async function likeOtherPost({ postId, likesArray }: { postId: string, likesArray: any[] }) {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    return response;
  }
  catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPosts(recordId: string) {
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

export async function savePost(postId: string, userId: string) {
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

export async function getPostbyId(postId: string) {
  try {
  const response = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    postId
  );
  if (!response) throw Error;
  return response;
  }
  catch (error) {
    console.log(error);
  }
}


export async function getUsers() {


}
