import { Branch } from '@/contexts/AuthContext';

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
}

export interface ReferenceBook {
  id: string;
  title: string;
  author: string;
  edition?: string;
}

type CurriculumData = {
  [key in Branch]: {
    [semester: number]: Subject[];
  };
};

export const curriculum: CurriculumData = {
  CSE: {
    1: [
      { id: 'cse-1-1', name: 'Engineering Mathematics I', code: 'MAT101' },
      { id: 'cse-1-2', name: 'Engineering Physics', code: 'PHY101' },
      { id: 'cse-1-3', name: 'Programming Fundamentals', code: 'CSE101' },
      { id: 'cse-1-4', name: 'Engineering Graphics', code: 'MEE101' },
    ],
    2: [
      { id: 'cse-2-1', name: 'Engineering Mathematics II', code: 'MAT102' },
      { id: 'cse-2-2', name: 'Engineering Chemistry', code: 'CHE101' },
      { id: 'cse-2-3', name: 'Data Structures', code: 'CSE102' },
      { id: 'cse-2-4', name: 'Digital Electronics', code: 'ECE101' },
    ],
    3: [
      { id: 'cse-3-1', name: 'Discrete Mathematics', code: 'MAT201' },
      { id: 'cse-3-2', name: 'Object Oriented Programming', code: 'CSE201' },
      { id: 'cse-3-3', name: 'Computer Organization', code: 'CSE202' },
      { id: 'cse-3-4', name: 'Database Management Systems', code: 'CSE203' },
    ],
    4: [
      { id: 'cse-4-1', name: 'Operating Systems', code: 'CSE301' },
      { id: 'cse-4-2', name: 'Algorithm Design', code: 'CSE302' },
      { id: 'cse-4-3', name: 'Computer Networks', code: 'CSE303' },
      { id: 'cse-4-4', name: 'Software Engineering', code: 'CSE304' },
    ],
    5: [
      { id: 'cse-5-1', name: 'Theory of Computation', code: 'CSE401' },
      { id: 'cse-5-2', name: 'Compiler Design', code: 'CSE402' },
      { id: 'cse-5-3', name: 'Artificial Intelligence', code: 'CSE403' },
      { id: 'cse-5-4', name: 'Web Technologies', code: 'CSE404' },
    ],
    6: [
      { id: 'cse-6-1', name: 'Machine Learning', code: 'CSE501' },
      { id: 'cse-6-2', name: 'Information Security', code: 'CSE502' },
      { id: 'cse-6-3', name: 'Cloud Computing', code: 'CSE503' },
      { id: 'cse-6-4', name: 'Mobile App Development', code: 'CSE504' },
    ],
    7: [
      { id: 'cse-7-1', name: 'Big Data Analytics', code: 'CSE601' },
      { id: 'cse-7-2', name: 'Deep Learning', code: 'CSE602' },
      { id: 'cse-7-3', name: 'Project Phase I', code: 'CSE603' },
    ],
    8: [
      { id: 'cse-8-1', name: 'Blockchain Technology', code: 'CSE701' },
      { id: 'cse-8-2', name: 'Project Phase II', code: 'CSE702' },
    ],
  },
  EEE: {
    1: [
      { id: 'eee-1-1', name: 'Engineering Mathematics I', code: 'MAT101' },
      { id: 'eee-1-2', name: 'Engineering Physics', code: 'PHY101' },
      { id: 'eee-1-3', name: 'Basic Electrical Engineering', code: 'EEE101' },
      { id: 'eee-1-4', name: 'Engineering Graphics', code: 'MEE101' },
    ],
    2: [
      { id: 'eee-2-1', name: 'Engineering Mathematics II', code: 'MAT102' },
      { id: 'eee-2-2', name: 'Circuit Theory', code: 'EEE102' },
      { id: 'eee-2-3', name: 'Electronic Devices', code: 'EEE103' },
      { id: 'eee-2-4', name: 'Programming Basics', code: 'CSE101' },
    ],
    3: [
      { id: 'eee-3-1', name: 'Signals and Systems', code: 'EEE201' },
      { id: 'eee-3-2', name: 'Electrical Machines I', code: 'EEE202' },
      { id: 'eee-3-3', name: 'Analog Electronics', code: 'EEE203' },
      { id: 'eee-3-4', name: 'Electromagnetic Theory', code: 'EEE204' },
    ],
    4: [
      { id: 'eee-4-1', name: 'Electrical Machines II', code: 'EEE301' },
      { id: 'eee-4-2', name: 'Control Systems', code: 'EEE302' },
      { id: 'eee-4-3', name: 'Power Systems I', code: 'EEE303' },
      { id: 'eee-4-4', name: 'Digital Signal Processing', code: 'EEE304' },
    ],
    5: [
      { id: 'eee-5-1', name: 'Power Electronics', code: 'EEE401' },
      { id: 'eee-5-2', name: 'Power Systems II', code: 'EEE402' },
      { id: 'eee-5-3', name: 'Microprocessors', code: 'EEE403' },
      { id: 'eee-5-4', name: 'Instrumentation', code: 'EEE404' },
    ],
    6: [
      { id: 'eee-6-1', name: 'High Voltage Engineering', code: 'EEE501' },
      { id: 'eee-6-2', name: 'Electric Drives', code: 'EEE502' },
      { id: 'eee-6-3', name: 'Renewable Energy Systems', code: 'EEE503' },
      { id: 'eee-6-4', name: 'Power System Protection', code: 'EEE504' },
    ],
    7: [
      { id: 'eee-7-1', name: 'Smart Grid Technology', code: 'EEE601' },
      { id: 'eee-7-2', name: 'Industrial Automation', code: 'EEE602' },
      { id: 'eee-7-3', name: 'Project Phase I', code: 'EEE603' },
    ],
    8: [
      { id: 'eee-8-1', name: 'Electric Vehicle Technology', code: 'EEE701' },
      { id: 'eee-8-2', name: 'Project Phase II', code: 'EEE702' },
    ],
  },
  Mechanical: {
    1: [
      { id: 'mech-1-1', name: 'Engineering Mathematics I', code: 'MAT101' },
      { id: 'mech-1-2', name: 'Engineering Physics', code: 'PHY101' },
      { id: 'mech-1-3', name: 'Engineering Mechanics', code: 'MEE101' },
      { id: 'mech-1-4', name: 'Engineering Graphics', code: 'MEE102' },
    ],
    2: [
      { id: 'mech-2-1', name: 'Engineering Mathematics II', code: 'MAT102' },
      { id: 'mech-2-2', name: 'Materials Science', code: 'MEE103' },
      { id: 'mech-2-3', name: 'Manufacturing Processes', code: 'MEE104' },
      { id: 'mech-2-4', name: 'Thermodynamics', code: 'MEE105' },
    ],
    3: [
      { id: 'mech-3-1', name: 'Strength of Materials', code: 'MEE201' },
      { id: 'mech-3-2', name: 'Fluid Mechanics', code: 'MEE202' },
      { id: 'mech-3-3', name: 'Kinematics of Machines', code: 'MEE203' },
      { id: 'mech-3-4', name: 'Machine Drawing', code: 'MEE204' },
    ],
    4: [
      { id: 'mech-4-1', name: 'Heat Transfer', code: 'MEE301' },
      { id: 'mech-4-2', name: 'Dynamics of Machines', code: 'MEE302' },
      { id: 'mech-4-3', name: 'Machine Design I', code: 'MEE303' },
      { id: 'mech-4-4', name: 'Industrial Engineering', code: 'MEE304' },
    ],
    5: [
      { id: 'mech-5-1', name: 'Machine Design II', code: 'MEE401' },
      { id: 'mech-5-2', name: 'IC Engines', code: 'MEE402' },
      { id: 'mech-5-3', name: 'CAD/CAM', code: 'MEE403' },
      { id: 'mech-5-4', name: 'Refrigeration & AC', code: 'MEE404' },
    ],
    6: [
      { id: 'mech-6-1', name: 'Automobile Engineering', code: 'MEE501' },
      { id: 'mech-6-2', name: 'Robotics', code: 'MEE502' },
      { id: 'mech-6-3', name: 'Finite Element Analysis', code: 'MEE503' },
      { id: 'mech-6-4', name: 'Operations Research', code: 'MEE504' },
    ],
    7: [
      { id: 'mech-7-1', name: 'Additive Manufacturing', code: 'MEE601' },
      { id: 'mech-7-2', name: 'Mechatronics', code: 'MEE602' },
      { id: 'mech-7-3', name: 'Project Phase I', code: 'MEE603' },
    ],
    8: [
      { id: 'mech-8-1', name: 'Advanced Manufacturing', code: 'MEE701' },
      { id: 'mech-8-2', name: 'Project Phase II', code: 'MEE702' },
    ],
  },
  ECE: {
    1: [
      { id: 'ece-1-1', name: 'Engineering Mathematics I', code: 'MAT101' },
      { id: 'ece-1-2', name: 'Engineering Physics', code: 'PHY101' },
      { id: 'ece-1-3', name: 'Basic Electronics', code: 'ECE101' },
      { id: 'ece-1-4', name: 'Engineering Graphics', code: 'MEE101' },
    ],
    2: [
      { id: 'ece-2-1', name: 'Engineering Mathematics II', code: 'MAT102' },
      { id: 'ece-2-2', name: 'Circuit Analysis', code: 'ECE102' },
      { id: 'ece-2-3', name: 'Electronic Devices', code: 'ECE103' },
      { id: 'ece-2-4', name: 'Programming Basics', code: 'CSE101' },
    ],
    3: [
      { id: 'ece-3-1', name: 'Signals and Systems', code: 'ECE201' },
      { id: 'ece-3-2', name: 'Analog Circuits', code: 'ECE202' },
      { id: 'ece-3-3', name: 'Digital Electronics', code: 'ECE203' },
      { id: 'ece-3-4', name: 'Electromagnetic Waves', code: 'ECE204' },
    ],
    4: [
      { id: 'ece-4-1', name: 'Communication Systems', code: 'ECE301' },
      { id: 'ece-4-2', name: 'Control Systems', code: 'ECE302' },
      { id: 'ece-4-3', name: 'Microprocessors', code: 'ECE303' },
      { id: 'ece-4-4', name: 'Linear Integrated Circuits', code: 'ECE304' },
    ],
    5: [
      { id: 'ece-5-1', name: 'Digital Signal Processing', code: 'ECE401' },
      { id: 'ece-5-2', name: 'VLSI Design', code: 'ECE402' },
      { id: 'ece-5-3', name: 'Microcontrollers', code: 'ECE403' },
      { id: 'ece-5-4', name: 'Antenna & Wave Propagation', code: 'ECE404' },
    ],
    6: [
      { id: 'ece-6-1', name: 'Embedded Systems', code: 'ECE501' },
      { id: 'ece-6-2', name: 'Wireless Communication', code: 'ECE502' },
      { id: 'ece-6-3', name: 'Optical Communication', code: 'ECE503' },
      { id: 'ece-6-4', name: 'Digital Image Processing', code: 'ECE504' },
    ],
    7: [
      { id: 'ece-7-1', name: 'IoT Systems', code: 'ECE601' },
      { id: 'ece-7-2', name: 'Satellite Communication', code: 'ECE602' },
      { id: 'ece-7-3', name: 'Project Phase I', code: 'ECE603' },
    ],
    8: [
      { id: 'ece-8-1', name: '5G Technology', code: 'ECE701' },
      { id: 'ece-8-2', name: 'Project Phase II', code: 'ECE702' },
    ],
  },
  Civil: {
    1: [
      { id: 'civil-1-1', name: 'Engineering Mathematics I', code: 'MAT101' },
      { id: 'civil-1-2', name: 'Engineering Physics', code: 'PHY101' },
      { id: 'civil-1-3', name: 'Engineering Mechanics', code: 'CEE101' },
      { id: 'civil-1-4', name: 'Engineering Graphics', code: 'MEE101' },
    ],
    2: [
      { id: 'civil-2-1', name: 'Engineering Mathematics II', code: 'MAT102' },
      { id: 'civil-2-2', name: 'Building Materials', code: 'CEE102' },
      { id: 'civil-2-3', name: 'Surveying', code: 'CEE103' },
      { id: 'civil-2-4', name: 'Geology', code: 'CEE104' },
    ],
    3: [
      { id: 'civil-3-1', name: 'Structural Analysis I', code: 'CEE201' },
      { id: 'civil-3-2', name: 'Fluid Mechanics', code: 'CEE202' },
      { id: 'civil-3-3', name: 'Strength of Materials', code: 'CEE203' },
      { id: 'civil-3-4', name: 'Building Planning', code: 'CEE204' },
    ],
    4: [
      { id: 'civil-4-1', name: 'Structural Analysis II', code: 'CEE301' },
      { id: 'civil-4-2', name: 'Geotechnical Engineering', code: 'CEE302' },
      { id: 'civil-4-3', name: 'Concrete Technology', code: 'CEE303' },
      { id: 'civil-4-4', name: 'Hydraulics', code: 'CEE304' },
    ],
    5: [
      { id: 'civil-5-1', name: 'RCC Design', code: 'CEE401' },
      { id: 'civil-5-2', name: 'Transportation Engineering', code: 'CEE402' },
      { id: 'civil-5-3', name: 'Environmental Engineering', code: 'CEE403' },
      { id: 'civil-5-4', name: 'Foundation Engineering', code: 'CEE404' },
    ],
    6: [
      { id: 'civil-6-1', name: 'Steel Structures', code: 'CEE501' },
      { id: 'civil-6-2', name: 'Hydrology & Irrigation', code: 'CEE502' },
      { id: 'civil-6-3', name: 'Highway Engineering', code: 'CEE503' },
      { id: 'civil-6-4', name: 'Quantity Surveying', code: 'CEE504' },
    ],
    7: [
      { id: 'civil-7-1', name: 'Advanced Structural Design', code: 'CEE601' },
      { id: 'civil-7-2', name: 'Construction Management', code: 'CEE602' },
      { id: 'civil-7-3', name: 'Project Phase I', code: 'CEE603' },
    ],
    8: [
      { id: 'civil-8-1', name: 'Green Building Technology', code: 'CEE701' },
      { id: 'civil-8-2', name: 'Project Phase II', code: 'CEE702' },
    ],
  },
};

export const modules: Module[] = [
  { id: 'module-1', name: 'Module 1', description: 'Introduction and Fundamentals' },
  { id: 'module-2', name: 'Module 2', description: 'Core Concepts' },
  { id: 'module-3', name: 'Module 3', description: 'Advanced Topics' },
  { id: 'module-4', name: 'Module 4', description: 'Applications' },
  { id: 'module-5', name: 'Module 5', description: 'Case Studies & Review' },
  { id: 'pyq', name: 'Previous Year Questions', description: 'Past exam papers' },
  { id: 'two-marks', name: 'Two-Mark Questions', description: 'Quick revision questions' },
];

export const getSubjectsForSemester = (branch: Branch, semester: number): Subject[] => {
  return curriculum[branch]?.[semester] || [];
};

export const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
