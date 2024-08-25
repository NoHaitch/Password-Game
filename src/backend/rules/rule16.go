package rules

import (
	"backend/algorithms"
	"strings"
)

// Rule 16 – Your password must contain one of the following words: I want IRK | I need IRK | I love IRK
func rule16(password string) bool {
	phrases := []string{"I want IRK", "I need IRK", "I love IRK"}
	return containPhrase(password, phrases)
}

// Check if string contains a list of characters
func containPhrase(s string, phrases []string) bool {
	ac := algorithms.NewAhoCorasick()

	// Add each pattern to the Aho-Corasick automaton
	for i, pattern := range phrases {
		ac.AddPattern(pattern, i)
	}
	ac.Build()

	results := ac.Search(s)
	return len(results) > 0
}

func cheatRule16(password string, importantAlfabets *[]string) (string, bool) {
	phrases := []string{"I want IRK", "I need IRK", "I love IRK"}
	for _, phrase := range phrases {
		found, _ := algorithms.BMSearch(password, phrase)
		if found {
			for _, char := range phrase {
				lowerChar := strings.ToLower(string(char))
				if !strings.ContainsAny(lowerChar, "abcdefghijklmnopqrstuvwxyz") {
					continue
				}
				exists := false
				for _, c := range *importantAlfabets {
					if c == lowerChar {
						exists = true
						break
					}
				}
				if !exists {
					*importantAlfabets = append(*importantAlfabets, lowerChar)
				}
			}

			return password, true
		}
	}

	var bestPhrase string
	minNewChars := -1
	newCharsAdded := make([]string, 0)

	for _, phrase := range phrases {
		newCharsNeeded := 0
		newChars := []string{}

		for _, char := range phrase {
			lowerChar := strings.ToLower(string(char))
			if !strings.ContainsAny(lowerChar, "abcdefghijklmnopqrstuvwxyz") {
				continue
			}

			exists := false
			for _, c := range *importantAlfabets {
				if c == lowerChar {
					exists = true
					break
				}
			}

			if !exists {
				newCharsNeeded++
				newChars = append(newChars, lowerChar)
			}
		}

		if minNewChars == -1 || newCharsNeeded < minNewChars {
			minNewChars = newCharsNeeded
			bestPhrase = phrase
			newCharsAdded = newChars
		}
	}

	if bestPhrase != "" {
		// Make sure the "I" in all phrase doensn't disturb the roman numeral rules
		if len(password) > 0 && algorithms.IsValidRoman(string(password[len(password)-1])) {
			password += " "
		}
		password += bestPhrase

		*importantAlfabets = append(*importantAlfabets, newCharsAdded...)

		return password, true
	}

	return password, false
}
