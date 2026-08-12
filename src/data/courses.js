// src/data/courses.js

const courses = [
    {
        id: "c1",
        name: "Calculus II",
        color: "#276CF5",
        grades: [
            {date: "2026-03-10", value: 8.0},
            {date: "2026-05-02", value: 7.5},
        ],
    },
    {
        id: "c2",
        name: "Physics I",
        color: "#F5276C",
        grades: [
            {date: "2026-03-15", value: 6.5},
        ],
    },
];

export function getCourses(){
    return courses;
}

export function getCourseAverage(course){
    if (course.grades.length === 0) return null;
    const sum = course.grades.reduce((total, g) => total + g.value, 0);
    return (sum / course.grades.length);
}