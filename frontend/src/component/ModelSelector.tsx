import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ModelSelector = ({ value, onChange }: ModelSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="model-select" className="text-sm font-medium text-foreground">Classification Model</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="model-select" className="w-full h-11 shadow-soft hover:shadow-medium transition-shadow border-border/50 focus:border-primary">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border/50 shadow-medium">
          <SelectItem value="logistic" className="cursor-pointer">Logistic Regression</SelectItem>
          <SelectItem value="decision-tree" className="cursor-pointer">Decision Tree</SelectItem>
          <SelectItem value="svm" className="cursor-pointer">SVM (Support Vector Machine)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
