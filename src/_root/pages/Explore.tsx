import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";
import  GridPostList  from "@/components/shared/gridpost";
import Loader from "@/components/shared/Loadingside";
import { useGetUserPosts, useSearchPosts } from "@/lib/my-react-queries/queriesdiff";
import useDebounce from "@/hooks/useDebounce";
import { Models } from "appwrite";
import SearchResults from "@/components/shared/searrches";

const Explore = () => {
const { ref, inView } = useInView();
const { data: postsData } = useGetUserPosts();
const hasPostsNextPage: any = true // Fix: Update the type of postsData
const [searchValue, setSearchValue] = useState("");
const debouncedSearchValue = useDebounce(searchValue, 500);
useSearchPosts(debouncedSearchValue);

useEffect(() => {
    if (inView && !searchValue && hasPostsNextPage) {
        fetchNextPostsPage();
    }
}, [inView, searchValue, hasPostsNextPage]);

const fetchNextPostsPage = () => {
    // Implement logic to fetch next page of user posts
};

  const renderPosts = () => {
    if (!postsData) {
        return <Loader />;
    }

    const { pages } = postsData as unknown as { pages: any[] };

    const shouldShowSearchResults = searchValue !== "";
    const shouldShowPosts = !shouldShowSearchResults && pages.every((page) => page.documents.length === 0);

    if (shouldShowSearchResults) {
        return (
            <SearchResults isSearchingFetching={false} searchedPosts={[]}            />
        );
    } else if (shouldShowPosts) {
        return <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>;
    } else {
        return pages.map((page: { documents: Models.Document[]; }, index: any) => (
            <GridPostList key={`page-${index}`} posts={page.documents} />
        ));
    }
  };

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold w-full">Search For A Post</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search for a post"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16">
        <h3 className="body-bold md:h3-bold"> Trending</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-x1 px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="Filter"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5x1">
        {renderPosts()}
      </div>
      {hasPostsNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
