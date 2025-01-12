import { Button } from "@/components/ui/button"

interface FinanceTag {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface FinanceTagsProps {
  tags: FinanceTag[];
  selectedTag: string | null;
  onSelectTag: (tagId: string) => void;
}

export function FinanceTags({ tags, selectedTag, onSelectTag }: FinanceTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag) => (
        <Button
          key={tag.id}
          variant={selectedTag === tag.id ? "default" : "outline"}
          onClick={() => onSelectTag(tag.id)}
          className="flex items-center gap-2"
        >
          {tag.icon}
          {tag.name}
        </Button>
      ))}
    </div>
  )
}

