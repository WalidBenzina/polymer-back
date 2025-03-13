export enum SalesUnit {
  KG = 'KG',
  PALETTE_1000 = 'PALETTE_1000',
  PALETTE_1500 = 'PALETTE_1500',
  CONTAINER_20 = 'CONTAINER_20',
  CONTAINER_40 = 'CONTAINER_40',
}

// Weight in kg for each sales unit
export const SalesUnitWeight = {
  [SalesUnit.KG]: 1,
  [SalesUnit.PALETTE_1000]: 1000,
  [SalesUnit.PALETTE_1500]: 1500,
  [SalesUnit.CONTAINER_20]: 20000,
  [SalesUnit.CONTAINER_40]: 40000,
}

export default SalesUnit
