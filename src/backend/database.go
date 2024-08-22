package main

import (
	"database/sql"
	"fmt"

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
		SELECT score, date, password, won
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
		if err := rows.Scan(&score, &date, &password, &won); err != nil {
			return nil, err
		}

		history = append(history, map[string]interface{}{
			"score":    score,
			"date":     date,
			"password": password,
			"won":      won,
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

// Add a game history entry for the specified username, difficulty, score, password, and won status.
// If the username is not found, it adds the username first.
func addGameHistory(username, difficulty string, score int, password string, won bool) error {
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

	query := `
		INSERT INTO history (username, difficulty, score, password, won)
		VALUES (?, ?, ?, ?, ?);
	`

	_, err = db.Exec(query, username, difficulty, score, password, won)
	if err != nil {
		return err
	}

	updateHighscoreQuery := fmt.Sprintf(`
		UPDATE users
		SET highscore_%s = CASE
			WHEN highscore_%s < ? THEN ?
			ELSE highscore_%s
		END
		WHERE username = ?;
	`, difficulty, difficulty, difficulty)

	_, err = db.Exec(updateHighscoreQuery, score, score, username)
	return err
}

// Checks if score is a new highscore for the specified username and difficulty.
func isNewHighScore(username, difficulty string, score int) (bool, error) {
	query := fmt.Sprintf(`
		SELECT highscore_%s
		FROM users
		WHERE username = ?;
	`, difficulty)

	var currentHighScore int
	err := db.QueryRow(query, username).Scan(&currentHighScore)
	if err != nil {
		if err == sql.ErrNoRows {
			return true, nil
		}
		return false, err
	}

	return score > currentHighScore, nil
}
