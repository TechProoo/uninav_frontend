"use client";
import React, { useEffect, useState, KeyboardEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectCourse } from "@/components/search/selectCourse";
import {
  searchMaterialsLoggedIn,
  searchMaterialsNotLoggedIn,
} from "@/api/material.api";
import { searchBlogs } from "@/api/blog.api";
import {
  Blog,
  BlogType,
  Material,
  MaterialTypeEnum,
  Pagination,
  RestrictionEnum,
  VisibilityEnum,
} from "@/lib/types/response.type";
import MaterialGrid from "@/components/materials/MaterialGrid";
import BlogGrid from "@/components/blog/BlogGrid";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  BookOpen,
  FileText,
  Tag,
  Grid,
  List,
  Info,
  Wand2,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Blog type options for filtering
const blogTypeOptions = [
  { value: "article", label: "Article" },
  { value: "scheme_of_work", label: "Scheme of Work" },
  { value: "guideline", label: "Guideline" },
  { value: "tutorial", label: "Tutorial" },
];

// Material type options for filtering
const materialTypeOptions = [
  { value: MaterialTypeEnum.PDF, label: "PDF" },
  { value: MaterialTypeEnum.VIDEO, label: "Video" },
  { value: MaterialTypeEnum.ARTICLE, label: "Article" },
  { value: MaterialTypeEnum.IMAGE, label: "Image" },
  { value: MaterialTypeEnum.OTHER, label: "Other" },
];

// Visibility options for filtering
const visibilityOptions = [
  { value: VisibilityEnum.PUBLIC, label: "Public" },
  { value: VisibilityEnum.PRIVATE, label: "Private" },
];

// Restriction options for filtering
const restrictionOptions = [
  { value: RestrictionEnum.DOWNLOADABLE, label: "Downloadable" },
  { value: RestrictionEnum.READONLY, label: "Read Only" },
];

const ExplorePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const searchMaterialsApi = user
    ? searchMaterialsLoggedIn
    : searchMaterialsNotLoggedIn;
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const courseId = searchParams.get("courseId");
  const defaultTab = searchParams.get("defaultTab");

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab === "blogs" ? "blogs" : "materials"
  );

  // State for view mode (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Add state for advanced search
  const [advancedSearch, setAdvancedSearch] = useState<boolean>(false);
  const [showAdvancedSearchInfo, setShowAdvancedSearchInfo] =
    useState<boolean>(false);

  // State for search inputs
  const [searchQuery, setSearchQuery] = useState<string>(query || "");
  // State for material filters
  const [materialType, setMaterialType] = useState<string>("");
  const [materialTag, setMaterialTag] = useState<string>("");
  const [materialCourse, setMaterialCourse] = useState<string>(courseId || "");
  const [materialVisibility, setMaterialVisibility] = useState<string>("");
  const [materialRestriction, setMaterialRestriction] = useState<string>("");
  const [showMaterialFilters, setShowMaterialFilters] =
    useState<boolean>(false);

  // State for blog filters
  const [blogType, setBlogType] = useState<string>("");
  const [blogTag, setBlogTag] = useState<string>("");
  const [showBlogFilters, setShowBlogFilters] = useState<boolean>(false);

  // State to track if blogs have been loaded at least once
  const [blogContentLoaded, setBlogContentLoaded] = useState<boolean>(false);

  // State for pagination
  const [materialPage, setMaterialPage] = useState<number>(1);
  const [blogPage, setBlogPage] = useState<number>(1);
  const [materialTotalPages, setMaterialTotalPages] = useState<number>(1);
  const [blogTotalPages, setBlogTotalPages] = useState<number>(1);

  // State for loading and results
  const [isLoadingMaterials, setIsLoadingMaterials] = useState<boolean>(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState<boolean>(false);
  const [materials, setMaterials] = useState<Pagination<Material[]> | null>(
    null
  );
  const [blogs, setBlogs] = useState<Pagination<Blog[]> | null>(null);

  // Toggle view mode between grid and list
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  // Toggle advanced search mode
  const toggleAdvancedSearch = (checked: boolean) => {
    if (checked && !advancedSearch) {
      setShowAdvancedSearchInfo(true); // Show info dialog when enabling
    }
    setAdvancedSearch(checked);
  };

  // Fetch materials with filters
  const fetchMaterials = async (page = materialPage) => {
    setIsLoadingMaterials(true);
    try {
      const response = await searchMaterialsApi({
        query: searchQuery,
        page,
        limit: 10,
        tag: materialTag || undefined,
        courseId: materialCourse || undefined,
        type: materialType || undefined,
        advancedSearch: advancedSearch || undefined,
      });

      if (response && response.status === "success") {
        setMaterials(response.data);
        setMaterialTotalPages(response.data.pagination?.totalPages || 1);
        return;
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      // Only show toast from catch block, remove the duplicate toast
      const err = error as Error;
      toast.error(err?.message || "Failed to fetch materials");
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  // Fetch blogs with filters
  const fetchBlogs = async (page = blogPage) => {
    setIsLoadingBlogs(true);
    try {
      const response = await searchBlogs({
        query: searchQuery,
        page,
        type: (blogType as BlogType) || undefined,
      });

      setBlogs(response.data);
      setBlogTotalPages(response.data.pagination?.totalPages || 1);
      setBlogContentLoaded(true);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Show only one toast message
      const err = error as Error;
      toast.error(err?.message || "Failed to fetch blogs");
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  // Handle search for active tab
  const handleSearch = () => {
    if (advancedSearch) {
      toast("Using advanced search - this may take longer", {
        icon: "🔎",
        duration: 3000,
      });
    }

    if (activeTab === "materials") {
      setMaterialPage(1);
      fetchMaterials(1);
    } else {
      setBlogPage(1);
      fetchBlogs(1);
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Clear all filters for materials
  const clearMaterialFilters = () => {
    setMaterialType("");
    setMaterialTag("");
    setMaterialCourse("");
    setMaterialVisibility("");
    setMaterialRestriction("");
    setMaterialPage(1);
    fetchMaterials(1);
  };

  // Clear all filters for blogs
  const clearBlogFilters = () => {
    setBlogType("");
    setBlogTag("");
    setBlogPage(1);
    fetchBlogs(1);
  };

  // Handle material click to navigate to detail page
  const handleMaterialClick = (material: Material) => {
    router.push(`/material/${material.id}`);
  };

  // Handle blog click to navigate to detail page
  const handleBlogClick = (blog: Blog) => {
    router.push(`/blogs/${blog.id}`);
  };

  // Initial fetch when component mounts or when URL parameters change
  useEffect(() => {
    // Set state from URL parameters
    if (query) {
      setSearchQuery(query);
    }

    if (courseId) {
      setMaterialCourse(courseId);
      // If courseId is provided, automatically show the materials tab and show filters
      setActiveTab("materials");
      setShowMaterialFilters(true);
    }

    // Perform initial search if query or courseId is present
    if (query || courseId) {
      if (activeTab === "materials") {
        fetchMaterials();
      } else if (query) {
        fetchBlogs();
      }
    }
  }, [query, courseId]);

  // Effect to handle tab changes and initial data loading
  useEffect(() => {
    if (activeTab === "blogs" && !blogContentLoaded) {
      // Only fetch blogs if they haven't been loaded yet
      fetchBlogs();
    } else if (activeTab === "materials" && !materials) {
      // Load materials if not loaded yet
      fetchMaterials();
    }
  }, [activeTab]);

  // Update when material filters change
  useEffect(() => {
    if (activeTab === "materials") {
      fetchMaterials();
    }
  }, [materialPage]);

  // Update when blog filters change
  useEffect(() => {
    if (activeTab === "blogs") {
      fetchBlogs();
    }
  }, [blogPage]);

  // Active filter count helpers
  const getActiveMaterialFiltersCount = () => {
    let count = 0;
    if (materialType) count++;
    if (materialTag) count++;
    if (materialCourse) count++;
    if (materialVisibility) count++;
    if (materialRestriction) count++;
    return count;
  };

  const getActiveBlogFiltersCount = () => {
    let count = 0;
    if (blogType) count++;
    if (blogTag) count++;
    return count;
  };

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-4 py-6 min-h-screen text-gray-900">
      <Toaster />

      {/* Advanced Search Information Dialog */}
      <Dialog
        open={showAdvancedSearchInfo}
        onOpenChange={setShowAdvancedSearchInfo}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-500" />
              Advanced Search
            </DialogTitle>
            <DialogDescription>
              <p className="py-2">
                Advanced search uses more sophisticated algorithms to find
                relevant results but may take longer to complete.
              </p>
              <div className="bg-amber-50 mt-2 p-3 border border-amber-200 rounded-md">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Performance Note
                    </p>
                    <p className="text-amber-700 text-sm">
                      This feature performs in-depth analysis which may slow
                      down search results. Use it only when standard search
                      doesn't yield helpful results.
                    </p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="mx-auto max-w-7xl">
        <div className="bg-white shadow-md mb-6 p-6 rounded-xl">
          <h1 className="mb-4 font-bold text-2xl">Explore UniNav</h1>

          {/* Main Tabs - Fixed container width */}
          <div className="w-full overflow-hidden">
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6 w-full h-max">
                <TabsTrigger value="materials" className="py-3">
                  <BookOpen className="mr-2 w-4 h-4" />
                  Study Materials
                </TabsTrigger>
                <TabsTrigger value="blogs" className="py-3">
                  <FileText className="mr-2 w-4 h-4" />
                  Blogs
                </TabsTrigger>
              </TabsList>

              {/* Materials Tab Content */}
              <TabsContent value="materials" className="space-y-6">
                {/* Materials Search Bar */}
                <div className="flex md:flex-row flex-col gap-4">
                  <div className="relative flex-1">
                    <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search for study materials, courses..."
                      className="py-3 pr-14 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    />

                    {/* Advanced Search Toggle */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                              advancedSearch
                                ? "text-blue-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                            onClick={() =>
                              toggleAdvancedSearch(!advancedSearch)
                            }
                          >
                            <Wand2 className="w-5 h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {advancedSearch ? "Disable" : "Enable"} advanced
                            search
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-primary hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setShowMaterialFilters(!showMaterialFilters)}
                    className="relative flex justify-center items-center gap-2 hover:bg-gray-50 px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                    {getActiveMaterialFiltersCount() > 0 && (
                      <span className="-top-2 -right-2 absolute flex justify-center items-center bg-blue-600 rounded-full w-5 h-5 text-white text-xs">
                        {getActiveMaterialFiltersCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className="hidden md:flex justify-center items-center gap-2 hover:bg-gray-50 px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                  >
                    {viewMode === "grid" ? (
                      <List className="w-5 h-5" />
                    ) : (
                      <Grid className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Advanced Search Option */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="advanced-search-toggle"
                    checked={advancedSearch}
                    onCheckedChange={toggleAdvancedSearch}
                  />
                  <Label
                    htmlFor="advanced-search-toggle"
                    className="flex items-center"
                  >
                    <Wand2 className="mr-1 w-4 h-4 text-blue-600" />
                    Advanced Search
                    <button
                      onClick={() => setShowAdvancedSearchInfo(true)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </Label>
                </div>

                {/* Materials Filters */}
                {showMaterialFilters && (
                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Filter Materials</h3>
                      <button
                        onClick={clearMaterialFilters}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <X className="w-4 h-4" /> Clear all filters
                      </button>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {/* Material Type Filter */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">
                          Material Type
                        </label>
                        <select
                          value={materialType}
                          onChange={(e) => setMaterialType(e.target.value)}
                          className="p-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="">All Types</option>
                          {materialTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Course Filter */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">Course</label>
                        <SelectCourse
                          onChange={setMaterialCourse}
                          currentValue={materialCourse}
                        />
                      </div>

                      {/* Tags Filter */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">Tags</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={materialTag}
                            onChange={(e) => setMaterialTag(e.target.value)}
                            placeholder="Enter tag"
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => fetchMaterials()}
                            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                          >
                            <Tag className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Visibility Filter */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">
                          Visibility
                        </label>
                        <select
                          value={materialVisibility}
                          onChange={(e) =>
                            setMaterialVisibility(e.target.value)
                          }
                          className="p-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="">All Visibilities</option>
                          {visibilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Restriction Filter */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">
                          Restriction
                        </label>
                        <select
                          value={materialRestriction}
                          onChange={(e) =>
                            setMaterialRestriction(e.target.value)
                          }
                          className="p-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="">All Restrictions</option>
                          {restrictionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => fetchMaterials(1)}
                      className="bg-blue-600 hover:bg-blue-700 mt-4 px-6 py-2 rounded-lg w-full md:w-auto font-medium text-white transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}

                {/* Materials Results */}
                <div className="bg-white rounded-lg">
                  {isLoadingMaterials ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {materials?.data && materials.data.length > 0 ? (
                        <div className="space-y-6">
                          <MaterialGrid
                            materials={materials.data}
                            onMaterialClick={handleMaterialClick}
                            viewMode={viewMode}
                          />

                          {/* Materials Pagination */}
                          {materialTotalPages > 1 && (
                            <div className="flex justify-between items-center pt-4 border-t">
                              <p className="text-gray-500 text-sm">
                                Page {materialPage} of {materialTotalPages}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setMaterialPage((prev) =>
                                      Math.max(prev - 1, 1)
                                    )
                                  }
                                  disabled={materialPage === 1}
                                  className={`flex items-center gap-1 px-4 py-2 rounded-md transition ${
                                    materialPage === 1
                                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                      : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  <ChevronLeft className="w-4 h-4" /> Prev
                                </button>
                                <button
                                  onClick={() =>
                                    setMaterialPage((prev) =>
                                      Math.min(prev + 1, materialTotalPages)
                                    )
                                  }
                                  disabled={materialPage === materialTotalPages}
                                  className={`flex items-center gap-1 px-4 py-2 rounded-md transition ${
                                    materialPage === materialTotalPages
                                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                      : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  Next <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-16 text-center">
                          <p className="text-gray-500 text-lg">
                            No materials found
                          </p>
                          <p className="text-gray-400">
                            Try a different search term or adjust your filters
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Blogs Tab Content */}
              <TabsContent value="blogs" className="space-y-6">
                {/* Blogs Search Bar */}
                <div className="flex md:flex-row flex-col gap-4">
                  <div className="relative flex-1">
                    <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search for blogs, articles, guides..."
                      className="py-3 pr-14 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />

                    {/* Advanced Search Toggle */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                              advancedSearch
                                ? "text-blue-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                            onClick={() =>
                              toggleAdvancedSearch(!advancedSearch)
                            }
                          >
                            <Wand2 className="w-5 h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {advancedSearch ? "Disable" : "Enable"} advanced
                            search
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setShowBlogFilters(!showBlogFilters)}
                    className="relative flex justify-center items-center gap-2 hover:bg-gray-50 px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                    {getActiveBlogFiltersCount() > 0 && (
                      <span className="-top-2 -right-2 absolute flex justify-center items-center bg-blue-600 rounded-full w-5 h-5 text-white text-xs">
                        {getActiveBlogFiltersCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className="hidden flex md:flex justify-center items-center gap-2 hover:bg-gray-50 px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                  >
                    {viewMode === "grid" ? (
                      <List className="w-5 h-5" />
                    ) : (
                      <Grid className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Advanced Search Option */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="advanced-search-toggle-blog"
                    checked={advancedSearch}
                    onCheckedChange={toggleAdvancedSearch}
                  />
                  <Label
                    htmlFor="advanced-search-toggle-blog"
                    className="flex items-center"
                  >
                    <Wand2 className="mr-1 w-4 h-4 text-blue-600" />
                    Advanced Search
                    <button
                      onClick={() => setShowAdvancedSearchInfo(true)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </Label>
                </div>

                {/* Blogs Filters */}
                {showBlogFilters && (
                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Filter Blogs</h3>
                      <button
                        onClick={clearBlogFilters}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <X className="w-4 h-4" /> Clear all filters
                      </button>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                      {/* Blog Type Filter */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">Blog Type</label>
                        <select
                          value={blogType}
                          onChange={(e) => setBlogType(e.target.value)}
                          className="p-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="">All Types</option>
                          {blogTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tags Filter */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">Tags</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={blogTag}
                            onChange={(e) => setBlogTag(e.target.value)}
                            placeholder="Enter tag"
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => fetchBlogs()}
                            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                          >
                            <Tag className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => fetchBlogs(1)}
                      className="bg-blue-600 hover:bg-blue-700 mt-4 px-6 py-2 rounded-lg w-full md:w-auto font-medium text-white transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}

                {/* Blogs Results */}
                <div className="bg-white rounded-lg">
                  {isLoadingBlogs ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {blogs?.data && blogs.data.length > 0 ? (
                        <div className="space-y-6">
                          <BlogGrid
                            blogs={blogs.data}
                            onBlogClick={handleBlogClick}
                            viewMode={viewMode}
                          />

                          {/* Blogs Pagination */}
                          {blogTotalPages > 1 && (
                            <div className="flex justify-between items-center pt-4 border-t">
                              <p className="text-gray-500 text-sm">
                                Page {blogPage} of {blogTotalPages}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setBlogPage((prev) => Math.max(prev - 1, 1))
                                  }
                                  disabled={blogPage === 1}
                                  className={`flex items-center gap-1 px-4 py-2 rounded-md transition ${
                                    blogPage === 1
                                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                      : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  <ChevronLeft className="w-4 h-4" /> Prev
                                </button>
                                <button
                                  onClick={() =>
                                    setBlogPage((prev) =>
                                      Math.min(prev + 1, blogTotalPages)
                                    )
                                  }
                                  disabled={blogPage === blogTotalPages}
                                  className={`flex items-center gap-1 px-4 py-2 rounded-md transition ${
                                    blogPage === blogTotalPages
                                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                      : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  Next <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-16 text-center">
                          <p className="text-gray-500 text-lg">
                            No blogs found
                          </p>
                          <p className="text-gray-400">
                            Try a different search term or adjust your filters
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
