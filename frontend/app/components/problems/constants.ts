import { Circle, Play, CheckCircle, RotateCcw, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

// Popular topics with neutral colors - only main topics
export const popularTopics = [
  { name: 'Array', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'String', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Hash Table', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Dynamic Programming', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Math', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Sorting', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Greedy', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Depth-First Search', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Binary Search', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Matrix', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Tree', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Breadth-First Search', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Bit Manipulation', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Two Pointers', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Heap (Priority Queue)', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Binary Tree', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Graph', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' },
  { name: 'Stack', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200', selectedColor: 'bg-blue-500', selectedTextColor: 'text-white' }
];

// Difficulty options
export const difficultyOptions = [
  { value: 'EASY', label: 'Easy', color: 'text-green-600' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
  { value: 'HARD', label: 'Hard', color: 'text-red-600' }
];

// Status options
export const statusOptions = [
  { value: 'NOT_STARTED', label: 'Not Started', icon: Circle, color: 'text-gray-600' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: Play, color: 'text-blue-600' },
  { value: 'COMPLETED', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
  { value: 'NEEDS_REVISIT', label: 'Needs Revisit', icon: RotateCcw, color: 'text-orange-600' }
];
