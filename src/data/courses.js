// src/data/courses.js

const COURSE_COLORS = ["#276CF5", "#F5276C", "#F5B027", "#27F5B0", "#F54927"];

export function getNextColor(){
    const usedCount = getCourses().length;
    return COURSE_COLORS[usedCount % COURSE_COLORS.length];
}

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

export function getOverallAverage(){
    const allAverages = courses
        .map((c) => getCourseAverage(c))
        .filter((avg) => avg !== null);
    
    if (allAverages.length === 0)return null;

    const sum = allAverages.reduce((total, avg) => total + avg, 0);
    return (sum / allAverages.length)
}

export function addCourse(name, color){
    const id = `c${Date.now()}`;
    courses.push({id, name, color, grades: []});
    return id;
}

export function removeCourse(id){
    const index = courses.findIndex((c) => c.id === id);
    if (index !== -1) courses.splice(index,1);
}

export function addGrade(courseId, date, value){
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    course.grades.push({date,value});
}

export function removeGrade(courseId, index){
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    course.grades.splice(index,1);
}