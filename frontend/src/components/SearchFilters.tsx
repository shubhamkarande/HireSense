import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import type { JobFilters } from '@/types';
import { useDebounce } from '@/hooks';

interface SearchFiltersProps {
    filters: JobFilters;
    onChange: (filters: JobFilters) => void;
    sources?: string[];
}

const experienceLevels = [
    { value: '', label: 'All Levels' },
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-Level (2-5 years)' },
    { value: 'senior', label: 'Senior (5+ years)' },
];

export const SearchFilters = ({ filters, onChange, sources = [] }: SearchFiltersProps) => {
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || '');

    const debouncedSearch = useDebounce(searchInput, 300);

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            onChange({ ...filters, search: debouncedSearch, page: 1 });
        }
    }, [debouncedSearch, filters, onChange]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.experienceLevel) count++;
        if (filters.source) count++;
        if (filters.salaryMin || filters.salaryMax) count++;
        if (filters.skills?.length) count++;
        return count;
    }, [filters]);

    const clearFilters = () => {
        setSearchInput('');
        onChange({ page: 1, limit: 20 });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid #475569',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search jobs by title, company, or skills..."
                        style={{ ...inputStyle, paddingLeft: '48px' }}
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput('')}
                            style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                padding: '4px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '50%',
                                display: 'flex'
                            }}
                        >
                            <X style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderColor: showFilters ? '#6366f1' : undefined,
                        color: showFilters ? '#818cf8' : undefined
                    }}
                >
                    <Filter style={{ width: '16px', height: '16px' }} />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                        <span style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#6366f1',
                            color: 'white',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {activeFiltersCount}
                        </span>
                    )}
                    <ChevronDown style={{ width: '16px', height: '16px', transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div style={{
                    padding: '24px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                        {/* Experience Level */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                Experience Level
                            </label>
                            <select
                                value={filters.experienceLevel || ''}
                                onChange={(e) => onChange({ ...filters, experienceLevel: e.target.value, page: 1 })}
                                style={inputStyle}
                            >
                                {experienceLevels.map((level) => (
                                    <option key={level.value} value={level.value} style={{ background: '#1e293b' }}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Source */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                Job Source
                            </label>
                            <select
                                value={filters.source || ''}
                                onChange={(e) => onChange({ ...filters, source: e.target.value, page: 1 })}
                                style={inputStyle}
                            >
                                <option value="" style={{ background: '#1e293b' }}>All Sources</option>
                                {sources.map((source) => (
                                    <option key={source} value={source} style={{ background: '#1e293b' }}>
                                        {source}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Salary Min */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                Min Salary ($/year)
                            </label>
                            <input
                                type="number"
                                value={filters.salaryMin || ''}
                                onChange={(e) => onChange({ ...filters, salaryMin: parseInt(e.target.value) || undefined, page: 1 })}
                                placeholder="e.g. 50000"
                                style={inputStyle}
                            />
                        </div>

                        {/* Salary Max */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                Max Salary ($/year)
                            </label>
                            <input
                                type="number"
                                value={filters.salaryMax || ''}
                                onChange={(e) => onChange({ ...filters, salaryMax: parseInt(e.target.value) || undefined, page: 1 })}
                                placeholder="e.g. 150000"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {activeFiltersCount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={clearFilters}
                                style={{
                                    fontSize: '14px',
                                    color: '#94a3b8',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                <X style={{ width: '16px', height: '16px' }} />
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
