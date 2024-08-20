package main

import (
	"fmt"
)

func temp() {
	password := "abcdef/awdaga231][131]"
	fmt.Printf("String length: %d\n", len(password))

	// Rule 8 – Your password must include one of this country
	// (Anda harus mencari minimal 10 gambar bendera negara. Tampilkan X bendera saja pada 1 sesi permainan)
	// frontend choose the country and pass the country code

	// Rule 10 – Oh no! Your password is on fire 🔥. Quick, put it out!
	// (Emoji api akan “membakar” 1 huruf (menghapus huruf dan menggantikannya dengan emoji api) setiap X detik dimulai dari huruf terakhir. Api tidak akan berhenti membakar sampai semua emoji api pada textfield sudah dihapus. Perlu diperhatikan bahwa api dapat secara random muncul kembali kapanpun dan pemain perlu menghapusnya kembali)
	// Rule 11 – 🥚 This is my chicken Paul. He hasn’t hatched yet. Please put him in your password and keep him safe
	// (Pastikan emoji telur tidak terhapus. Kalau terhapus, pemain dinyatakan kalah)
	// Rule 12 – Your password must include this CAPTCHA
	// (Anda harus mencari minimal 7 gambar CAPTCHA. Tampilkan 1 gambar CAPTCHA saja pada 1 sesi permainan. Gambar CAPTCHA dapat seolah-olah di-refresh untuk mengganti gambar CAPTCHA)
	// Rule 13 – Your password must include a leap year
	// Rule 14 – 🐔 Paul has hatched ! Please don’t forget to feed him. He eats X 🐛 every Y second
	// (Emoji telur dari rule 11 digantikan dengan emoji ayam. Setiap X detik harus terdapat >= Y emoji ulat. Jika dalam X detik tersebut terdapat < Y ulat, pemain dinyatakan kalah)
	// Rule 15 – A sacrifice must be made. Pick X letters that you will no longer be able to use
	// Rule 16 – Your password must contain one of the following words: I want IRK | I need IRK | I love IRK
	// Rule 17 – At least X% of your password must be in digits
	// Rule 18 – Your password must include the length of your password
	// Rule 19 – The length of your password must be a prime number
	// Rule 20 – Your password must include the current time
	// Rule 21 - Your password must include a brainrot word example (gyatt, rizz, skibidy, and 3 other)

}
