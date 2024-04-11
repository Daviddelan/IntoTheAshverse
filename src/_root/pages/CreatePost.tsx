import PostForm from "@/components/forms/formToPost";

const CreatePost = () => {
  return (
    <div className="flex flex-1 gap-9 max-w-10xl">
      <div className="common-container">
        <div className="max-w-10xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <PostForm />
      </div>
    </div>
  );
};

export default CreatePost;