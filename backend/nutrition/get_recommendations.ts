import { api } from "encore.dev/api";
import type { NutritionRecommendation } from "./types";

interface GetRecommendationsRequest {
  age: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  gender?: string;
}

interface GetRecommendationsResponse {
  recommendation: NutritionRecommendation;
}

// Calculates personalized nutrition recommendations based on age and other factors.
export const getRecommendations = api<GetRecommendationsRequest, GetRecommendationsResponse>(
  { expose: true, method: "POST", path: "/recommendations" },
  async (req) => {
    const { age, weight = 70, height = 170, activityLevel = "moderate", gender = "male" } = req;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const multiplier = activityMultipliers[activityLevel] || 1.55;
    const calories = Math.round(bmr * multiplier);

    // Macronutrient ratios (general guidelines)
    const protein = Math.round((calories * 0.15) / 4); // 15% of calories, 4 cal/g
    const fat = Math.round((calories * 0.25) / 9); // 25% of calories, 9 cal/g
    const carbs = Math.round((calories * 0.60) / 4); // 60% of calories, 4 cal/g
    const fiber = Math.round(age < 50 ? (gender === "male" ? 38 : 25) : (gender === "male" ? 30 : 21));

    // Age-specific recommendations
    let ageGroup: string;
    let notes: string[] = [];

    if (age < 13) {
      ageGroup = "Children (2-12 years)";
      notes = [
        "Focus on calcium and vitamin D for bone development",
        "Ensure adequate protein for growth",
        "Limit processed foods and added sugars",
        "Encourage variety in fruits and vegetables"
      ];
    } else if (age < 19) {
      ageGroup = "Adolescents (13-18 years)";
      notes = [
        "Increased caloric needs for rapid growth",
        "Iron is crucial, especially for females",
        "Calcium and vitamin D remain important",
        "Establish healthy eating patterns"
      ];
    } else if (age < 31) {
      ageGroup = "Young Adults (19-30 years)";
      notes = [
        "Focus on building healthy habits",
        "Maintain adequate protein intake",
        "Include omega-3 fatty acids",
        "Stay hydrated and active"
      ];
    } else if (age < 51) {
      ageGroup = "Adults (31-50 years)";
      notes = [
        "Monitor portion sizes as metabolism slows",
        "Increase antioxidant-rich foods",
        "Maintain bone health with calcium and vitamin D",
        "Focus on heart-healthy fats"
      ];
    } else {
      ageGroup = "Older Adults (51+ years)";
      notes = [
        "May need fewer calories but same nutrient density",
        "Vitamin B12 and D become more important",
        "Focus on protein to maintain muscle mass",
        "Consider fiber for digestive health"
      ];
    }

    return {
      recommendation: {
        calories,
        protein,
        carbs,
        fat,
        fiber,
        ageGroup,
        notes
      }
    };
  }
);
