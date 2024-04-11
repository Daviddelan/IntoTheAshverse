import { useState, useEffect } from 'react';
import { Models } from 'appwrite';
import  UserCard  from '@/components/shared/usercard';
import Loadingside from '@/components/shared/Loadingside';
import PostCard from '@/components/shared/Postcard';

import { fetchRecentPosts} from '@/lib/appwrite/api';

const Home = () => {
  const [posts, setPosts] = useState<Models.Document[]>([]);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(true);
  const [isErrorPosts, setIsErrorPosts] = useState<boolean>(false);

  const [creators] = useState<Models.Document[]>([]);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isErrorCreators, setIsErrorCreators] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchRecentPosts();
        setPosts(response.documents || []);
      } catch (error) {
        setIsErrorPosts(true);
      } finally {
        setIsPostLoading(false);
      }
    };
  

    const fetchCreators = async () => {
      try {
        //const response = await getUsers<Models.DocumentList<Models.Document>>();
        //setCreators(response.data?.documents || []);
      } catch (error) {
        setIsErrorCreators(true);
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchPosts();
    fetchCreators();
  }, []);


  

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Failed to fetch recent posts</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  if (isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loadingside />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts.map((post) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Failed to fetch users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loadingside />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts.map((post) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loadingside />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
