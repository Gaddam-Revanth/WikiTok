import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { searchArticles, getRandomArticles } from "../services/wikipediaService";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Compass, Search, Info } from "lucide-react";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();


  useEffect(() => {
    const query = searchParams.get("q");
    if (open && query && location.pathname !== "/discover") {
      const decodedQuery = decodeURIComponent(query);
      setSearchValue(decodedQuery);
    }
  }, [searchParams, location.pathname, open]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: () => searchArticles(searchValue),
    enabled: searchValue.length > 0,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
  });

  const handleArticleSelect = (title: string, selectedArticle: any) => {
    setOpen(false);
    toast({
      title: "Loading articles",
      description: `Loading articles about ${title}...`,
      duration: 2000,
    });
    
    const reorderedResults = [
      selectedArticle,
      ...(searchResults || []).filter(article => article.id !== selectedArticle.id)
    ];
    
    navigate(`/?q=${encodeURIComponent(title)}`, {
      state: { reorderedResults }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchValue("");
    }
  };

  const handleRandomArticle = async () => {
    setSearchValue(""); // Clear search value when getting random article
    toast({
      title: "Loading random article",
      description: "Finding something interesting for you...",
      duration: 2000,
    });
    const randomArticles = await getRandomArticles(3);
    if (randomArticles.length > 0) {
      navigate(`/?q=${encodeURIComponent(randomArticles[0].title)}`, {
        state: { reorderedResults: randomArticles }
      });
    }
  };

  const handleDiscoverClick = () => {
    setSearchValue("");
    if (location.pathname === "/discover") {
      navigate("/", { replace: true }); // Navigate to home and replace history state
    } else {
      navigate("/discover");
    }
  };

  const isDiscoverPage = location.pathname === "/discover";

  return (

      <>
        <div className={`fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 ${
          isDiscoverPage
            ? "bg-black"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}>
          <div 
            className="text-xl font-bold text-wikitok-red cursor-pointer"
            onClick={handleRandomArticle}
          >
            WikiTok
          </div>
          <div 
            className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Search className="w-4 h-4 text-white/60 mr-2" />
            <span className="text-white/60 text-sm">
              {searchValue || "Search articles"}
            </span>
          </div>
          <div className="flex space-x-6">
            <RotateCcw
              className="w-5 h-5 cursor-pointer text-white transition-colors hover:text-wikitok-red"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["articles"] });
                navigate("/");
              }}
            />
            <Compass 
              className={`w-5 h-5 cursor-pointer transition-colors ${
                isDiscoverPage ? "text-wikitok-red" : "text-white"
              }`}
              onClick={handleDiscoverClick}
            />
            <Info
              className="w-5 h-5 cursor-pointer text-white transition-colors hover:text-wikitok-red"
              onClick={() => navigate("/about")}
            />
          </div>
        </div>

        <CommandDialog 
          open={open} 
          onOpenChange={handleOpenChange}
        >
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search articles..." 
              value={searchValue}
              onValueChange={setSearchValue}
              className="border-none focus:ring-0"
            />
            <CommandList className="max-h-[90vh] overflow-y-auto">
              {isLoading === true && (
                <CommandEmpty>Searching...</CommandEmpty>
              )}
              {!isLoading && !searchResults && searchValue?.length > 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {!isLoading && !searchValue && (
                <CommandEmpty>Start typing to search articles</CommandEmpty>
              )}
              {!isLoading && searchResults?.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {!isLoading && searchResults && searchResults.length > 0 && (
                <CommandGroup heading="Articles">
                  {searchResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleArticleSelect(result.title, result)}
                      className="flex items-center p-2 cursor-pointer hover:bg-accent rounded-lg"
                    >
                      <div className="flex items-center w-full gap-3">
                        {result.image && (
                          <img 
                            src={result.image} 
                            alt={result.title}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-lg text-gray-800">{result.title}</div>
                          <div className="text-base text-gray-600 line-clamp-2">
                            {result.content}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </CommandDialog>
      </>

  );
};



export default Navigation;