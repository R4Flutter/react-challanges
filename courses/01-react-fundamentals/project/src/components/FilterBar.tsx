export type FilterValue = 'all' | 'active' | 'completed'
export type SortValue =
  | 'Recently Added'
  | 'Priority: High to Low'
  | 'Priority: Low to High'
  | 'Alphabetical'

interface FilterBarProps {
  filter?: FilterValue
  onFilterChange?: (filter: FilterValue) => void
  sort?: SortValue
  onSortChange?: (sort: SortValue) => void
  search?: string
  onSearchChange?: (search: string) => void
  onClearSearch?: () => void
}

export default function FilterBar({
  filter = 'all',
  onFilterChange,
  sort = 'Recently Added',
  onSortChange,
  search = '',
  onSearchChange,
  onClearSearch,
}: FilterBarProps) {
  const rootId = onSearchChange ? 'search-bar' : 'filter-bar'
  return (
    <div id={rootId}>
      <button
        type="button"
        data-active={filter === 'all' ? 'true' : undefined}
        onClick={() => onFilterChange?.('all')}
      >
        All
      </button>
      <button
        type="button"
        data-active={filter === 'active' ? 'true' : undefined}
        onClick={() => onFilterChange?.('active')}
      >
        Active
      </button>
      <button
        type="button"
        data-active={filter === 'completed' ? 'true' : undefined}
        onClick={() => onFilterChange?.('completed')}
      >
        Completed
      </button>
      {onSearchChange && (
        <input
          id="search-input"
          type="text"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      )}
      {onClearSearch && search !== '' && (
        <button type="button" id="clear-search" onClick={onClearSearch}>
          Clear search
        </button>
      )}
      {onSortChange && (
        <select
          id="sort-order"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortValue)}
        >
          <option value="Recently Added">Recently Added</option>
          <option value="Priority: High to Low">Priority: High to Low</option>
          <option value="Priority: Low to High">Priority: Low to High</option>
          <option value="Alphabetical">Alphabetical</option>
        </select>
      )}
    </div>
  )
}
