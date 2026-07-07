import { useEffect, useRef } from "react";
import { useProductStore } from "@/app/store/useProduct";
import { useDebounce } from "@/hooks/useDebounce";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Link } from "react-router";
import type { RefObject } from "react";
import { SearchX } from "lucide-react";

interface SearchResultProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: RefObject<HTMLInputElement | null>;
}

const SearchResult = ({ isOpen, setIsOpen, inputRef }: SearchResultProps) => {
  const inputSearch = useProductStore((s) => s.inputSearch);
  const allProducts = useProductStore((s) => s.filteredProducts());

  const debounced = useDebounce(inputSearch, 300);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const limit = isMobile ? 4 : 6;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const products = debounced
    ? allProducts
        .filter((item) =>
          item.title.toLowerCase().includes(debounced.toLowerCase()),
        )
        .slice(0, limit)
    : [];

  const hasQuery = !!debounced.trim();
  const isDropdownVisible = hasQuery && isOpen;

  // klik di luar → tutup dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        event.target !== inputRef.current
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputRef, setIsOpen]);

  // tombol Escape → tutup dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setIsOpen]);

  if (!isDropdownVisible) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-2 w-full bg-background border rounded-xl shadow-xl z-50 overflow-hidden"
    >
      <div className="px-4 py-2 text-xs text-muted-foreground border-b">
        Hasil pencarian untuk <b>“{debounced}”</b>
      </div>

      {products.length > 0 ? (
        <div className="flex flex-col max-h-80 overflow-y-auto">
          {products.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition"
              onClick={() => setIsOpen(false)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover border bg-muted shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.png";
                }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium line-clamp-1">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  Rp {item.price?.toLocaleString("id-ID")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
          <SearchX className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Produk dengan kata kunci <b>“{debounced}”</b> tidak ditemukan.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
