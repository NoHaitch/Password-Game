package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// Global variable for the database
var db *sql.DB

// Connects to the database.
// If there is no database, then it creates a new one.
func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./game_data.db")
	if err != nil {
		PrintlnRed("[Main] DATABASE ERROR: " + err.Error())
	}

	// Create users table if it does not exist
	userTableCreationSQL := `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL,
			highscore_easy INTEGER DEFAULT 0,
			highscore_medium INTEGER DEFAULT 0,
			highscore_hard INTEGER DEFAULT 0
		);
	`
	_, err = db.Exec(userTableCreationSQL)
	if err != nil {
		PrintlnRed("[Main] DATABASE ERROR: " + err.Error())
	}

	// Create history table if it does not exist
	historyTableCreationSQL := `
			CREATE TABLE IF NOT EXISTS history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL,
			difficulty TEXT NOT NULL,
			score INTEGER NOT NULL,
			date DATETIME DEFAULT CURRENT_TIMESTAMP,
			password TEXT NOT NULL,
			won BOOLEAN NOT NULL DEFAULT FALSE,
			captcha_image BLOB,
			flags TEXT,
			time INTEGER,
			char_banned TEXT,
			rule1 INTEGER,
			rule5 INTEGER,
			rule9 INTEGER,
			rule17 REAL,
			FOREIGN KEY(username) REFERENCES users(username)
		);
	`
	_, err = db.Exec(historyTableCreationSQL)
	if err != nil {
		PrintlnRed("[Main] DATABASE ERROR: " + err.Error())
	}
}

func init() {
	initDB()
}

// Get top 10 users with the highest score for the given difficulty.
func getLeaderboard(difficulty string) ([]string, error) {
	query := fmt.Sprintf(`
		SELECT username, highscore_%s
		FROM users
		WHERE highscore_%s > 0
		ORDER BY highscore_%s DESC
		LIMIT 10;
	`, difficulty, difficulty, difficulty)

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var leaderboard []string
	for rows.Next() {
		var username string
		var highscore int
		if err := rows.Scan(&username, &highscore); err != nil {
			return nil, err
		}
		leaderboard = append(leaderboard, fmt.Sprintf("%s: %d", username, highscore))
	}

	return leaderboard, nil
}

// Get the game history for the specified username and difficulty.
func getHistory(username, difficulty string) ([]map[string]interface{}, error) {
	query := `
		SELECT score, date, password, won, captcha_image, flags, time, char_banned, rule1, rule5, rule9, rule17
		FROM history
		WHERE username = ? AND difficulty = ?
		ORDER BY date DESC;
	`

	rows, err := db.Query(query, username, difficulty)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []map[string]interface{}
	for rows.Next() {
		var score int
		var date, password string
		var won bool
		var captchaImage []byte
		var flagsJSON string
		var time int
		var charBannedJSON string
		var rule1, rule5, rule9 int
		var rule17 float64

		if err := rows.Scan(&score, &date, &password, &won, &captchaImage, &flagsJSON, &time, &charBannedJSON, &rule1, &rule5, &rule9, &rule17); err != nil {
			return nil, err
		}

		captchaImageBase64 := base64.StdEncoding.EncodeToString(captchaImage)

		var flags []string
		if err := json.Unmarshal([]byte(flagsJSON), &flags); err != nil {
			return nil, err
		}

		var charBanned []string
		if err := json.Unmarshal([]byte(charBannedJSON), &charBanned); err != nil {
			return nil, err
		}

		history = append(history, map[string]interface{}{
			"score":        score,
			"date":         date,
			"password":     password,
			"won":          won,
			"captchaImage": captchaImageBase64,
			"flags":        flags,
			"time":         time,
			"charBanned":   charBanned,
			"rule1":        rule1,
			"rule5":        rule5,
			"rule9":        rule9,
			"rule17":       rule17,
		})
	}

	return history, nil
}

// Adds a new username with no highscore.
func addUser(username string) error {
	query := `
		INSERT INTO users (username)
		VALUES (?);
	`

	_, err := db.Exec(query, username)
	return err
}

// Updates the user's highscore if the new score is higher.
func updateHighscoreIfNeeded(username, difficulty string, newScore int) error {
	currentHighscore, err := getHighscore(username, difficulty)
	if err != nil {
		return err
	}

	if newScore > currentHighscore {
		query := fmt.Sprintf(`
			UPDATE users
			SET highscore_%s = ?
			WHERE username = ?;
		`, difficulty)

		_, err := db.Exec(query, newScore, username)
		if err != nil {
			return err
		}
	}

	return nil
}

// Add a game history entry and update highscore if necessary
func addGameHistory(username, difficulty string, score int, password string, won bool, captchaImage []byte, flags []string, time int, charBanned []string, rule1, rule5, rule9 int, rule17 float32) error {
	var userExists bool
	err := db.QueryRow(`SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)`, username).Scan(&userExists)
	if err != nil {
		return err
	}

	if !userExists {
		if err := addUser(username); err != nil {
			return err
		}
	}

	flagsJSON, err := json.Marshal(flags)
	if err != nil {
		return err
	}

	charBannedJSON, err := json.Marshal(charBanned)
	if err != nil {
		return err
	}

	query := `
		INSERT INTO history (username, difficulty, score, password, won, captcha_image, flags, time, char_banned, rule1, rule5, rule9, rule17)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err = db.Exec(query, username, difficulty, score, password, won, captchaImage, flagsJSON, time, charBannedJSON, rule1, rule5, rule9, rule17)
	if err != nil {
		return err
	}

	if err := updateHighscoreIfNeeded(username, difficulty, score); err != nil {
		return err
	}

	return nil
}

// Get the current user's highscore for a specified difficulty.
func getHighscore(username, difficulty string) (int, error) {
	var highscore int

	query := fmt.Sprintf(`
        SELECT highscore_%s
        FROM users
        WHERE username = ?;
    `, difficulty)

	err := db.QueryRow(query, username).Scan(&highscore)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}

	return highscore, nil
}

func base64ToBytes(base64Str string) ([]byte, error) {
	if strings.Contains(base64Str, "data:image") {
		parts := strings.Split(base64Str, ",")
		base64Str = parts[1]
	}

	return base64.StdEncoding.DecodeString(base64Str)
}
