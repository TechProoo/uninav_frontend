"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blog, Pagination } from "@/lib/types/response.type";
import { useEffect, useState } from "react";
import { searchBlogs } from "@/api/blog.api";
import BlogCard from "./blogCard";

export function TabsDemo() {
  const [blogs, setBlogs] = useState<Pagination<Blog[]> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const blogs = await searchBlogs();
        if (blogs.status === "success") {
          setBlogs(blogs.data);
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
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );

  if (blogs?.data.length === 0) {
    return <h1>There are no blogs available</h1>;
  }

  // Filter blogs by category
  const filterBlog = (cat: string) => {
    return blogs?.data.filter((blog) => blog.type === cat) ?? [];
  };

  const filteredBlogs = {
    all: blogs?.data,
    article: filterBlog("article"),
    scheme: filterBlog("scheme_of_work"),
    guideline: filterBlog("guideline"),
    tutorial: filterBlog("tutorial"),
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <TabsList className="flex gap-4 md:grid md:grid-cols-5 px-2 w-max md:w-full">
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
          <h2 className="font-semibold text-gray-700 text-lg">
            No blogs available in this category
          </h2>
        ) : (
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
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
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
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
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
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
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
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
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
            {filteredBlogs.tutorial?.map((blog: Blog) => (
              <BlogCard key={blog.id} data={blog} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
