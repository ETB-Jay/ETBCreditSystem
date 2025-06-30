import { FilterContainer, FilterField, FilterInput } from '../../../components';
import { useFilters } from '../../../context/useContext';

function DateFilter() {
    const { filters, setFilters } = useFilters();

    const handleDateChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            date: {
                ...prev.date,
                [type === 'start' ? 'startDate' : 'endDate']: value
            }
        }));
    };

    return (
        <FilterContainer>
            <FilterField label="Start Date">
                <FilterInput
                    type="date"
                    value={filters.date?.startDate || ''}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    max={filters.date?.endDate || undefined}
                />
            </FilterField>
            <FilterField label="End Date">
                <FilterInput
                    type="date"
                    value={filters.date?.endDate || ''}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    min={filters.date?.startDate || undefined}
                />
            </FilterField>
        </FilterContainer>
    );
}

export default DateFilter;
