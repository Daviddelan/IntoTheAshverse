import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { likeOtherPost, savePost, deleteSavedPosts } from "@/lib/appwrite/api"
import { checkIsLiked } from "@/lib/utils";
import { fetchCurrentUserData } from '@/lib/appwrite/api';
// import { set } from "react-hook-form";


type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const currentUserDetails = await fetchCurrentUserData();

const PostStatistics = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);

  const [isSaved, setIsSaved] = useState(false);
  
  const currentUser = currentUserDetails?.data;

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(savedPostRecord? true : false);
  }, [currentUser]);


  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let newLikesArray = [...likes];

    const hasLiked = newLikesArray.includes(userId);

    if(hasLiked){
      newLikesArray = newLikesArray.filter((Id) => Id !== userId);
    }
    else{
      newLikesArray.push(userId);
    }

    setLikes(newLikesArray);

    likeOtherPost({ postId: post.$id, likesArray: newLikesArray });
  };






  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

    if (savedPostRecord){
      setIsSaved(false);
      deleteSavedPosts(savedPostRecord.$id);
      return
    }

    const userId = currentUser?.$id;

    savePost(post.$id, userId);
    setIsSaved(true);


    let newLikesArray = [...likes];

    const hasLiked = newLikesArray.includes(userId);

    if(hasLiked){
      newLikesArray = newLikesArray.filter((Id) => Id !== userId);
    }
    else{
      newLikesArray.push(userId);
    }

    setLikes(newLikesArray);

    likeOtherPost({ postId: post.$id, likesArray: newLikesArray });
  };




  

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStatistics;

