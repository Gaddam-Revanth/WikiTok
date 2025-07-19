import { useQuery } from "@tanstack/react-query";
import ArticleViewer from "../components/ArticleViewer";
import RightSidebar from "../components/RightSidebar";
import LeftSidebar from "../components/LeftSidebar";
import { getRandomArticles, searchArticles } from "../services/wikipediaService";


 import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("q");
  const [currentArticle, setCurrentArticle] = useState(null);
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles", searchQuery ?? null],
    queryFn: async () => {
      let fetchedArticles;
      if (searchQuery) {
        if (location.state?.reorderedResults) {
          fetchedArticles = location.state.reorderedResults;
       } else {
          fetchedArticles = await searchArticles(searchQuery);
        }
      } else {
        fetchedArticles = await getRandomArticles(3);

      }
      // Filter out articles without images
      return fetchedArticles.filter(article => article.image);
    },
    retry: 1,
  });

  const handleTagClick = (tag: string) => {
    navigate(`/?q=${encodeURIComponent(tag)}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-wikitok-dark">
        <div className="text-white">Loading amazing articles...</div>
      </div>
    );
  }

  if (error || !articles || articles.length === 0) {
    toast({
      title: "Error",
      description: "Failed to load articles. Please try again later.",
      variant: "destructive",
    });
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-wikitok-dark">
        <div className="text-white">Something went wrong. Please try again.</div>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen relative overflow-y-auto">

      <div className="flex h-full">
        <div className="hidden md:block"><LeftSidebar article={currentArticle || articles[0]} onTagClick={handleTagClick} /></div>
        <ArticleViewer 
          articles={articles} 
          onArticleChange={setCurrentArticle}
          containerClassName="flex-grow"
        />
        <div className="hidden md:block"><RightSidebar article={currentArticle || articles[0]} /></div>
      </div>

    </div>
  );
};

export default Index;
