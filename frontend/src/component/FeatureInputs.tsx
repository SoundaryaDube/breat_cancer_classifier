import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeatureInputsProps {
  features: Record<string, number>;
  onChange: (features: Record<string, number>) => void;
}

// Feature names based on Wisconsin Breast Cancer dataset
const featureGroups = [
  {
    name: "Mean Features",
    features: [
      { id: "mean_radius", label: "Mean Radius" },
      { id: "mean_texture", label: "Mean Texture" },
      { id: "mean_perimeter", label: "Mean Perimeter" },
      { id: "mean_area", label: "Mean Area" },
      { id: "mean_smoothness", label: "Mean Smoothness" },
      { id: "mean_compactness", label: "Mean Compactness" },
      { id: "mean_concavity", label: "Mean Concavity" },
      { id: "mean_concave_points", label: "Mean Concave Points" },
      { id: "mean_symmetry", label: "Mean Symmetry" },
      { id: "mean_fractal_dimension", label: "Mean Fractal Dimension" },
    ],
  },
  {
    name: "Standard Error Features",
    features: [
      { id: "se_radius", label: "SE Radius" },
      { id: "se_texture", label: "SE Texture" },
      { id: "se_perimeter", label: "SE Perimeter" },
      { id: "se_area", label: "SE Area" },
      { id: "se_smoothness", label: "SE Smoothness" },
      { id: "se_compactness", label: "SE Compactness" },
      { id: "se_concavity", label: "SE Concavity" },
      { id: "se_concave_points", label: "SE Concave Points" },
      { id: "se_symmetry", label: "SE Symmetry" },
      { id: "se_fractal_dimension", label: "SE Fractal Dimension" },
    ],
  },
  {
    name: "Worst Features",
    features: [
      { id: "worst_radius", label: "Worst Radius" },
      { id: "worst_texture", label: "Worst Texture" },
      { id: "worst_perimeter", label: "Worst Perimeter" },
      { id: "worst_area", label: "Worst Area" },
      { id: "worst_smoothness", label: "Worst Smoothness" },
      { id: "worst_compactness", label: "Worst Compactness" },
      { id: "worst_concavity", label: "Worst Concavity" },
      { id: "worst_concave_points", label: "Worst Concave Points" },
      { id: "worst_symmetry", label: "Worst Symmetry" },
      { id: "worst_fractal_dimension", label: "Worst Fractal Dimension" },
    ],
  },
];

export const FeatureInputs = ({ features, onChange }: FeatureInputsProps) => {
  const handleChange = (featureId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({
        ...features,
        [featureId]: numValue,
      });
    } else if (value === "") {
      const newFeatures = { ...features };
      delete newFeatures[featureId];
      onChange(newFeatures);
    }
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {featureGroups.map((group) => (
          <div key={group.name} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <h3 className="text-sm font-semibold text-primary">{group.name}</h3>
            </div>
            <div className="space-y-3.5">
              {group.features.map((feature) => (
                <div key={feature.id} className="space-y-2">
                  <Label htmlFor={feature.id} className="text-xs font-medium text-foreground">
                    {feature.label}
                  </Label>
                  <Input
                    id={feature.id}
                    type="number"
                    step="any"
                    value={features[feature.id] ?? ""}
                    onChange={(e) => handleChange(feature.id, e.target.value)}
                    placeholder="0.0"
                    className="h-10 shadow-soft hover:shadow-medium transition-shadow border-border/50 focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
