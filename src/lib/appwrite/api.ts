import { IUpdatePost, IUpdateUser } from "@/types";
import AppwriteService, {
  appwriteConfig,
  databases,
  storage,
  account
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

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}



export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
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
    const response = await storage.deleteFile(appwriteConfig.storageId, fileId);
    console.log(response);

    return { status: "success", message: "File deleted successfully" };
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
    const uploadedFile = await uploadPost(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = await getFilePreview(uploadedFile.$id);
    console.log(fileUrl);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

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
    appwriteConfig.postsCollectionId
  );
  [Query.orderDesc("$createdAt")];

  // const JSONposts = JSON.stringify(posts);
  // const postsArray = JSON.parse(JSONposts);
  // postsArray.documents = postsArray.documents.map((post: any) => {
  //   post.$createdAt = stringToDate(post.$createdAt);
  //   return post;
  // }
  // );
  // postsArray.documents = sortDatesRecentToPast(postsArray.documents);
  // console.log(postsArray);

  if (!posts) {
    throw Error;
  }
  return posts;
}

export async function likeOtherPost({
  postId,
  likesArray,
}: {
  postId: string;
  likesArray: any[];
}) {
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
  } catch (error) {
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
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function update(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadPost(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id); // Await the getFilePreview function
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function postuser(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function InfinityScroll({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function search(find: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", find)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function postdeletion(idofpost?: string, idofimage?: string) {
  if (!idofpost || !idofimage) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      idofpost
    );

    if (!statusCode) throw Error;

    await deleteFile(idofimage);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function usersId(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function userUpdate(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadPost(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers() {}
