type CategoryTabsProps = {
  categories: string[]
  selectedCategory: string
  onSelect: (category: string) => void
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div
      className="marketplace-categories"
      role="group"
      aria-label="تصنيفات المتاجر"
    >
      {categories.map((category) => (
        <button
          key={category}
          className={`marketplace-category${selectedCategory === category ? ' is-active' : ''}`}
          type="button"
          aria-pressed={selectedCategory === category}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
