"use client";

import React, { useEffect, useState, KeyboardEvent, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectCourse } from "@/components/SelectCourse";
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
import {
  Search,
  Filter,
  X,
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
import BackButton from "@/components/ui/BackButton";

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

// npm

const ExplorePage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
};

const ExploreContent = () => {
  const router = useRouter();
  const { user } = useAuth();
  const searchMaterialsApi = user
    ? searchMaterialsLoggedIn
    : searchMaterialsNotLoggedIn;
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const courseId = searchParams.get("courseId");
  const defaultTab = searchParams.get("defaultTab");
  const [isVisible, setIsVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Add loading state for search button

  const ref = React.useRef<HTMLDivElement>(null);
  const blogRef = React.useRef<HTMLDivElement>(null); // New ref for blog infinite scroll

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
  const [isLoadingMaterialsInfinity, setIsLoadingMaterialsInfinity] =
    useState<boolean>(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState<boolean>(false);
  const [isLoadingBlogsInfinity, setIsLoadingBlogsInfinity] =
    useState<boolean>(false);
  const [materials, setMaterials] = useState<Pagination<Material[]> | null>(
    null
  );
  const [blogs, setBlogs] = useState<Pagination<Blog[]> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoadingMaterials && // Check against loading state
          materialPage < materialTotalPages
        ) {
          setMaterialPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentElement = ref.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [isLoadingMaterials, materialPage, materialTotalPages]);

  useEffect(() => {
    if (materialPage > 1) {
      // Only fetch for subsequent pages
      fetchMaterials(materialPage);
    }
  }, [materialPage]);

  // New IntersectionObserver for blogs
  useEffect(() => {
    if (activeTab !== "blogs" || !blogContentLoaded) return; // Only active on blogs tab and after initial content

    const blogObserver = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoadingBlogs && // Check against blog loading state
          blogPage < blogTotalPages
        ) {
          setBlogPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentBlogElement = blogRef.current;
    if (currentBlogElement) {
      blogObserver.observe(currentBlogElement);
    }

    return () => {
      if (currentBlogElement) {
        blogObserver.unobserve(currentBlogElement);
      }
    };
  }, [activeTab, isLoadingBlogs, blogPage, blogTotalPages, blogContentLoaded]);

  // Effect to fetch blogs when blogPage changes (for infinite scroll)
  useEffect(() => {
    if (blogPage > 1 && activeTab === "blogs" && blogContentLoaded) {
      fetchBlogs(blogPage);
    }
  }, [blogPage, activeTab, blogContentLoaded]);

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
  const fetchMaterials = async (page = materialPage, query = searchQuery) => {
    if (isLoadingMaterials && page > 1) return; // Prevent concurrent fetches for infinite scroll
    setIsLoadingMaterials(true);
    try {
      setIsLoadingMaterials(true);
      const response = await searchMaterialsApi({
        query: query.trim(),
        page,
        limit: 5,
        tag: materialTag || undefined,
        courseId: materialCourse || undefined,
        type: materialType || undefined,
        advancedSearch: advancedSearch || undefined,
      });

      if (response && response.status === "success") {
        // Only update the data array and pagination info, keeping other state unchanged
        setMaterials((prev) => {
          if (!prev) return response.data;
          return {
            ...prev,
            pagination: response.data.pagination,
            data:
              page === 1
                ? response.data.data
                : [...prev.data, ...response.data.data],
          };
        });
        setMaterialTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        // Error already handled by toast in catch block if API throws
        // Or if API returns non-2xx without throwing:
        // toast.error(response?.message || "Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      const err = error as Error;
      toast.error(err?.message || "Failed to fetch materials");
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  // Fetch blogs with filters
  const fetchBlogs = async (page = blogPage, query = searchQuery) => {
    if (isLoadingBlogs && page > 1) return; // Prevent concurrent fetches for infinite scroll
    setIsLoadingBlogs(true);
    try {
      setIsLoadingBlogs(true);
      const response = await searchBlogs({
        query: query.trim(),
        page,
        // limit: 5, // Consider adding limit if your API supports it for blogs
        type: (blogType as BlogType) || undefined,
        // advancedSearch: advancedSearch || undefined, // If applicable
      });

      if (response && response.status === "success") {
        if (page === 1) {
          setBlogs(response.data);
        } else {
          setBlogs((prev) => ({
            ...response.data,
            data: [...(prev?.data || []), ...response.data.data],
          }));
        }
        setBlogTotalPages(response.data.pagination?.totalPages || 1);
        setBlogContentLoaded(true);
      } else {
        // Error already handled by toast in catch block if API throws
        // Or if API returns non-2xx without throwing:
        // toast.error(response?.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      const err = error as Error;
      toast.error(err?.message || "Failed to fetch blogs");
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  // Handle search for active tab
  const handleSearch = async () => {
    setIsSearching(true); // Start loading
    if (advancedSearch) {
      toast("Using advanced search - this may take longer", {
        icon: "🔎",
        duration: 3000,
      });
    }

    try {
      if (activeTab === "materials") {
        setMaterialPage(1);
        await fetchMaterials(1);
      } else {
        setBlogPage(1);
        await fetchBlogs(1);
      }
    } finally {
      setIsSearching(false); // Stop loading regardless of success/failure
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
    // Only reset data when clearing filters
    setMaterials((prev) => (prev ? { ...prev, data: [] } : null));
    fetchMaterials(1);
  };

  // Clear all filters for blogs
  const clearBlogFilters = () => {
    setBlogType("");
    setBlogTag("");
    setBlogPage(1);
    // Only reset data when clearing filters
    setBlogs((prev) => (prev ? { ...prev, data: [] } : null));
    fetchBlogs(1);
  };

  // Effect for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (
            activeTab === "materials" &&
            !isLoadingMaterialsInfinity &&
            materialPage < materialTotalPages
          ) {
            setMaterialPage((prev) => prev + 1);
          } else if (
            activeTab === "blogs" &&
            !isLoadingBlogsInfinity &&
            blogPage < blogTotalPages
          ) {
            setBlogPage((prev) => prev + 1);
          }
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const loadingRef = ref.current;
    if (loadingRef) {
      observer.observe(loadingRef);
    }

    return () => {
      if (loadingRef) {
        observer.unobserve(loadingRef);
      }
    };
  }, [
    isLoadingMaterialsInfinity,
    isLoadingBlogsInfinity,
    materialPage,
    blogPage,
    materialTotalPages,
    blogTotalPages,
    activeTab,
  ]);

  // Effect to fetch more data when page changes
  useEffect(() => {
    if (materialPage > 1) {
      fetchMaterialInfiniteScroll(materialPage);
    }
  }, [materialPage]);

  useEffect(() => {
    if (blogPage > 1) {
      fetchBlogsInfiniteScroll(blogPage);
    }
  }, [blogPage]);

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

  // Handle Enter key press in search input
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Handle material click to navigate to detail page
  const handleMaterialClick = (material: Material) => {
    router.push(`/material/${material.id}`);
  };

  // Handle blog click to navigate to detail page
  const handleBlogClick = (blog: Blog) => {
    router.push(`/blog/${blog.id}`);
  };

  // Initial fetch when component mounts or when URL parameters change
  useEffect(() => {
    // Set state from URL parameters
    let needsSearch = false;
    let newSearchQuery = searchQuery;
    let newActiveTab = activeTab;

    if (query && query !== searchQuery) {
      setSearchQuery(query);
      newSearchQuery = query;
      needsSearch = true;
    }

    if (courseId && courseId !== materialCourse) {
      setMaterialCourse(courseId);
      setActiveTab("materials");
      newActiveTab = "materials";
      setShowMaterialFilters(true);
      needsSearch = true;
    } else if (query && !courseId && !needsSearch) {
      // If only query changed, and not courseId
      needsSearch = true;
    }

    if (needsSearch) {
      setMaterialPage(1); // Reset page to 1 for new search/filter
      setBlogPage(1); // Reset page to 1 for new search/filter
      if (newActiveTab === "materials") {
        fetchMaterials(1, newSearchQuery);
      } else if (newActiveTab === "blogs" && newSearchQuery) {
        // Only fetch blogs if there's a query
        fetchBlogs(1, newSearchQuery);
      }
    }
  }, [query, courseId]); // Removed activeTab from here to simplify logic, setActiveTab will trigger its own effect

  // Effect to handle tab changes and initial data loading
  useEffect(() => {
    // Reset pages when tab changes if there's a search query, to ensure fresh load for the query
    if (searchQuery) {
      setMaterialPage(1);
      setBlogPage(1);
    }

    if (activeTab === "blogs") {
      if (!blogContentLoaded || searchQuery) {
        // Fetch if not loaded or if query exists (for tab switch with query)
        fetchBlogs(1, searchQuery);
      }
    } else if (activeTab === "materials") {
      if (!materials || searchQuery || materialCourse) {
        // Fetch if not loaded or if query/courseId exists
        fetchMaterials(1, searchQuery);
      }
    }
  }, [activeTab]); // Removed blogContentLoaded and materials, simplified logic

  // Update when material filters change
  useEffect(() => {
    // This effect was for materialPage changes, handled by a more specific effect now.
    // If this was intended for filter changes other than page, those should call fetchMaterials(1) directly.
    // For now, removing to avoid potential conflicts if it was re-fetching unnecessarily.
    // if (activeTab === "materials") {
    //   fetchMaterials(); // This would fetch current materialPage, not necessarily page 1
    // }
  }, []); // Empty dependency array if it's meant to be removed or re-evaluated

  // Update when blog filters change
  useEffect(() => {
    // This effect was for blogPage changes, handled by a more specific effect now.
    // Similar to material filters, changes here should call fetchBlogs(1)
    // For now, removing.
    // if (activeTab === "blogs") {
    //  fetchBlogs();
    // }
  }, []); // Empty dependency array if it's meant to be removed or re-evaluated

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
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-1 sm:px-3 md:px-4 py-2 sm:py-4 md:py-6 min-h-screen text-gray-900">
      <Toaster />

      <div className="mx-auto max-w-7xl">
        <div className="bg-white shadow-md mb-2 sm:mb-4 md:mb-6 p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-xl sm:text-2xl">Explore UniNav</h1>
            <BackButton />
          </div>

          {/* Main Tabs - Fixed container width */}
          <div className="w-full overflow-hidden">
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-3 sm:mb-4 md:mb-6 w-full h-max">
                <TabsTrigger
                  value="materials"
                  className="py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base"
                >
                  <BookOpen className="mr-1 sm:mr-2 w-3 sm:w-4 h-3 sm:h-4" />
                  <span>Study Materials</span>
                </TabsTrigger>
                <TabsTrigger
                  value="blogs"
                  className="py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base"
                >
                  <FileText className="mr-1 sm:mr-2 w-3 sm:w-4 h-3 sm:h-4" />
                  <span>Blogs</span>
                </TabsTrigger>
              </TabsList>

              {/* Materials Tab Content */}
              <TabsContent
                value="materials"
                className="space-y-2 sm:space-y-3 md:space-y-6"
              >
                {/* Materials Search Bar */}
                <div className="flex flex-row gap-2 md:gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="top-1/2 left-2 sm:left-3 absolute w-4 sm:w-5 h-4 sm:h-8 text-gray-400 -translate-y-1/2 transform pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.length === 0) {
                          fetchMaterials(1, "");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Search for study materials..."
                      className="py-2 sm:py-2.5 md:py-3 pr-10 pl-7 sm:pl-9 md:pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-xs sm:text-sm md:text-base h-10 sm:h-11 md:h-12"
                    />
                    {/* Search icon button (right) for mobile only */}
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    {/* Advanced Search Toggle (desktop only) */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                              advancedSearch
                                ? "text-blue-600"
                                : "text-gray-400 hover:text-gray-600"
                            } hidden md:inline-flex`}
                            onClick={() =>
                              toggleAdvancedSearch(!advancedSearch)
                            }
                          >
                            <Wand2 className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {advancedSearch ? "Disable" : "Enable"} advanced search
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {/* Filter icon always visible, grid/list toggle hidden on mobile */}
                  <button
                    onClick={() => setShowMaterialFilters(!showMaterialFilters)}
                    className="relative flex justify-center items-center gap-1 sm:gap-2 hover:bg-gray-50 px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 border border-gray-300 rounded-lg text-xs sm:text-sm md:text-base transition-colors"
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Filters</span>
                    {getActiveMaterialFiltersCount() > 0 && (
                      <span className="-top-1 sm:-top-2 -right-1 sm:-right-2 absolute flex justify-center items-center bg-blue-600 rounded-full w-4 sm:w-5 h-4 sm:h-5 text-[10px] text-white sm:text-xs">
                        {getActiveMaterialFiltersCount()}
                      </span>
                    )}
                  </button>
                  {/* Grid/List toggle only on md+ screens */}
                  <button
                    onClick={toggleViewMode}
                    className="hidden md:flex justify-center items-center hover:bg-gray-50 px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-lg transition-colors"
                  >
                    {viewMode === "grid" ? (
                      <List className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                    ) : (
                      <Grid className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
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
                    className="flex items-center text-xs sm:text-sm"
                  >
                    <Wand2 className="mr-1 w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
                    Advanced Search
                    <button
                      onClick={() => setShowAdvancedSearchInfo(true)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <Info className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  </Label>
                </div>

                {/* Materials Filters */}
                {showMaterialFilters && (
                  <div className="bg-gray-50 p-2 sm:p-3 md:p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2 sm:mb-4">
                      <h3 className="font-medium text-xs sm:text-sm md:text-base">
                        Filter Materials
                      </h3>
                      <button
                        onClick={clearMaterialFilters}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                      >
                        <X className="w-3 sm:w-4 h-3 sm:h-4" /> Clear all
                        filters
                      </button>
                    </div>

                    <div className="gap-2 sm:gap-3 md:gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {/* Material Type Filter */}
                      <div className="space-y-1 sm:space-y-2">
                        <label className="font-medium text-xs sm:text-sm">
                          Material Type
                        </label>
                        <select
                          value={materialType}
                          onChange={(e) => setMaterialType(e.target.value)}
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                        >
                          <option value="">All Types</option>
                          {materialTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="font-medium text-xs sm:text-sm">
                          Course
                        </label>
                        <SelectCourse
                          onChange={setMaterialCourse}
                          currentValue={materialCourse}
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="font-medium text-xs sm:text-sm">
                          Tags
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={materialTag}
                            onChange={(e) => setMaterialTag(e.target.value)}
                            placeholder="Enter tag"
                            className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                          />
                          <button
                            onClick={() => fetchMaterials()}
                            className="bg-gray-200 hover:bg-gray-300 p-1.5 sm:p-2 rounded-md"
                          >
                            <Tag className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="font-medium text-xs sm:text-sm">
                          Visibility
                        </label>
                        <select
                          value={materialVisibility}
                          onChange={(e) =>
                            setMaterialVisibility(e.target.value)
                          }
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                        >
                          <option value="">All Visibilities</option>
                          {visibilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="font-medium text-xs sm:text-sm">
                          Restriction
                        </label>
                        <select
                          value={materialRestriction}
                          onChange={(e) =>
                            setMaterialRestriction(e.target.value)
                          }
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
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
                      className="bg-blue-600 hover:bg-blue-700 mt-2 sm:mt-3 md:mt-4 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg w-full md:w-auto font-medium text-white text-xs sm:text-sm transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}

                {/* Materials Results */}
                <div className="bg-white rounded-lg">
                  {/* Initial Loading Spinner: shown if loading and no materials data yet */}
                  {isLoadingMaterials &&
                    (!materials || materials.data.length === 0) && (
                      <div className="flex justify-center items-center py-8 sm:py-12 md:py-16">
                        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-10 sm:w-12 h-10 sm:h-12 animate-spin"></div>
                      </div>
                    )}

                  {/* Display Materials List if data exists */}
                  {materials && materials.data.length > 0 && (
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <MaterialGrid
                        materials={materials.data}
                        onMaterialClick={handleMaterialClick}
                        viewMode={viewMode}
                      />
                      {/* Infinite Scroll Trigger and Loading Indicator */}
                      <div ref={ref} className="flex justify-center py-4">
                        {/* Show spinner if loading more items (isLoadingMaterials is true), 
                            it's a subsequent page (materialPage > 1), 
                            and there are potentially more pages */}
                        {isLoadingMaterials &&
                          materialPage > 1 &&
                          materialPage <= materialTotalPages && (
                            <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* No Materials Found Message: shown if not loading and no materials data */}
                  {!isLoadingMaterials &&
                    (!materials || materials.data.length === 0) && (
                      <div className="py-8 sm:py-12 md:py-16 text-center">
                        <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                          No materials found
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Try a different search term or adjust your filters
                        </p>
                      </div>
                    )}
                </div>
              </TabsContent>

              {/* Blogs Tab Content */}
              <TabsContent
                value="blogs"
                className="space-y-2 sm:space-y-3 md:space-y-6"
              >
                {/* Blogs Search Bar */}
                <div className="flex flex-row gap-2 md:gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="top-1/2 left-2 sm:left-3 absolute w-4 sm:w-5 h-4 sm:h-5 text-gray-400 -translate-y-1/2 transform pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        if (e.target.value.length === 0) {
                          fetchBlogs(1, "");
                        }
                        setSearchQuery(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Search for blogs, articles, guides..."
                      className="py-2 sm:py-2.5 md:py-3 pr-10 pl-7 sm:pl-9 md:pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-xs sm:text-sm md:text-base h-10 sm:h-11 md:h-12"
                    />
                    {/* Search icon button (right) for mobile only */}
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    {/* Advanced Search Toggle (desktop only) */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                              advancedSearch
                                ? "text-blue-600"
                                : "text-gray-400 hover:text-gray-600"
                            } hidden md:inline-flex`}
                            onClick={() =>
                              toggleAdvancedSearch(!advancedSearch)
                            }
                          >
                            <Wand2 className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {advancedSearch ? "Disable" : "Enable"} advanced search
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {/* Filter icon always visible, grid/list toggle hidden on mobile */}
                  <button
                    onClick={() => setShowBlogFilters(!showBlogFilters)}
                    className="relative flex justify-center items-center gap-1 sm:gap-2 hover:bg-gray-50 px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 border border-gray-300 rounded-lg text-xs sm:text-sm md:text-base transition-colors"
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Filters</span>
                    {getActiveBlogFiltersCount() > 0 && (
                      <span className="-top-1 sm:-top-2 -right-1 sm:-right-2 absolute flex justify-center items-center bg-blue-600 rounded-full w-4 sm:w-5 h-4 sm:h-5 text-[10px] text-white sm:text-xs">
                        {getActiveBlogFiltersCount()}
                      </span>
                    )}
                  </button>
                  {/* Grid/List toggle only on md+ screens */}
                  <button
                    onClick={toggleViewMode}
                    className="hidden md:flex justify-center items-center hover:bg-gray-50 px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-lg transition-colors"
                  >
                    {viewMode === "grid" ? (
                      <List className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
                    ) : (
                      <Grid className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
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
                    className="flex items-center text-xs sm:text-sm"
                  >
                    <Wand2 className="mr-1 w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
                    Advanced Search
                    <button
                      onClick={() => setShowAdvancedSearchInfo(true)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <Info className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  </Label>
                </div>

                {/* Blogs Filters */}
                {showBlogFilters && (
                  <div className="bg-gray-50 p-2 sm:p-3 md:p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2 sm:mb-4">
                      <h3 className="font-medium text-xs sm:text-sm md:text-base">
                        Filter Blogs
                      </h3>
                      <button
                        onClick={clearBlogFilters}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                      >
                        <X className="w-3 sm:w-4 h-3 sm:h-4" /> Clear all
                        filters
                      </button>
                    </div>

                    <div className="gap-2 sm:gap-3 md:gap-4 grid grid-cols-1 md:grid-cols-2">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="font-medium text-xs sm:text-sm">
                          Blog Type
                        </label>
                        <select
                          value={blogType}
                          onChange={(e) => setBlogType(e.target.value)}
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-md w-full text-xs sm:text-sm"
                        >
                          <option value="">All Types</option>
                          {blogTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="font-medium text-xs sm:text-sm">
                          Tags
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={blogTag}
                            onChange={(e) => setBlogTag(e.target.value)}
                            placeholder="Enter tag"
                            className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                          />
                          <button
                            onClick={() => fetchBlogs()}
                            className="bg-gray-200 hover:bg-gray-300 p-1.5 sm:p-2 rounded-md"
                          >
                            <Tag className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => fetchBlogs(1)}
                      className="bg-blue-600 hover:bg-blue-700 mt-2 sm:mt-3 md:mt-4 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg w-full md:w-auto font-medium text-white text-xs sm:text-sm transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}

                {/* Blogs Results */}
                <div className="bg-white rounded-lg">
                  {/* Initial Loading Spinner: shown if loading and no blogs data yet */}
                  {isLoadingBlogs && (!blogs || blogs.data.length === 0) && (
                    <div className="flex justify-center items-center py-8 sm:py-12 md:py-16">
                      <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-10 sm:w-12 h-10 sm:h-12 animate-spin"></div>
                    </div>
                  )}

                  {/* Display Blogs List if data exists */}
                  {blogs && blogs.data.length > 0 && (
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                      <BlogGrid
                        blogs={blogs.data}
                        onBlogClick={handleBlogClick}
                        viewMode={viewMode}
                      />
                      {/* Infinite Scroll Trigger and Loading Indicator for Blogs */}
                      <div ref={blogRef} className="flex justify-center py-4">
                        {/* Show spinner if loading more items (isLoadingBlogs is true), 
                            it's a subsequent page (blogPage > 1), 
                            and there are potentially more pages */}
                        {isLoadingBlogs &&
                          blogPage > 1 &&
                          blogPage <= blogTotalPages && (
                            <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* No Blogs Found Message: shown if not loading and no blogs data */}
                  {!isLoadingBlogs && (!blogs || blogs.data.length === 0) && (
                    <div className="py-8 sm:py-12 md:py-16 text-center">
                      {" "}
                      {/* Corrected class: py-8 */}
                      <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                        No blogs found
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Try a different search term or adjust your filters
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ExplorePage;
