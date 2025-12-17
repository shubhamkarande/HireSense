import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface SkillSelectorProps {
    selectedSkills: string[];
    onChange: (skills: string[]) => void;
    suggestions?: string[];
    maxSkills?: number;
    placeholder?: string;
}

const defaultSuggestions = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Python', 'Go', 'Rust', 'Java', 'C#', 'Ruby',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
    'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'Git', 'CI/CD', 'Agile', 'Scrum', 'TDD',
    'Machine Learning', 'AI', 'Data Science', 'DevOps', 'SRE',
];

export const SkillSelector = ({
    selectedSkills,
    onChange,
    suggestions = defaultSuggestions,
    maxSkills = 20,
    placeholder = 'Add a skill...',
}: SkillSelectorProps) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredSuggestions = suggestions.filter(
        (skill) =>
            skill.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedSkills.includes(skill)
    );

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !selectedSkills.includes(trimmed) && selectedSkills.length < maxSkills) {
            onChange([...selectedSkills, trimmed]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeSkill = (skill: string) => {
        onChange(selectedSkills.filter((s) => s !== skill));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue) {
            e.preventDefault();
            if (filteredSuggestions.length > 0) {
                addSkill(filteredSuggestions[0]);
            } else {
                addSkill(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && selectedSkills.length > 0) {
            removeSkill(selectedSkills[selectedSkills.length - 1]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <div
                onClick={() => inputRef.current?.focus()}
                style={{
                    minHeight: '52px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center',
                    cursor: 'text',
                    padding: '12px 16px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid #475569',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease'
                }}
            >
                {selectedSkills.map((skill) => (
                    <span
                        key={skill}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 8px 6px 12px',
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#818cf8',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '8px',
                            fontSize: '14px'
                        }}
                    >
                        {skill}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSkill(skill);
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '2px',
                                cursor: 'pointer',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#818cf8'
                            }}
                        >
                            <X style={{ width: '12px', height: '12px' }} />
                        </button>
                    </span>
                ))}

                {selectedSkills.length < maxSkills && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedSkills.length === 0 ? placeholder : ''}
                        style={{
                            flex: 1,
                            minWidth: '120px',
                            background: 'transparent',
                            outline: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    />
                )}
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 50,
                        width: '100%',
                        marginTop: '8px',
                        padding: '8px 0',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        maxHeight: '240px',
                        overflowY: 'auto'
                    }}
                >
                    {filteredSuggestions.slice(0, 10).map((skill) => (
                        <button
                            key={skill}
                            onClick={() => addSkill(skill)}
                            style={{
                                width: '100%',
                                padding: '8px 16px',
                                textAlign: 'left',
                                fontSize: '14px',
                                color: '#e2e8f0',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'background 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Plus style={{ width: '16px', height: '16px', color: '#6366f1' }} />
                            {skill}
                        </button>
                    ))}
                </div>
            )}

            <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                {selectedSkills.length}/{maxSkills} skills selected
            </p>
        </div>
    );
};
