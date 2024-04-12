import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { fetchCurrentUserData } from "@/lib/appwrite/api";
import PostStatistics from "@/components/shared/PostStatistics";



type PostCardProps = {
    post: Models.Document;
};
const currentUserDetails = await fetchCurrentUserData();


const PostCard = ({ post }: PostCardProps) => {

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
            to={`/update-post/${post.$id}`}
            className={`${currentUserDetails && currentUserDetails.id === post.creator.$id && "hidden"}`}>
            <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
            />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

    <PostStatistics post={post} userId={currentUserDetails?.id} />
    </div>
  );
};

export default PostCard;