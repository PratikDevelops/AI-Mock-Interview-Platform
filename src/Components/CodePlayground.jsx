import React, { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { motion } from "framer-motion";

const questions = [
  {
    id: 1,
    title: "Reverse a String",
    difficulty: "Easy",
    tags: ["Strings"],
    description:
      "Write a function that takes a string and returns it reversed.",
    examples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"OpenAI"', output: '"IAnepO"' },
    ],
    starterCode: {
      javascript: `function reverseString(str) {\n  // your code here\n}`,
      python: `def reverse_string(s):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 2,
    title: "Sum of Array",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description: "Return the sum of all elements in an array.",
    examples: [
      { input: "[1, 2, 3, 4]", output: "10" },
      { input: "[5, 10, -2]", output: "13" },
    ],
    starterCode: {
      javascript: `function sumArray(arr) {\n  // your code here\n}`,
      python: `def sum_array(arr):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nint sumArray(vector<int> arr) {\n    // your code here\n}`,
    },
  },
  {
    id: 3,
    title: "Check Palindrome",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Check if a string is a palindrome.",
    examples: [
      { input: '"madam"', output: "true" },
      { input: '"hello"', output: "false" },
    ],
    starterCode: {
      javascript: `function isPalindrome(str) {\n  // your code here\n}`,
      python: `def is_palindrome(s):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 4,
    title: "Find Maximum Number",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description: "Return the maximum number from an array.",
    examples: [
      { input: "[1, 3, 2]", output: "3" },
      { input: "[-5, -1, -3]", output: "-1" },
    ],
    starterCode: {
      javascript: `function findMax(arr) {\n  // your code here\n}`,
      python: `def find_max(arr):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nint findMax(vector<int> arr) {\n    // your code here\n}`,
    },
  },
  {
    id: 5,
    title: "Fibonacci Sequence",
    difficulty: "Medium",
    tags: ["Recursion", "Math"],
    description: "Generate Fibonacci sequence up to n terms.",
    examples: [
      { input: "5", output: "[0, 1, 1, 2, 3]" },
      { input: "1", output: "[0]" },
    ],
    starterCode: {
      javascript: `function fibonacci(n) {\n  // your code here\n}`,
      python: `def fibonacci(n):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> fibonacci(int n) {\n    // your code here\n}`,
    },
  },
  {
    id: 6,
    title: "Count Vowels",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Count the number of vowels in a given string.",
    examples: [
      { input: '"hello"', output: "2" },
      { input: '"OpenAI"', output: "4" },
    ],
    starterCode: {
      javascript: `function countVowels(str) {\n  // your code here\n}`,
      python: `def count_vowels(s):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nint countVowels(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 7,
    title: "Check Prime Number",
    difficulty: "Medium",
    tags: ["Math"],
    description: "Check if a number is prime.",
    examples: [
      { input: "7", output: "true" },
      { input: "10", output: "false" },
    ],
    starterCode: {
      javascript: `function isPrime(num) {\n  // your code here\n}`,
      python: `def is_prime(n):\n    # your code here`,
      cpp: `bool isPrime(int num) {\n    // your code here\n}`,
    },
  },
  {
    id: 8,
    title: "Merge Two Sorted Arrays",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    description: "Merge two sorted arrays into a single sorted array.",
    examples: [
      { input: "[1, 3, 5], [2, 4, 6]", output: "[1, 2, 3, 4, 5, 6]" },
      { input: "[1, 2], [3, 4]", output: "[1, 2, 3, 4]" },
    ],
    starterCode: {
      javascript: `function mergeSortedArrays(arr1, arr2) {\n  // your code here\n}`,
      python: `def merge_sorted_arrays(arr1, arr2):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> mergeSortedArrays(vector<int> arr1, vector<int> arr2) {\n    // your code here\n}`,
    },
  },
  {
    id: 9,
    title: "Find Missing Number",
    difficulty: "Medium",
    tags: ["Array", "Math"],
    description:
      "Find the missing number in an array containing numbers from 1 to n.",
    examples: [
      { input: "[1, 2, 4, 5]", output: "3" },
      { input: "[2, 3, 1, 5]", output: "4" },
    ],
    starterCode: {
      javascript: `function findMissingNumber(arr) {\n  // your code here\n}`,
      python: `def find_missing_number(arr):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nint findMissingNumber(vector<int> arr) {\n    // your code here\n}`,
    },
  },
  {
    id: 10,
    title: "Count Words in String",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Count the number of words in a string.",
    examples: [
      { input: '"Hello world"', output: "2" },
      { input: '"OpenAI is amazing"', output: "3" },
    ],
    starterCode: {
      javascript: `function countWords(str) {\n  // your code here\n}`,
      python: `def count_words(s):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nint countWords(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 11,
    title: "Remove Duplicates from Array",
    difficulty: "Medium",
    tags: ["Array"],
    description:
      "Remove duplicate elements from an array and return the unique elements.",
    examples: [
      { input: "[1, 2, 2, 3]", output: "[1, 2, 3]" },
      { input: "[4, 4, 4, 4]", output: "[4]" },
    ],
    starterCode: {
      javascript: `function removeDuplicates(arr) {\n  // your code here\n}`,
      python: `def remove_duplicates(arr):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> removeDuplicates(vector<int> arr) {\n    // your code here\n}`,
    },
  },
  {
    id: 12,
    title: "Check Anagram",
    difficulty: "Medium",
    tags: ["Strings"],
    description: "Check if two strings are anagrams.",
    examples: [
      { input: '"listen", "silent"', output: "true" },
      { input: '"hello", "world"', output: "false" },
    ],
    starterCode: {
      javascript: `function isAnagram(str1, str2) {\n  // your code here\n}`,
      python: `def is_anagram(s1, s2):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isAnagram(string s1, string s2) {\n    // your code here\n}`,
    },
  },
  {
    id: 13,
    title: "Factorial",
    difficulty: "Easy",
    tags: ["Math", "Recursion"],
    description: "Calculate factorial of a number.",
    examples: [
      { input: "5", output: "120" },
      { input: "0", output: "1" },
    ],
    starterCode: {
      javascript: `function factorial(n) {\n  // your code here\n}`,
      python: `def factorial(n):\n    # your code here`,
      cpp: `int factorial(int n) {\n    // your code here\n}`,
    },
  },
  {
    id: 14,
    title: "Check Even or Odd",
    difficulty: "Easy",
    tags: ["Math"],
    description: "Check if a number is even or odd.",
    examples: [
      { input: "4", output: "Even" },
      { input: "7", output: "Odd" },
    ],
    starterCode: {
      javascript: `function checkEvenOdd(num) {\n  // your code here\n}`,
      python: `def check_even_odd(n):\n    # your code here`,
      cpp: `string checkEvenOdd(int num) {\n    // your code here\n}`,
    },
  },
  {
    id: 15,
    title: "Power of a Number",
    difficulty: "Medium",
    tags: ["Math"],
    description: "Calculate the power of a number (base^exponent).",
    examples: [
      { input: "2, 3", output: "8" },
      { input: "5, 0", output: "1" },
    ],
    starterCode: {
      javascript: `function power(base, exponent) {\n  // your code here\n}`,
      python: `def power(base, exponent):\n    # your code here`,
      cpp: `int power(int base, int exponent) {\n    // your code here\n}`,
    },
  },
  {
    id: 16,
    title: "Find GCD",
    difficulty: "Medium",
    tags: ["Math"],
    description: "Find the greatest common divisor (GCD) of two numbers.",
    examples: [
      { input: "12, 18", output: "6" },
      { input: "7, 13", output: "1" },
    ],
    starterCode: {
      javascript: `function gcd(a, b) {\n  // your code here\n}`,
      python: `def gcd(a, b):\n    # your code here`,
      cpp: `int gcd(int a, int b) {\n    // your code here\n}`,
    },
  },
  {
    id: 17,
    title: "Remove Spaces from String",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Remove all spaces from a string.",
    examples: [
      { input: '"Hello World"', output: '"HelloWorld"' },
      { input: '" Open AI "', output: '"OpenAI"' },
    ],
    starterCode: {
      javascript: `function removeSpaces(str) {\n  // your code here\n}`,
      python: `def remove_spaces(s):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nstring removeSpaces(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 18,
    title: "Count Digits in Number",
    difficulty: "Easy",
    tags: ["Math"],
    description: "Count the number of digits in an integer.",
    examples: [
      { input: "12345", output: "5" },
      { input: "0", output: "1" },
    ],
    starterCode: {
      javascript: `function countDigits(num) {\n  // your code here\n}`,
      python: `def count_digits(n):\n    # your code here`,
      cpp: `int countDigits(int num) {\n    // your code here\n}`,
    },
  },
  {
    id: 19,
    title: "Sum of Digits",
    difficulty: "Easy",
    tags: ["Math"],
    description: "Calculate the sum of digits of an integer.",
    examples: [
      { input: "123", output: "6" },
      { input: "456", output: "15" },
    ],
    starterCode: {
      javascript: `function sumDigits(num) {\n  // your code here\n}`,
      python: `def sum_digits(n):\n    # your code here`,
      cpp: `int sumDigits(int num) {\n    // your code here\n}`,
    },
  },
  {
    id: 20,
    title: "Find Second Largest Number",
    difficulty: "Medium",
    tags: ["Array"],
    description: "Find the second largest number in an array.",
    examples: [
      { input: "[1, 5, 3, 4]", output: "4" },
      { input: "[10, 10, 9]", output: "9" },
    ],
    starterCode: {
      javascript: `function findSecondLargest(arr) {\n  // your code here\n}`,
      python: `def find_second_largest(arr):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nint findSecondLargest(vector<int> arr) {\n    // your code here\n}`,
    },
  },
  {
    id: 21,
    title: "Check Armstrong Number",
    difficulty: "Medium",
    tags: ["Math"],
    description: "Check if a number is an Armstrong number.",
    examples: [
      { input: "153", output: "true" },
      { input: "123", output: "false" },
    ],
    starterCode: {
      javascript: `function isArmstrong(num) {\n  // your code here\n}`,
      python: `def is_armstrong(n):\n    # your code here`,
      cpp: `bool isArmstrong(int num) {\n    // your code here\n}`,
    },
  },
  {
    id: 22,
    title: "Count Characters in String",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Count the occurrences of each character in a string.",
    examples: [
      { input: '"hello"', output: "{h:1, e:1, l:2, o:1}" },
      { input: '"test"', output: "{t:2, e:1, s:1}" },
    ],
    starterCode: {
      javascript: `function countChars(str) {\n  // your code here\n}`,
      python: `def count_chars(s):\n    # your code here`,
      cpp: `#include <string>\n#include <unordered_map>\nusing namespace std;\n\nunordered_map<char,int> countChars(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 23,
    title: "Check Substring",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Check if one string is a substring of another.",
    examples: [
      { input: '"hello", "ell"', output: "true" },
      { input: '"world", "word"', output: "false" },
    ],
    starterCode: {
      javascript: `function isSubstring(str, sub) {\n  // your code here\n}`,
      python: `def is_substring(s, sub):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isSubstring(string str, string sub) {\n    // your code here\n}`,
    },
  },
  {
    id: 24,
    title: "Reverse Integer",
    difficulty: "Medium",
    tags: ["Math"],
    description: "Reverse the digits of an integer.",
    examples: [
      { input: "123", output: "321" },
      { input: "-456", output: "-654" },
    ],
    starterCode: {
      javascript: `function reverseInteger(num) {\n  // your code here\n}`,
      python: `def reverse_integer(n):\n    # your code here`,
      cpp: `int reverseInteger(int num) {\n    // your code here\n}`,
    },
  },
  {
    id: 25,
    title: "Merge Two Sorted Linked Lists",
    difficulty: "Hard",
    tags: ["Linked List", "Sorting"],
    description:
      "Merge two sorted linked lists and return it as a sorted list.",
    examples: [{ input: "1->2->4, 1->3->4", output: "1->1->2->3->4->4" }],
    starterCode: {
      javascript: `function mergeTwoLists(l1, l2) {\n  // your code here\n}`,
      python: `def merge_two_lists(l1, l2):\n    # your code here`,
      cpp: `struct ListNode {\n  int val;\n  ListNode *next;\n  ListNode(int x) : val(x), next(NULL) {}\n};\n\nListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    // your code here\n}`,
    },
  },
  {
    id: 26,
    title: "Check Balanced Parentheses",
    difficulty: "Medium",
    tags: ["Stack", "Strings"],
    description: "Check if parentheses in a string are balanced.",
    examples: [
      { input: '"(())"', output: "true" },
      { input: '"(()"', output: "false" },
    ],
    starterCode: {
      javascript: `function isBalanced(s) {\n  // your code here\n}`,
      python: `def is_balanced(s):\n    # your code here`,
      cpp: `#include <stack>\n#include <string>\nusing namespace std;\n\nbool isBalanced(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 27,
    title: "Find Intersection of Two Arrays",
    difficulty: "Medium",
    tags: ["Array"],
    description: "Find intersection of two arrays.",
    examples: [
      { input: "[1,2,2,1], [2,2]", output: "[2, 2]" },
      { input: "[4,9,5], [9,4,9,8,4]", output: "[4, 9]" },
    ],
    starterCode: {
      javascript: `function intersect(arr1, arr2) {\n  // your code here\n}`,
      python: `def intersect(arr1, arr2):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> intersect(vector<int> arr1, vector<int> arr2) {\n    // your code here\n}`,
    },
  },
  {
    id: 28,
    title: "Remove Element from Array",
    difficulty: "Easy",
    tags: ["Array"],
    description:
      "Remove all instances of a value in-place from an array and return new length.",
    examples: [
      { input: "[3,2,2,3], val=3", output: "2 (array becomes [2,2])" },
    ],
    starterCode: {
      javascript: `function removeElement(arr, val) {\n  // your code here\n}`,
      python: `def remove_element(arr, val):\n    # your code here`,
      cpp: `#include <vector>\nusing namespace std;\n\nint removeElement(vector<int>& arr, int val) {\n    // your code here\n}`,
    },
  },
  {
    id: 29,
    title: "Find Largest Palindromic Substring",
    difficulty: "Hard",
    tags: ["Strings", "Dynamic Programming"],
    description: "Find the longest palindromic substring in a string.",
    examples: [
      { input: '"babad"', output: '"bab"' },
      { input: '"cbbd"', output: '"bb"' },
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {\n  // your code here\n}`,
      python: `def longest_palindrome(s):\n    # your code here`,
      cpp: `#include <string>\nusing namespace std;\n\nstring longestPalindrome(string s) {\n    // your code here\n}`,
    },
  },
  {
    id: 30,
    title: "Find Missing Ranges",
    difficulty: "Medium",
    tags: ["Array"],
    description:
      "Given a sorted integer array where the range of elements are [lower, upper], return missing ranges.",
    examples: [
      {
        input: "[0,1,3,50,75], lower=0, upper=99",
        output: '["2", "4->49", "51->74", "76->99"]',
      },
    ],
    starterCode: {
      javascript: `function findMissingRanges(nums, lower, upper) {\n  // your code here\n}`,
      python: `def find_missing_ranges(nums, lower, upper):\n    # your code here`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> findMissingRanges(vector<int>& nums, int lower, int upper) {\n    // your code here\n}`,
    },
  },
];

const LANG_EXTENSIONS = {
  javascript,
  python,
  cpp,
};

const LOCAL_STORAGE_KEY = "codeplayground_saved";

const CodePlayground = () => {
  const [selectedQuestionId, setSelectedQuestionId] = useState(1);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  const question = questions.find((q) => q.id === selectedQuestionId);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
    const savedCode =
      saved?.[selectedQuestionId]?.[language] || question.starterCode[language];
    setCode(savedCode);
    setOutput("");
    setInput("");
  }, [selectedQuestionId, language, question.starterCode]);

  useEffect(() => {
    setOutput("");
    setInput("");
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
    if (!saved[selectedQuestionId]) saved[selectedQuestionId] = {};
    saved[selectedQuestionId][language] = code;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saved));
  }, [code, selectedQuestionId, language]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    },
    [code, language, input]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const res = await fetch("http://localhost:4000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input }),
      });
      const data = await res.json();
      if (data.output) {
        setOutput(data.output);
        alert("Code ran successfully!");
      } else {
        setOutput("No output received.");
        alert("Code ran but no output received.");
      }
    } catch (error) {
      setOutput("Error running code.");
      alert("Error running code.");
      console.error(error);
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(question.starterCode[language]);
    setOutput("");
    setInput("");
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-6 bg-gray-50 text-gray-900 min-h-screen"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <select
          value={selectedQuestionId}
          onChange={(e) => setSelectedQuestionId(Number(e.target.value))}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className="mb-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <p className="text-gray-700 mb-2">{question.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block px-3 py-1 bg-indigo-200 text-indigo-800 rounded font-semibold text-sm">
            Difficulty: {question.difficulty}
          </span>
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded border border-gray-300 overflow-auto">
          <h2 className="text-xl font-semibold mb-2">Examples</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {question.examples.map((ex, idx) => (
              <li key={idx}>
                <strong>Input:</strong> {ex.input} &nbsp;&rarr;&nbsp;{" "}
                <strong>Output:</strong> {ex.output}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex space-x-4 mb-4 justify-center max-w-3xl mx-auto">
        {["code", "input", "output"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-6 max-w-3xl mx-auto">
        {activeTab === "code" && (
          <CodeMirror
            value={code}
            height="400px"
            extensions={[LANG_EXTENSIONS[language]()]}
            onChange={setCode}
            theme="light"
            className="rounded border border-gray-300 shadow"
          />
        )}

        {activeTab === "input" && (
          <textarea
            className="w-full h-48 p-3 rounded border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter custom input for your code here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}

        {activeTab === "output" && (
          <pre className="whitespace-pre-wrap p-4 rounded border border-gray-300 bg-gray-100 text-green-700 max-h-48 overflow-auto">
            {output}
          </pre>
        )}
      </div>

      <div className="flex space-x-4 justify-end max-w-3xl mx-auto">
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 font-semibold transition"
          title="Reset code to starter template"
        >
          Reset
        </button>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`px-6 py-2 rounded text-white font-semibold transition ${
            isRunning
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          title="Run code (Ctrl+Enter)"
        >
          {isRunning ? "Running..." : "Run Code (Ctrl+Enter)"}
        </button>
      </div>
    </motion.div>
  );
};

export default CodePlayground;
