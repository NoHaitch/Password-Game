package rules

import (
	"strings"
)

// Rule 9 – The Roman numerals in your password should multiply to X
func rule9(romanNumerals []string, x int) (bool, int) {
	sum := productOfRomanNumerals(romanNumerals)
	return sum == x, sum
}

// Calculate the product of the Roman numerals
func productOfRomanNumerals(romanNumerals []string) int {
	product := 1
	for _, numeral := range romanNumerals {
		product *= romanToInt(numeral)
	}
	return product
}

// Convert Roman numeral to integer
func romanToInt(roman string) int {
	romanToIntMap := map[rune]int{
		'I': 1,
		'V': 5,
		'X': 10,
		'L': 50,
		'C': 100,
		'D': 500,
		'M': 1000,
	}

	total := 0
	prevValue := 0
	for _, char := range strings.ToUpper(roman) {
		value := romanToIntMap[char]
		if value > prevValue {
			total += value - 2*prevValue
		} else {
			total += value
		}
		prevValue = value
	}
	return total
}
