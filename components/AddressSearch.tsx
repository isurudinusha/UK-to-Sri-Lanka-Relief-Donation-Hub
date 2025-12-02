import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressResult {
    display_name: string;
    lat: string;
    lon: string;
    address: {
        road?: string;
        house_number?: string;
        city?: string;
        town?: string;
        postcode?: string;
        country?: string;
    };
}

interface AddressSearchProps {
    onSelectAddress: (address: string) => void;
    value: string;
    placeholder?: string;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
    onSelectAddress,
    value,
    placeholder = "Search for your address..."
}) => {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<AddressResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchAddress = async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            // OpenStreetMap Nominatim API - free geocoding service
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(searchQuery)}&` +
                `countrycodes=gb&` + // Limit to UK
                `format=json&` +
                `addressdetails=1&` +
                `limit=5`,
                {
                    headers: {
                        'User-Agent': 'UK-Sri-Lanka-Relief-Hub/1.0'
                    }
                }
            );

            const data: AddressResult[] = await response.json();
            setResults(data);
            setShowResults(true);
        } catch (error) {
            console.error('Address search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        // Debounce the search
        const timeoutId = setTimeout(() => {
            searchAddress(newQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    const handleSelectResult = (result: AddressResult) => {
        const formattedAddress = result.display_name;
        setQuery(formattedAddress);
        onSelectAddress(formattedAddress);
        setShowResults(false);
        setResults([]);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loading ? (
                        <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                    ) : (
                        <MapPin className="h-5 w-5 text-slate-400" />
                    )}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                    onFocus={() => {
                        if (results.length > 0) setShowResults(true);
                    }}
                />
            </div>

            {/* Results Dropdown */}
            {showResults && results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {results.map((result, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectResult(result)}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-emerald-600 mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">
                                        {result.address.road && result.address.house_number
                                            ? `${result.address.house_number} ${result.address.road}`
                                            : result.address.road || result.display_name.split(',')[0]
                                        }
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {result.address.city || result.address.town}, {result.address.postcode}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {showResults && !loading && query.length >= 3 && results.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
                    <p className="text-sm text-slate-500 text-center">
                        No addresses found. Try a different search term.
                    </p>
                </div>
            )}
        </div>
    );
};
