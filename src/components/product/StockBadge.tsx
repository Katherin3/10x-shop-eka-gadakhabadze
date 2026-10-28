import { getStockLabel, getStockLevel, type StockLevel } from '../../utils/stock';

const LEVEL_CLASSES: Record<StockLevel, string> = {
  'in-stock': 'text-emerald-700',
  low: 'text-orange-600',
  out: 'text-red-700',
};

export default function StockBadge({ stock }: { stock: number }) {
  return <span className={`text-sm font-semibold ${LEVEL_CLASSES[getStockLevel(stock)]}`}>{getStockLabel(stock)}</span>;
}
