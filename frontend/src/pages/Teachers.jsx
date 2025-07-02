// frontend/src/pages/Teachers.jsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import useDebounce from "../hooks/useDebounce";

// Import UI components
import { specialityData } from "@/assets/assets_frontend/assets";
import { Search, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppContext } from "../context/AppContext";

const Teachers = () => {
  const { speciality: initialSpeciality } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatCurrency, backendUrl } = useContext(AppContext);

  // A helper function to get the search query from the URL
  const getSearchQueryFromURL = () => new URLSearchParams(location.search).get("search") || "";

  // State for search results and loading
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for all filter inputs. Initialize search term from the URL.
  const [searchTerm, setSearchTerm] = useState(getSearchQueryFromURL());
  const [speciality, setSpeciality] = useState(initialSpeciality || "All");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating_desc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce the search term and price range to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // The main function to fetch data based on the current state of all filters
  const fetchFilteredTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (speciality && speciality !== "All") params.append("speciality", speciality);
      if (debouncedPriceRange[0] > 0) params.append("minFee", debouncedPriceRange[0]);
      if (debouncedPriceRange[1] < 200000) params.append("maxFee", debouncedPriceRange[1]);
      if (minRating > 0) params.append("minRating", minRating);
      if (sortBy) params.append("sortBy", sortBy);

      const { data } = await axios.get(`${backendUrl}/api/teachers/list?${params.toString()}`);
      if (data.success) {
        setFilteredTeachers(data.teachers);
      } else {
        toast.error("Could not fetch teachers.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching teachers.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, speciality, debouncedPriceRange, minRating, sortBy, backendUrl]);

  // This effect triggers the API call whenever a debounced filter value changes
  useEffect(() => {
    fetchFilteredTeachers();
  }, [fetchFilteredTeachers]);

  // This new effect listens for changes in the URL (e.g., from the Navbar search)
  // and updates the component's internal state to match.
  useEffect(() => {
    setSearchTerm(getSearchQueryFromURL());
  }, [location.search]);

  // This effect updates the URL path when the speciality dropdown is changed
  useEffect(() => {
    const path = speciality === "All" ? "/teachers" : `/teachers/${speciality}`;
    const currentSearchParams = new URLSearchParams(location.search).toString();
    navigate(`${path}?${currentSearchParams}`, { replace: true });
  }, [speciality, navigate]);

  // Filter Controls Component
  const FilterControls = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <h3 className="font-semibold mb-2">Search by Name</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="e.g., Restu Muhammad" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
      </div>

      {/* Speciality Filter */}
      <div>
        <h3 className="font-semibold mb-2">Speciality</h3>
        <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
          <option value="All">All Specialities</option>
          {specialityData.map((item) => (
            <option key={item.speciality} value={item.speciality}>
              {item.speciality}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{formatCurrency(priceRange[0])}</span>
          <span>{priceRange[1] === 200000 ? `${formatCurrency(priceRange[1])}+` : formatCurrency(priceRange[1])}</span>
        </div>
        <input type="range" min="0" max="200000" step="10000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full" />
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold mb-2">Minimum Rating</h3>
        <div className="flex justify-around">
          {[1, 2, 3, 4].map((rating) => (
            <button key={rating} onClick={() => setMinRating(rating === minRating ? 0 : rating)} className={`p-2 border rounded-full text-sm flex items-center gap-1 transition-colors ${minRating === rating ? "bg-primary text-white" : ""}`}>
              {rating} <Star size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
          <option value="rating_desc">Rating (High to Low)</option>
          <option value="fee_asc">Fee (Low to High)</option>
          <option value="fee_desc">Fee (High to Low)</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-gray-600 mb-5">Browse our amazing tutors. Use the filters to find the perfect match for your learning needs.</p>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block md:w-1/4 lg:w-1/5">
          <FilterControls />
        </aside>

        {/* Mobile Filters */}
        <div className="md:hidden">
          <Button onClick={() => setShowMobileFilters(!showMobileFilters)} variant="outline" className="w-full flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filters
          </Button>
          {showMobileFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <FilterControls />
            </div>
          )}
        </div>

        {/* Teachers List */}
        <main className="w-full md:w-3/4 lg:w-4/5">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div key={teacher._id} onClick={() => navigate(`/session/${teacher._id}`)} className="border rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow duration-300">
                  <img src={teacher.image} alt={teacher.name} className="w-full h-48 object-cover bg-[#EAEFFF]" />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[#262626] text-lg font-medium">{teacher.name}</p>
                      {teacher.rating > 0 && (
                        <span className="flex items-center gap-1 text-sm font-semibold">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" /> {teacher.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-primary text-sm font-semibold">{teacher.speciality}</p>
                    <p className="text-gray-700 font-bold mt-2">{formatCurrency(teacher.fees)}/hr</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10 py-10 border-2 border-dashed rounded-lg">
              <p className="font-semibold">No Teachers Found</p>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Teachers;
