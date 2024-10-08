package algorithms

// Boyer-Moore Search
// Return bool found and position of pattern in text
func BMSearch(text, pattern string) (bool, int) {
	m := len(pattern)
	n := len(text)

	badChar := badCharHeuristic(pattern)

	shift := 0
	for shift <= (n - m) {
		j := m - 1

		for j >= 0 && pattern[j] == text[shift+j] {
			j--
		}

		if j < 0 {
			return true, shift
		} else {
			shift += max(1, j-badChar[text[shift+j]])
		}
	}
	return false, -1
}

// Bad Character Heuristic
func badCharHeuristic(pattern string) []int {
	badChar := make([]int, 256)
	for i := range badChar {
		badChar[i] = -1
	}
	for i := 0; i < len(pattern); i++ {
		badChar[pattern[i]] = i
	}
	return badChar
}

func max(x, y int) int {
	if x > y {
		return x
	}
	return y
}
