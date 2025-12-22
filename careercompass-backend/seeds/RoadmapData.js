import mongoose from "mongoose";
import Roadmap from "../models/Roadmap.js"; // adjust path
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Explicitly point to root .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/* ---------------- CONFIG ---------------- */

const MONGO_URI = process.env.MONGO_URI;

/* ---------------- TOPIC PLAN (90 DAYS) ---------------- */

const plan = [
  { from: 1, to: 15, topic: "Arrays", level: "Easy" },
  { from: 16, to: 30, topic: "Strings & Hashing", level: "Easy" },
  { from: 31, to: 45, topic: "Stack & Queue", level: "Easy" },
  { from: 46, to: 60, topic: "Linked List & Recursion", level: "Easy" },
  { from: 61, to: 75, topic: "Trees & BST", level: "Medium" },
  { from: 76, to: 90, topic: "Graphs & Dynamic Programming", level: "Medium" },
];

/* ---------------- QUESTION BANK ---------------- */
/* Reused cyclically – realistic & interview-relevant */

const dsaBank = {
  Arrays: [
    ["Two Sum", "https://leetcode.com/problems/two-sum/"],
    ["Best Time to Buy and Sell Stock", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"],
    ["Maximum Subarray", "https://leetcode.com/problems/maximum-subarray/"],
    ["Move Zeroes", "https://leetcode.com/problems/move-zeroes/"],
    ["Rotate Array", "https://leetcode.com/problems/rotate-array/"],
  ],
  "Strings & Hashing": [
    ["Valid Anagram", "https://leetcode.com/problems/valid-anagram/"],
    ["First Unique Character", "https://leetcode.com/problems/first-unique-character-in-a-string/"],
    ["Isomorphic Strings", "https://leetcode.com/problems/isomorphic-strings/"],
    ["Ransom Note", "https://leetcode.com/problems/ransom-note/"],
    ["Group Anagrams", "https://leetcode.com/problems/group-anagrams/"],
  ],
  "Stack & Queue": [
    ["Valid Parentheses", "https://leetcode.com/problems/valid-parentheses/"],
    ["Min Stack", "https://leetcode.com/problems/min-stack/"],
    ["Next Greater Element I", "https://leetcode.com/problems/next-greater-element-i/"],
    ["Daily Temperatures", "https://leetcode.com/problems/daily-temperatures/"],
    ["Implement Queue using Stacks", "https://leetcode.com/problems/implement-queue-using-stacks/"],
  ],
  "Linked List & Recursion": [
    ["Reverse Linked List", "https://leetcode.com/problems/reverse-linked-list/"],
    ["Middle of the Linked List", "https://leetcode.com/problems/middle-of-the-linked-list/"],
    ["Linked List Cycle", "https://leetcode.com/problems/linked-list-cycle/"],
    ["Merge Two Sorted Lists", "https://leetcode.com/problems/merge-two-sorted-lists/"],
    ["Climbing Stairs", "https://leetcode.com/problems/climbing-stairs/"],
  ],
  "Trees & BST": [
    ["Invert Binary Tree", "https://leetcode.com/problems/invert-binary-tree/"],
    ["Maximum Depth of Binary Tree", "https://leetcode.com/problems/maximum-depth-of-binary-tree/"],
    ["Binary Tree Inorder Traversal", "https://leetcode.com/problems/binary-tree-inorder-traversal/"],
    ["Validate Binary Search Tree", "https://leetcode.com/problems/validate-binary-search-tree/"],
    ["Lowest Common Ancestor of a BST", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"],
  ],
  "Graphs & Dynamic Programming": [
    ["Number of Islands", "https://leetcode.com/problems/number-of-islands/"],
    ["Flood Fill", "https://leetcode.com/problems/flood-fill/"],
    ["House Robber", "https://leetcode.com/problems/house-robber/"],
    ["Coin Change", "https://leetcode.com/problems/coin-change/"],
    ["Longest Increasing Subsequence", "https://leetcode.com/problems/longest-increasing-subsequence/"],
  ],
};

const readingLinks = {
  Arrays: "https://www.geeksforgeeks.org/array-data-structure/",
  "Strings & Hashing": "https://www.geeksforgeeks.org/string-data-structure/",
  "Stack & Queue": "https://www.geeksforgeeks.org/stack-data-structure/",
  "Linked List & Recursion": "https://www.geeksforgeeks.org/data-structures/linked-list/",
  "Trees & BST": "https://www.geeksforgeeks.org/binary-tree-data-structure/",
  "Graphs & Dynamic Programming": "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
};

/* ---------------- GENERATOR ---------------- */

function getTopicForDay(day) {
  return plan.find(p => day >= p.from && day <= p.to);
}

function generateDays() {
  const days = [];

  for (let day = 1; day <= 90; day++) {
    const { topic, level } = getTopicForDay(day);
    const bank = dsaBank[topic];

    const q1 = bank[(day * 2) % bank.length];
    const q2 = bank[(day * 2 + 1) % bank.length];

    days.push({
      day,
      topic,
      difficulty: level,
      tasks: [
        {
          type: "DSA",
          platform: "LeetCode",
          problemTitle: q1[0],
          difficulty: level,
          url: q1[1],
        },
        {
          type: "DSA",
          platform: "LeetCode",
          problemTitle: q2[0],
          difficulty: level,
          url: q2[1],
        },
        {
          type: "READ",
          title: `${topic} Fundamentals`,
          url: readingLinks[topic],
        },
      ],
    });
  }

  return days;
}

/* ---------------- SEEDER ---------------- */

async function seedRoadmap() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await Roadmap.deleteMany({ domain: "Software Development" });

    const roadmap = {
      domain: "Software Development",
      durationDays: 90,
      level: "Beginner to Intermediate",
      platform: "LeetCode",
      days: generateDays(),
    };

    await Roadmap.create(roadmap);
    console.log("✅ 90-Day Roadmap Seeded Successfully");

    process.exit();
  } catch (err) {
    console.error("Seeder failed", err);
    process.exit(1);
  }
}

export default seedRoadmap();
