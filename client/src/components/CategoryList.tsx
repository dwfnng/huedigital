import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Category } from "@shared/schema";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryList({ 
  categories, 
  selectedCategory,
  onSelectCategory 
}: CategoryListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4 p-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category.name
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
            onClick={() => onSelectCategory(
              selectedCategory === category.name ? null : category.name
            )}
          >
            <CardContent className="p-4">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm opacity-90">{category.nameEn}</p>
                {category.description && (
                  <p className="text-sm mt-2 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
