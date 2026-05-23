export interface ProteinSource {
  id: string;
  name: string;
  proteinPerServing: number;
  servingLabel: string;
}

export const proteinSources: ProteinSource[] = [
  {
    id: 'ps-01',
    name: 'Grilled Chicken Breast',
    proteinPerServing: 31,
    servingLabel: '100g'
  },
  {
    id: 'ps-02',
    name: 'Boiled Egg (Large)',
    proteinPerServing: 6,
    servingLabel: '1 egg'
  },
  {
    id: 'ps-03',
    name: 'Whey Protein Scoop',
    proteinPerServing: 24,
    servingLabel: '30g'
  },
  {
    id: 'ps-04',
    name: 'Greek Yogurt (Plain)',
    proteinPerServing: 10,
    servingLabel: '100g'
  }
];
