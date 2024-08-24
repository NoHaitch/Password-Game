package algorithms

import (
	"regexp"
	"strconv"
)

// Extract all number occurance into a slice of integers
func RegexGetNumber(input string) []int {
	re := regexp.MustCompile(`\d+`)
	matches := re.FindAllString(input, -1)

	var numbers []int

	for _, match := range matches {
		num, _ := strconv.Atoi(match)
		numbers = append(numbers, num)
	}

	return numbers
}

// Extract all valid Roman numerals from the input string
func RegexGetRomanNumerals(input string) []string {
	re := regexp.MustCompile(`[IVXLCDM]+`)
	potentialMatches := re.FindAllString(input, -1)

	var validNumerals []string

	for _, segment := range potentialMatches {
		if len(segment) == 1 {
			validNumerals = append(validNumerals, segment)
			continue
		}

		for index := 0; index < len(segment); {
			for substrlen := 1; substrlen+index-1 < len(segment); substrlen++ {
				if !isValidRoman(segment[index : index+substrlen]) {
					validNumerals = append(validNumerals, segment[index:index+substrlen-1])
					index = index + substrlen - 1
					break
				}

				if substrlen+index == len(segment) {
					validNumerals = append(validNumerals, segment[index:])
					index = index + substrlen
					break
				}
			}
		}
	}

	return validNumerals
}

// Helper function to validate if a substring is a valid Roman numeral
func isValidRoman(roman string) bool {
	re := regexp.MustCompile(`^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$`)
	return re.MatchString(roman)
}
