package rules

import (
	"fmt"
)

// Rule 14 – 🐔 Paul has hatched ! Please don’t forget to feed him. He eats X 🐛 every Y second
// (Emoji telur dari rule 11 digantikan dengan emoji ayam. Setiap X detik harus terdapat >= Y emoji ulat. Jika dalam X detik tersebut terdapat < Y ulat, pemain dinyatakan kalah)
func rule14(password string, x int, y int) bool {
	fmt.Print("Rule 14: ")
	fmt.Println(chickenFeed(password, x, y))
	return chickenFeed(password, x, y)
}

// Check if string contains a number
func chickenFeed(s string, x int, y int) bool {
	for _, r := range s {
		if r == '🐔' {
			return true
		}
	}
	return false
}
