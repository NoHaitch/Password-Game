package rules

// Rule 14 – 🐔 Paul has hatched ! Please don’t forget to feed him. He eats X 🐛 every Y second
// (Emoji telur dari rule 11 digantikan dengan emoji ayam. Setiap X detik harus terdapat >= Y emoji ulat. Jika dalam X detik tersebut terdapat < Y ulat, pemain dinyatakan kalah)
func rule14(password string, x int) bool {
	return chickenFeed(password, x)
}

// Check if string contains a number
func chickenFeed(s string, x int) bool {
	findChicken := false
	for _, r := range s {
		if r == '🐔' {
			findChicken = true
			break
		}
	}

	if !findChicken {
		return false
	}

	countFeed := 0
	for _, r := range s {
		if r == '🐛' {
			countFeed++
		}
	}

	return countFeed >= x
}
