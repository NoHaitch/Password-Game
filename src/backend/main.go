package main

import (
	"backend/rules"
	"fmt"
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
	r.POST("/main", func(c *gin.Context) {
		var requestBody struct {
			Password    string   `json:"password"`
			Rule1Var    int      `json:"rule1Var"`
			Rule5Var    int      `json:"rule5Var"`
			Rule8Var    []string `json:"rule8Var"`
			Rule9Var    int      `json:"rule9Var"`
			Captcha     string   `json:"captcha"`
			Rule13Var   int      `json:"rule13Var"`
			Rule15Var   int      `json:"rule15Var"`
			Rule15Value []string `json:"rule15Value"`
			Rule17Var   float32  `json:"rule17Var"`
			Rule18Var   int      `json:"rule18Var"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			PrintlnRed("[Main] Request Failed, Invalid JSON")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		password := requestBody.Password
		rule1Var := requestBody.Rule1Var
		rule5Var := requestBody.Rule5Var
		rule8Var := requestBody.Rule8Var
		rule9Var := requestBody.Rule9Var
		captcha := requestBody.Captcha
		rule13Var := requestBody.Rule13Var
		rule15Var := requestBody.Rule15Var
		rule15Value := requestBody.Rule15Value
		rule17Var := requestBody.Rule17Var
		length := requestBody.Rule18Var

		if password == "" {
			PrintlnRed("[Main] Request Failed, Empty Password")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
			return
		}

		// Main Logic
		result, accepted, rule5Progres, rule9Progres, rule17Progres := rules.TestPassword(password, rule1Var, rule5Var, rule8Var, rule9Var, captcha, rule13Var, rule15Var, rule15Value, rule17Var, length)

		c.JSON(http.StatusOK, gin.H{
			"results":       result,
			"accepted":      accepted,
			"rule5Progres":  rule5Progres,
			"rule9Progres":  rule9Progres,
			"rule17Progres": rule17Progres,
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
			Won        bool   `json:"won"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		if requestBody.Username == "" || requestBody.Difficulty == "" || requestBody.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username, difficulty, score, and password fields are required"})
			return
		}

		fmt.Println(requestBody.Password)

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
