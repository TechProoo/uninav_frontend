"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blog, BlogResponse } from "@/lib/types/response.type";
import { useEffect, useState } from "react";
import allBlog from "@/api/allBlog";
import BlogCard from "./blogCard";

export function TabsDemo() {
  const [allBlogs, setAllBlogs] = useState<BlogResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const blogs = await allBlog();
        console.log(blogs);
        if (blogs) {
          setAllBlogs(blogs);
        }
      } catch (err) {
        console.error("Error fetching Blogs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (allBlogs?.data.length === 0) {
    return <h1>There are no blogs available</h1>;
  }

  // Filter blogs by category
  const filterBlog = (cat: string) => {
    return allBlogs?.data.filter((blog) => blog.type === cat) ?? [];
  };

  const filteredBlogs = {
    all: allBlogs?.data,
    article: filterBlog("article"),
    scheme: filterBlog("scheme_of_work"),
    guideline: filterBlog("guideline"),
    tutorial: filterBlog("tutorial"),
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="overflow-x-auto scrollbar-hide w-full">
        <TabsList className="flex w-max gap-4 px-2 md:grid md:grid-cols-5 md:w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="scheme">Scheme</TabsTrigger>
          <TabsTrigger value="guideline">Guideline</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content - All */}
      <TabsContent value="all">
        {filteredBlogs.all?.length === 0 ? (
          <h2 className="text-lg font-semibold text-gray-700">
            No blogs available in this category
          </h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredBlogs.all?.map((blog: Blog) => (
              <BlogCard key={blog.id} data={blog} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Tab Content - Article */}
      <TabsContent value="article">
        {filteredBlogs.article?.length === 0 ? (
          <h2>No blogs available in this category</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredBlogs.article?.map((blog: Blog) => (
              <BlogCard key={blog.id} data={blog} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Tab Content - Scheme */}
      <TabsContent value="scheme">
        {filteredBlogs.scheme?.length === 0 ? (
          <h2>No blogs available in this category</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredBlogs.scheme?.map((blog: Blog) => (
              <BlogCard key={blog.id} data={blog} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Tab Content - Guideline */}
      <TabsContent value="guideline">
        {filteredBlogs.guideline?.length === 0 ? (
          <h2>No blogs available in this category</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredBlogs.guideline?.map((blog: Blog) => (
              <BlogCard key={blog.id} data={blog} />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Tab Content - Tutorial */}
      <TabsContent value="tutorial">
        {filteredBlogs.tutorial?.length === 0 ? (
          <h2>No blogs available in this category</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredBlogs.tutorial?.map((blog: Blog) => (
              <BlogCard key={blog.id} data={blog} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
