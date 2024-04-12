import Loader from "@/components/shared/Loadingside";
import GridPost from "@/components/shared/gridpost";
import { Models } from "appwrite";


type SearchProps = {
    isSearchingFetching: boolean;
    searchedPosts: Models.Document[];
}

const SearchResults = ({isSearchingFetching, searchedPosts}: SearchProps) => {
    if(isSearchingFetching)
    return <Loader />

    if(searchedPosts && searchedPosts.length > 0) 
        return <GridPost posts={searchedPosts} />

    return(
    <p className="text-light-4 mt-10 text-center w-full">No Results.Whoops</p>
    )
}
export default SearchResults;