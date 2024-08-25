package algorithms

import (
	"regexp"
)

// Extract all number occurrences into a slice of strings
func RegexGetNumber(input string) []string {
	re := regexp.MustCompile(`\d+`)
	matches := re.FindAllString(input, -1)

	var numbers []string

	numbers = append(numbers, matches...)

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
				if !IsValidRoman(segment[index : index+substrlen]) {
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
func IsValidRoman(roman string) bool {
	re := regexp.MustCompile(`^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$`)
	return re.MatchString(roman)
}
