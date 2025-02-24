import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function BMICalculator() {
  const { user } = useAuth();
  const [height, setHeight] = useState(user?.height?.toString() || "");
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [bmi, setBmi] = useState<number | null>(null);

  const updateStatsMutation = useMutation({
    mutationFn: async (data: { height: number; weight: number }) => {
      const res = await apiRequest("PATCH", "/api/user/stats", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const calculateBMI = () => {
    const heightM = Number(height) / 100;
    const weightKg = Number(weight);
    
    if (heightM > 0 && weightKg > 0) {
      const bmiValue = weightKg / (heightM * heightM);
      setBmi(Number(bmiValue.toFixed(1)));
      
      if (user) {
        updateStatsMutation.mutate({
          height: Number(height),
          weight: Number(weight),
        });
      }
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
          </div>
          <Button onClick={calculateBMI}>Calculate BMI</Button>

          {bmi !== null && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="text-lg font-semibold">
                Your BMI: {bmi} - {getBMICategory(bmi)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
