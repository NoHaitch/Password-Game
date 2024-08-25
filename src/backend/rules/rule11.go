package rules

import (
	"strings"
)

// Rule 11 – 🥚 This is my chicken Paul. He hasn’t hatched yet. Please put him in your password and keep him safe
// (Pastikan emoji telur tidak terhapus. Kalau terhapus, pemain dinyatakan kalah)
func rule11(password string) bool {
	return containsEgg(password)
}

// Check if string contains a number
func containsEgg(s string) bool {
	for _, r := range s {
		if r == '🥚' {
			return true
		}
	}
	return false
}

func cheatRule11(password string) string {
	return strings.Replace(password, "🥚", "🐔", 1)
}
