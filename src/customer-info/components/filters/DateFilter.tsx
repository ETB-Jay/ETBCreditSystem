import React from 'react';
import { FilterContainer, FilterField, FilterInput } from '../../../components';
import { useFilters } from '../../../context/useContext';

/**
 * Filter component for selecting a date range for transactions.
 * @returns The DateFilter filter component.
 */
function DateFilter(): React.ReactElement {
    const { filters, setFilters } = useFilters();

    const handleDateChange = (type: string, value: string) => {
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
                    placeholder="Start date"
                />
            </FilterField>
            <FilterField label="End Date">
                <FilterInput
                    type="date"
                    value={filters.date?.endDate || ''}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    min={filters.date?.startDate || undefined}
                    placeholder="End date"
                />
            </FilterField>
        </FilterContainer>
    );
}

export default DateFilter;
