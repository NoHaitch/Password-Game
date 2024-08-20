package rules

import (
	"backend/algorithms"
	"fmt"
)

// Rule 16 – Your password must contain one of the following words: I want IRK | I need IRK | I love IRK
func rule16(password string) bool {
	phrases := []string{"I want IRK", "I need IRK", "I love IRK"}
	fmt.Print("Rule 16: ")
	fmt.Println(containPhrase(password, phrases))
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
