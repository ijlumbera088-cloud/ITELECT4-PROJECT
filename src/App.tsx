import React, { useState, useEffect, useRef } from 'react';
import { useToggle } from '../hooks/useToggle';
import { usePrevious } from '../hooks/usePrevious';

// Interface for our mock data items
interface Course {
    id: string;
    title: string;
    description: string;
}

// Mock data to simulate API loading
const MOCK_COURSES: Course[] = [
    { id: '1', title: 'ITELECT4', description: 'React and TypeScript Web Development' },
    { id: '2', title: 'CCPROG1', description: 'Introduction to Programming' },
    { id: '3', title: 'CCDSALG', description: 'Data Structures and Algorithms' },
];

export const App: React.FC = () => {
    // 1. useState<T> for at least 2 pieces of state (courses list, loading flag, search text)
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // 2. useRef for DOM reference (input element focusing)
    const inputRef = useRef<HTMLInputElement>(null);

    // Using our custom hooks
    const [isGridView, toggleView] = useToggle(true);
    const prevSearchTerm = usePrevious(searchTerm);

    // 3. useEffect to load mock data on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setCourses(MOCK_COURSES);
            setIsLoading(false);
            // Auto-focus input on mount via ref
            inputRef.current?.focus();
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // 4. Typed onChange handler using React.ChangeEvent<HTMLInputElement>
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    // Filter courses dynamically based on state
    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>GT2 - Part 2: React Hooks & State</h1>

            {/* DOM Reference (useRef) Example */}
            <div style={{ marginBottom: '15px' }}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ padding: '8px', width: '250px' }}
                />
                <button onClick={toggleView} style={{ marginLeft: '10px', padding: '8px' }}>
                    Toggle View ({isGridView ? 'Grid' : 'List'})
                </button>
            </div>

            {prevSearchTerm !== undefined && (
                <p style={{ fontSize: '12px', color: '#666' }}>
                    Previous Search: "{prevSearchTerm}"
                </p>
            )}

            {/* 5. Dynamic Rendering from State */}
            {isLoading ? (
                <p>Loading course data...</p>
            ) : (
                <div style={{ display: isGridView ? 'flex' : 'block', gap: '10px' }}>
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    marginBottom: '10px',
                                    minWidth: '200px',
                                }}
                            >
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No courses found matching "{searchTerm}"</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;