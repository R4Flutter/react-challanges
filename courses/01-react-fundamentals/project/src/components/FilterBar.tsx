import { useEffect, useRef } from 'react'
import Button from './Button'
import FormInput from './FormInput'

export type FilterValue = 'all' | 'active' | 'completed'
export type SortValue =
  | 'Recently Added'
  | 'Priority: High to Low'
  | 'Priority: Low to High'
  | 'Alphabetical'
  | 'Due Date (Soonest First)'

interface FilterBarProps {
  filter?: FilterValue
  onFilterChange?: (filter: FilterValue) => void
  sort?: SortValue
  onSortChange?: (sort: SortValue) => void
  search?: string
  onSearchChange?: (search: string) => void
  onClearSearch?: () => void
  categories?: string[]
  category?: string
  onCategoryChange?: (category: string) => void
}

export default function FilterBar({
  filter = 'all',
  onFilterChange,
  sort = 'Recently Added',
  onSortChange,
  search = '',
  onSearchChange,
  onClearSearch,
  categories = [],
  category = 'all',
  onCategoryChange,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const rootId = onSearchChange ? 'search-bar' : 'filter-bar'

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])
  return (
    <div id={rootId}>
      <Button
        type="button"
        data-active={filter === 'all' ? 'true' : undefined}
        onClick={() => onFilterChange?.('all')}
      >
        All
      </Button>
      <Button
        type="button"
        data-active={filter === 'active' ? 'true' : undefined}
        onClick={() => onFilterChange?.('active')}
      >
        Active
      </Button>
      <Button
        type="button"
        data-active={filter === 'completed' ? 'true' : undefined}
        onClick={() => onFilterChange?.('completed')}
      >
        Completed
      </Button>
      {onCategoryChange && (
        <select
          id="category-filter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {onSearchChange && (
        <FormInput
          id="search-input"
          type="text"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          inputRef={searchInputRef}
        />
      )}
      {onClearSearch && search !== '' && (
        <Button type="button" id="clear-search" variant="secondary" onClick={onClearSearch}>
          Clear search
        </Button>
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
          <option value="Due Date (Soonest First)">Due Date (Soonest First)</option>
        </select>
      )}
    </div>
  )
}
