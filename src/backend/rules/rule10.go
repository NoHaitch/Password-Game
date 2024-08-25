package rules

import (
	"strings"
)

// Rule 10 – Oh no! Your password is on fire 🔥. Quick, put it out!
// (Emoji api akan “membakar” 1 huruf (menghapus huruf dan menggantikannya dengan emoji api) setiap X detik dimulai dari huruf terakhir. Api tidak akan berhenti membakar sampai semua emoji api pada textfield sudah dihapus. Perlu diperhatikan bahwa api dapat secara random muncul kembali kapanpun dan pemain perlu menghapusnya kembali)
func rule10(password string) bool {
	return !containsFire(password)
}

// Check if string contains a number
func containsFire(s string) bool {
	for _, r := range s {
		if r == '🔥' {
			return true
		}
	}
	return false
}

func cheatRule10(password string) string {
	return strings.ReplaceAll(password, "🔥", "")
}
