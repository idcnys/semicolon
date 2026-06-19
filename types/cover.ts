export interface CoverState {
    courseNo: string;
    courseTitle: string;
    typeSelect: 'assignment' | 'lab-report' | 'project';
    typeNo: string;
    typeTitle: string;
    section: string;
    teacherName: string;
    teacherDesignation: string;
    teacherDept: string;
    expDate: Date;
    subDate: Date;
    studentName: string;
    studentRoll: string;
}