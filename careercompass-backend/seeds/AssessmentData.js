import mongoose from "mongoose";
import Assessment from "../models/Assessment.js"; // adjust path if needed
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Explicitly point to root .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

const assessmentSeed = [
  {
    day: 1,
    questions: [
      {
        question: "What is an array?",
        options: [
          { option: "A collection of elements stored in contiguous memory locations" },
          { option: "A collection of key-value pairs" },
          { option: "A recursive data structure" },
          { option: "A non-linear structure" }
        ],
        answer: "A collection of elements stored in contiguous memory locations"
      },
      {
        question: "What is the time complexity to access an array element by index?",
        options: [
          { option: "O(1)" },
          { option: "O(n)" },
          { option: "O(log n)" },
          { option: "O(n log n)" }
        ],
        answer: "O(1)"
      },
      {
        question: "Which algorithm is used in the Maximum Subarray problem?",
        options: [
          { option: "Kadane’s Algorithm" },
          { option: "Binary Search" },
          { option: "Two Pointer" },
          { option: "Sliding Window" }
        ],
        answer: "Kadane’s Algorithm"
      },
      {
        question: "What happens if all numbers are negative in Maximum Subarray?",
        options: [
          { option: "The largest negative number is returned" },
          { option: "Zero is returned" },
          { option: "Array size is returned" },
          { option: "Runtime error occurs" }
        ],
        answer: "The largest negative number is returned"
      },
      {
        question: "What edge case should be considered in Move Zeroes?",
        options: [
          { option: "Array with only zeroes" },
          { option: "Array with characters" },
          { option: "Sorted array" },
          { option: "Negative indexing" }
        ],
        answer: "Array with only zeroes"
      }
    ]
  },

  {
    day: 2,
    questions: [
      {
        question: "What is the goal of the Rotate Array problem?",
        options: [
          { option: "Rotate elements to the right by k steps" },
          { option: "Reverse the array" },
          { option: "Sort the array" },
          { option: "Remove duplicates" }
        ],
        answer: "Rotate elements to the right by k steps"
      },
      {
        question: "Which technique optimizes Rotate Array to O(1) space?",
        options: [
          { option: "Reversal Algorithm" },
          { option: "Hashing" },
          { option: "Recursion" },
          { option: "Sliding Window" }
        ],
        answer: "Reversal Algorithm"
      },
      {
        question: "What data structure is commonly used in Two Sum?",
        options: [
          { option: "HashMap" },
          { option: "Stack" },
          { option: "Queue" },
          { option: "Tree" }
        ],
        answer: "HashMap"
      },
      {
        question: "What is the time complexity of Two Sum using HashMap?",
        options: [
          { option: "O(n)" },
          { option: "O(n²)" },
          { option: "O(log n)" },
          { option: "O(1)" }
        ],
        answer: "O(n)"
      },
      {
        question: "Which edge case should be handled in Two Sum?",
        options: [
          { option: "No valid pair exists" },
          { option: "Negative values" },
          { option: "Sorted array" },
          { option: "Duplicate keys" }
        ],
        answer: "No valid pair exists"
      }
    ]
  },

  {
    day: 3,
    questions: [
      {
        question: "What is the main goal of Best Time to Buy and Sell Stock?",
        options: [
          { option: "Maximize profit with one transaction" },
          { option: "Find all profits" },
          { option: "Sort stock prices" },
          { option: "Find maximum price" }
        ],
        answer: "Maximize profit with one transaction"
      },
      {
        question: "Which variable tracks minimum price so far?",
        options: [
          { option: "minPrice" },
          { option: "maxProfit" },
          { option: "currentSum" },
          { option: "windowStart" }
        ],
        answer: "minPrice"
      },
      {
        question: "What is the time complexity of the optimal solution?",
        options: [
          { option: "O(n)" },
          { option: "O(n²)" },
          { option: "O(log n)" },
          { option: "O(1)" }
        ],
        answer: "O(n)"
      },
      {
        question: "What if prices are in decreasing order?",
        options: [
          { option: "Profit is 0" },
          { option: "Profit is negative" },
          { option: "Exception occurs" },
          { option: "Array is reversed" }
        ],
        answer: "Profit is 0"
      },
      {
        question: "Which approach is mainly used in this problem?",
        options: [
          { option: "Greedy approach" },
          { option: "Divide and conquer" },
          { option: "Backtracking" },
          { option: "Dynamic programming" }
        ],
        answer: "Greedy approach"
      }
    ]
  },

  {
    day: 4,
    questions: [
      {
        question: "What is the objective of Move Zeroes?",
        options: [
          { option: "Move all zeroes to the end without changing order" },
          { option: "Sort the array" },
          { option: "Remove zeroes" },
          { option: "Reverse array" }
        ],
        answer: "Move all zeroes to the end without changing order"
      },
      {
        question: "Which technique is used in Move Zeroes?",
        options: [
          { option: "Two Pointer" },
          { option: "Binary Search" },
          { option: "Recursion" },
          { option: "Heap" }
        ],
        answer: "Two Pointer"
      },
      {
        question: "Does Move Zeroes require extra space?",
        options: [
          { option: "No" },
          { option: "Yes" },
          { option: "Depends on input" },
          { option: "Only for large arrays" }
        ],
        answer: "No"
      },
      {
        question: "What is the time complexity of Rotate Array?",
        options: [
          { option: "O(n)" },
          { option: "O(n²)" },
          { option: "O(log n)" },
          { option: "O(1)" }
        ],
        answer: "O(n)"
      },
      {
        question: "Which edge case must be handled in rotation?",
        options: [
          { option: "k > array length" },
          { option: "Negative values" },
          { option: "Duplicate values" },
          { option: "Sorted array" }
        ],
        answer: "k > array length"
      }
    ]
  },

  {
    day: 5,
    questions: [
      {
        question: "Why is HashMap preferred in Two Sum?",
        options: [
          { option: "Fast lookup of complement" },
          { option: "Sorted access" },
          { option: "Memory optimization" },
          { option: "Recursive calls" }
        ],
        answer: "Fast lookup of complement"
      },
      {
        question: "Which constraint ensures O(n) performance?",
        options: [
          { option: "Single pass traversal" },
          { option: "Nested loops" },
          { option: "Sorting first" },
          { option: "Binary search" }
        ],
        answer: "Single pass traversal"
      },
      {
        question: "What does maxProfit store?",
        options: [
          { option: "Maximum profit so far" },
          { option: "Maximum price" },
          { option: "Minimum price" },
          { option: "Index value" }
        ],
        answer: "Maximum profit so far"
      },
      {
        question: "Can Two Sum return multiple answers?",
        options: [
          { option: "No, only one valid pair" },
          { option: "Yes, all pairs" },
          { option: "Only sorted pairs" },
          { option: "Depends on language" }
        ],
        answer: "No, only one valid pair"
      },
      {
        question: "Which scenario gives zero profit?",
        options: [
          { option: "Prices decreasing daily" },
          { option: "Prices increasing daily" },
          { option: "Prices constant" },
          { option: "Mixed prices" }
        ],
        answer: "Prices decreasing daily"
      }
    ]
  },
  {
    day: 6,
    questions: [
      {
        question: "Which problem uses Kadane’s Algorithm?",
        options: [
          { option: "Maximum Subarray" },
          { option: "Two Sum" },
          { option: "Rotate Array" },
          { option: "Move Zeroes" }
        ],
        answer: "Maximum Subarray"
      },
      {
        question: "What is the space complexity of Kadane’s Algorithm?",
        options: [
          { option: "O(1)" },
          { option: "O(n)" },
          { option: "O(log n)" },
          { option: "O(n²)" }
        ],
        answer: "O(1)"
      },
      {
        question: "What does currentSum represent in Maximum Subarray?",
        options: [
          { option: "Current running sum" },
          { option: "Maximum sum so far" },
          { option: "Minimum value" },
          { option: "Index value" }
        ],
        answer: "Current running sum"
      },
      {
        question: "Which case resets currentSum to current element?",
        options: [
          { option: "When currentSum becomes negative" },
          { option: "When array is sorted" },
          { option: "When element is zero" },
          { option: "When index is odd" }
        ],
        answer: "When currentSum becomes negative"
      },
      {
        question: "What type of approach is used in Maximum Subarray?",
        options: [
          { option: "Greedy" },
          { option: "Backtracking" },
          { option: "Divide and Conquer only" },
          { option: "Recursion" }
        ],
        answer: "Greedy"
      }
    ]
  },

  {
    day: 7,
    questions: [
      {
        question: "Which technique is commonly used in Move Zeroes?",
        options: [
          { option: "Two Pointer" },
          { option: "Binary Search" },
          { option: "Recursion" },
          { option: "Heap" }
        ],
        answer: "Two Pointer"
      },
      {
        question: "Does Move Zeroes maintain relative order of non-zero elements?",
        options: [
          { option: "Yes" },
          { option: "No" },
          { option: "Only for sorted arrays" },
          { option: "Depends on implementation" }
        ],
        answer: "Yes"
      },
      {
        question: "What is the time complexity of Move Zeroes?",
        options: [
          { option: "O(n)" },
          { option: "O(n²)" },
          { option: "O(log n)" },
          { option: "O(1)" }
        ],
        answer: "O(n)"
      },
      {
        question: "Which value is skipped during swapping in Move Zeroes?",
        options: [
          { option: "Zero" },
          { option: "Negative numbers" },
          { option: "Duplicates" },
          { option: "Maximum element" }
        ],
        answer: "Zero"
      },
      {
        question: "What is a key edge case for Move Zeroes?",
        options: [
          { option: "All elements are zero" },
          { option: "Sorted array" },
          { option: "Negative values" },
          { option: "Odd-length array" }
        ],
        answer: "All elements are zero"
      }
    ]
  },

  {
    day: 8,
    questions: [
      {
        question: "What does the Rotate Array problem do?",
        options: [
          { option: "Rotates elements by k positions" },
          { option: "Sorts the array" },
          { option: "Reverses the array" },
          { option: "Deletes elements" }
        ],
        answer: "Rotates elements by k positions"
      },
      {
        question: "Which algorithm allows rotation in O(1) extra space?",
        options: [
          { option: "Reversal Algorithm" },
          { option: "Hashing" },
          { option: "Recursion" },
          { option: "Sliding Window" }
        ],
        answer: "Reversal Algorithm"
      },
      {
        question: "What happens if k is greater than array length?",
        options: [
          { option: "k is taken modulo array length" },
          { option: "Runtime error" },
          { option: "Array is reversed" },
          { option: "No rotation happens" }
        ],
        answer: "k is taken modulo array length"
      },
      {
        question: "How many reversals are required in the optimal solution?",
        options: [
          { option: "Three" },
          { option: "One" },
          { option: "Two" },
          { option: "Four" }
        ],
        answer: "Three"
      },
      {
        question: "What is the time complexity of Rotate Array?",
        options: [
          { option: "O(n)" },
          { option: "O(n²)" },
          { option: "O(log n)" },
          { option: "O(1)" }
        ],
       answer: "O(n)"
      }
    ]
  },

  {
    day: 9,
    questions: [
      {
        question: "What is the main idea behind Two Sum?",
        options: [
          { option: "Find two numbers that add to target" },
          { option: "Find maximum sum" },
          { option: "Sort two arrays" },
          { option: "Find duplicate values" }
        ],
        answer: "Find two numbers that add to target"
      },
      {
        question: "Which value is checked in HashMap during Two Sum?",
        options: [
          { option: "target - current value" },
          { option: "current value * 2" },
          { option: "array index" },
          { option: "previous sum" }
        ],
        answer: "target - current value"
      },
      {
        question: "What is stored as key in HashMap?",
        options: [
          { option: "Array element value" },
          { option: "Index" },
          { option: "Target value" },
          { option: "Sum" }
        ],
        answer: "Array element value"
      },
      {
        question: "Why is brute-force Two Sum inefficient?",
        options: [
          { option: "O(n²) time complexity" },
          { option: "High memory usage" },
          { option: "Incorrect results" },
          { option: "Too much recursion" }
        ],
        answer: "O(n²) time complexity"
      },
      {
        question: "What is returned by Two Sum?",
        options: [
          { option: "Indices of the two numbers" },
          { option: "The two numbers" },
          { option: "Sum value" },
          { option: "Boolean result" }
        ],
        answer: "Indices of the two numbers"
      }
    ]
  },

  {
    day: 10,
    questions: [
      {
        question: "What is tracked to maximize profit in Stock Buy & Sell?",
        options: [
          { option: "Minimum price so far" },
          { option: "Maximum price so far" },
          { option: "Average price" },
          { option: "Total sum" }
        ],
        answer: "Minimum price so far"
      },
      {
        question: "When is profit updated?",
        options: [
          { option: "When current price - min price is higher" },
          { option: "When price decreases" },
          { option: "At every iteration" },
          { option: "Only at last index" }
        ],
        answer: "When current price - min price is higher"
      },
      {
        question: "What is returned if no profit is possible?",
        options: [
          { option: "0" },
          { option: "-1" },
          { option: "Minimum price" },
          { option: "Exception" }
        ],
        answer: "0"
      },
      {
        question: "How many transactions are allowed?",
        options: [
          { option: "One" },
          { option: "Two" },
          { option: "Unlimited" },
          { option: "Depends on input" }
        ],
        answer: "One"
      },
      {
        question: "Which approach best describes this solution?",
        options: [
          { option: "Greedy" },
          { option: "Dynamic Programming" },
          { option: "Backtracking" },
          { option: "Divide and Conquer" }
        ],
        answer: "Greedy"
      }
    ]
  }
];


await mongoose.connect(MONGO_URI);
 console.log("MongoDB connected");
 await Assessment.deleteMany({});
await Assessment.insertMany(assessmentSeed);
console.log("successFull");

export default assessmentSeed;
