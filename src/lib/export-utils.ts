import * as XLSX from 'xlsx';
import type { MealPlan, MealPlanEntry } from '@/lib/types';

interface ExportableMeal {
  Date: string;
  'Meal Type': string;
  Recipe: string;
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  'Prep Time': string;
  'Dietary Tags': string;
}

export function exportMealPlanToXLSX(mealPlan: MealPlan, fileName: string = 'meal-plan.xlsx') {
  // Group meals by date
  const mealsByDay = mealPlan.meals.reduce((acc, meal) => {
    const date = new Date(meal.date as any);
    const dateStr = date.toLocaleDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(meal);
    return acc;
  }, {} as Record<string, MealPlanEntry[]>);

  // Create worksheet data
  const worksheetData: ExportableMeal[] = [];

  // Add meal plan details
  Object.entries(mealsByDay).forEach(([dateStr, meals]) => {
    meals.forEach(meal => {
      if (!meal.recipe) return;

      worksheetData.push({
        Date: dateStr,
        'Meal Type': meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1),
        Recipe: meal.recipe.name,
        Calories: meal.recipe.nutrition?.calories || 0,
        Protein: meal.recipe.nutrition?.protein || 0,
        Carbs: meal.recipe.nutrition?.carbs || 0,
        Fat: meal.recipe.nutrition?.fat || 0,
        'Prep Time': `${meal.recipe.prepTime} min`,
        'Dietary Tags': meal.recipe.dietaryTags.join(', '),
      });
    });
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  
  // Add summary worksheet
  const summaryData = [
    ['Meal Plan Summary'],
    ['Start Date', new Date(mealPlan.startDate as any).toLocaleDateString()],
    ['End Date', new Date(mealPlan.endDate as any).toLocaleDateString()],
    ['Target Calories', mealPlan.targetCalories],
    ['Target Protein', mealPlan.targetProtein],
    ['Target Carbs', mealPlan.targetCarbs],
    ['Target Fat', mealPlan.targetFat],
    ['Dietary Restrictions', mealPlan.dietaryRestrictions.join(', ')],
    [''],
    ['Daily Averages'],
    ['Calories', Math.round(worksheetData.reduce((sum, meal) => sum + meal.Calories, 0) / 7)],
    ['Protein', Math.round(worksheetData.reduce((sum, meal) => sum + meal.Protein, 0) / 7)],
    ['Carbs', Math.round(worksheetData.reduce((sum, meal) => sum + meal.Carbs, 0) / 7)],
    ['Fat', Math.round(worksheetData.reduce((sum, meal) => sum + meal.Fat, 0) / 7)],
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');

  // Add meals worksheet
  const mealsWs = XLSX.utils.json_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, mealsWs, 'Meal Plan');

  // Add shopping list worksheet
  const ingredients = new Set<string>();
  mealPlan.meals.forEach(meal => {
    if (meal.recipe?.ingredients) {
      meal.recipe.ingredients.forEach(ing => ingredients.add(ing));
    }
  });

  const shoppingListData = [
    ['Shopping List'],
    [''],
    ...Array.from(ingredients).map(ing => [ing])
  ];

  const shoppingWs = XLSX.utils.aoa_to_sheet(shoppingListData);
  XLSX.utils.book_append_sheet(workbook, shoppingWs, 'Shopping List');

  // Set column widths
  const setCellWidths = (ws: XLSX.WorkSheet) => {
    const columnWidths = [];
    for (const cellAddress in ws) {
      if (cellAddress[0] === '!') continue;
      const cell = ws[cellAddress];
      const column = parseInt(cellAddress.replace(/[0-9]/g, ''), 36) - 9;
      if (!columnWidths[column]) {
        columnWidths[column] = { wch: 0 };
      }
      const value = cell.v ? String(cell.v).length : 0;
      if (value > columnWidths[column].wch) {
        columnWidths[column].wch = value + 2;
      }
    }
    ws['!cols'] = columnWidths;
  };

  setCellWidths(summaryWs);
  setCellWidths(mealsWs);
  setCellWidths(shoppingWs);

  // Generate and download file
  XLSX.writeFile(workbook, fileName);
}

// Utility function to generate shopping list
export function generateShoppingList(mealPlan: MealPlan): string[] {
  const ingredients = new Set<string>();
  mealPlan.meals.forEach(meal => {
    if (meal.recipe?.ingredients) {
      meal.recipe.ingredients.forEach(ing => ingredients.add(ing));
    }
  });
  return Array.from(ingredients);
}