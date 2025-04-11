interface Site {
  id: string;
  name: string;
  url: string;
}

interface SearchResultProps {
  searchResults?: {
    success: boolean;
    sites?: Site[];
    message?: string;
  };
}

const SearchResult = ({ searchResults }: SearchResultProps) => {
  const sites = searchResults?.success && searchResults.sites ? searchResults.sites : [];

  if (!sites || sites.length === 0) {
    return <div className="text-gray-500">No sites found</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sites.map((site) => (
        <div key={site.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <h3 className="font-medium">{site.name}</h3>
          <p className="text-sm text-gray-500">{site.url}</p>
        </div>
      ))}
    </div>
  )
}

export default SearchResult
