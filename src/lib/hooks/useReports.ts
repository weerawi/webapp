import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { setFilters as setFiltersAction, applyFilters as applyFiltersAction, resetFilters as resetFiltersAction } from '@/lib/store/slices/reportSlice';

export function useReports() {
  const dispatch = useDispatch();
  const { records, filters, filteredRecords } = useSelector((state: RootState) => state.report);

  const setFilters = (newFilters: Partial<typeof filters>) => {
    dispatch(setFiltersAction(newFilters));
  };

  const applyFilters = () => {
    dispatch(applyFiltersAction());
  };

  const resetFilters = () => {
    dispatch(resetFiltersAction());
  };

  return { records, filters, filteredRecords, setFilters, applyFilters, resetFilters };
}
