import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import SearchBar from "./SearchBar";
import FilterButton from "./Filter";
import { Affiliation, Category, IClub, School } from "@/lib/models/Club";
import Trie from "./Trie";
import FollowFilter from "./FollowFilter";

interface SearchControlProps {
  clubs: IClub[];
  setCurrentClubs: React.Dispatch<React.SetStateAction<IClub[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  followedClubs: string[];
}

const SearchControl = ({ clubs, setCurrentClubs, setIsLoading, followedClubs }: SearchControlProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([School.COLLEGE]);
  const [trie, setTrie] = useState<Trie | null>(null);
  const [showFollowedOnly, setShowFollowedOnly] = useState(false);
  // Mapping now allows an alias (or club name key) to map to multiple club names.
  const [searchKeyToClubName, setSearchKeyToClubName] = useState<Record<string, string[]>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token:", err);
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Initialize Trie with club names and aliases along with a mapping for lookups.
  useEffect(() => {
    setIsLoading(true);
    const newTrie = new Trie();
    const mapping: Record<string, string[]> = {};

    clubs.forEach((club) => {
      // Insert the club name
      if (typeof club.name === "string") {
        const clubNameLower = club.name.toLowerCase().trim();
        newTrie.insert(clubNameLower, "");
        // If already exists, push the club name to the array.
        if (mapping[clubNameLower]) {
          mapping[clubNameLower].push(club.name);
        } else {
          mapping[clubNameLower] = [club.name];
        }
      }
      // Insert aliases, if any
      if (Array.isArray(club.aliases)) {
        club.aliases.forEach((alias) => {
          if (typeof alias === "string") {
            const aliasLower = alias.toLowerCase().trim();
            newTrie.insert(aliasLower, "");
            if (mapping[aliasLower]) {
              mapping[aliasLower].push(club.name);
            } else {
              mapping[aliasLower] = [club.name];
            }
          }
        });
      }
    });

    setTrie(newTrie);
    setSearchKeyToClubName(mapping);
    setIsLoading(false);
  }, [clubs, setIsLoading]);

  // Filter clubs based on search query, categories, schools, and affiliations
  useEffect(() => {
    if (!trie || clubs.length === 0) return;

    setIsLoading(true);

    // Filter by search query
    let filteredBySearch = clubs;
    if (searchQuery.trim() !== "") {
      const queryWords = searchQuery
        .toLowerCase()
        .split(" ")
        .filter((word) => word.trim() !== "");

      // Instead of only sending club names, we now pass all keys (names and aliases)
      const allSearchKeys = Object.keys(searchKeyToClubName);
      const matchingKeys = trie.getWordsWithPrefixes(queryWords, allSearchKeys);

      // Map each matching key back to the club names (flattening the arrays and deduplicating).
      const matchingClubNames = Array.from(
        // Set lets us deduplicate the club aliases before converting back to an array
        new Set(
          matchingKeys
            .filter((key) => typeof key === "string" && key.trim() !== "")
            .flatMap((key) => {
              const clubNames = searchKeyToClubName[key.toLowerCase().trim()] || [];
              // Filter out any empty aliases before returning them
              return clubNames.filter((name) => name.trim() !== "");
            })
            .map((name) => name.toLowerCase().trim()),
        ),
      );

      filteredBySearch = clubs.filter((club) => matchingClubNames.includes(club.name.toLowerCase().trim()));
    }

    const filteredClubs = filteredBySearch
      .filter((club) =>
        selectedSchools.length > 0 ? selectedSchools.some((school) => club.school?.includes?.(school)) : true,
      )
      .filter((club) =>
        selectedCategories.length > 0
          ? selectedCategories.some(
              (category) =>
                club.categories?.includes(category as Category) || club.affiliations?.includes(category as Affiliation),
            )
          : true,
      )
      .filter((club) => (showFollowedOnly ? followedClubs.includes(club._id) : true));

    const sortedFilteredClubs = filteredClubs.sort((a, b) => {
      if (b.followers !== a.followers) {
        return b.followers - a.followers;
      }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), undefined, { sensitivity: "base" });
    });

    setCurrentClubs(sortedFilteredClubs);
    setIsLoading(false);
  }, [
    searchQuery,
    selectedCategories,
    selectedSchools,
    trie,
    clubs,
    setCurrentClubs,
    setIsLoading,
    followedClubs,
    showFollowedOnly,
    searchKeyToClubName,
  ]);

  return (
    <div className="search-control flex flex-wrap gap-2 max-w-[1400px] items-center pb-4">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-wrap gap-2 sm:flex-row sm:gap-4">
        <FilterButton
          selectedItems={selectedSchools}
          setSelectedItems={setSelectedSchools}
          allItems={Object.values(School)}
          label="Schools"
        />
        <FilterButton
          selectedItems={selectedCategories}
          setSelectedItems={setSelectedCategories}
          allItems={[...Object.values(Category), ...Object.values(Affiliation)].sort()}
          label="Categories"
        />
        {isLoggedIn && <FollowFilter showFollowedOnly={showFollowedOnly} setShowFollowedOnly={setShowFollowedOnly} />}
      </div>
      {/* <ResetButton
        onReset={() => {
          setSearchQuery("");
          setSelectedCategories([]);
          setSelectedSchools([]);
          setShowFollowedOnly(false);
        }}
      /> */}
    </div>
  );
};

export default SearchControl;
