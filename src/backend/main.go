package main

import (
	"backend/rules"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	// Starting API
	PrintlnYellow("[Main] Password Game API started...")
	port := "8080"

	// Quit handler
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	defer PrintlnRed("[Main] API Terminated...")

	// Gin instance
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// Test Endpoint
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API ready to use!")
	})

	// Main Endpoint -> Check the password
	r.GET("/main", func(c *gin.Context) {
		password := c.Query("password")

		if password == "" {
			PrintlnRed("[Main] Request Failed, Empty Query")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password query parameter is required"})
			return
		}

		// Main Logic
		result, accepted := rules.TestPassword(password)

		c.JSON(http.StatusOK, gin.H{
			"results":  result,
			"accepted": accepted,
		})
	})

	// Get Leaderboard Endpoint
	r.GET("/leaderboard", func(c *gin.Context) {
		difficulty := c.Query("difficulty")
		if difficulty == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Difficulty query parameter is required"})
			return
		}

		leaderboard, err := getLeaderboard(difficulty)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"leaderboard": leaderboard})
	})

	// Get History Endpoint
	r.GET("/history", func(c *gin.Context) {
		username := c.Query("username")
		difficulty := c.Query("difficulty")

		if username == "" || difficulty == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username and difficulty query parameters are required"})
			return
		}

		history, err := getHistory(username, difficulty)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"history": history})
	})

	// Add Game History Endpoint
	r.POST("/addGameHistory", func(c *gin.Context) {
		var requestBody struct {
			Username   string `json:"username"`
			Difficulty string `json:"difficulty"`
			Score      int    `json:"score"`
			Password   string `json:"password"`
			Won        bool   `json:"won"` // Added won field
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		if requestBody.Username == "" || requestBody.Difficulty == "" || requestBody.Score == 0 || requestBody.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username, difficulty, score, and password fields are required"})
			return
		}

		if err := addGameHistory(requestBody.Username, requestBody.Difficulty, requestBody.Score, requestBody.Password, requestBody.Won); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Game history added successfully"})
	})

	// Is New High Score Endpoint
	r.GET("/isNewHighScore", func(c *gin.Context) {
		username := c.Query("username")
		difficulty := c.Query("difficulty")
		score := c.Query("score")

		if username == "" || difficulty == "" || score == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username, difficulty, and score query parameters are required"})
			return
		}

		scoreInt, err := strconv.Atoi(score)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Score must be an integer"})
			return
		}

		isNewHighScore, err := isNewHighScore(username, difficulty, scoreInt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"isNewHighScore": isNewHighScore})
	})

	go func() {
		PrintlnGreen("[Main] Listening on port " + port)
		if err := r.Run("0.0.0.0:" + port); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	<-quit

	PrintlnRed("[Main] Shutting down server...")
}
