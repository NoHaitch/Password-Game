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
			Username   string   `json:"username"`
			Difficulty string   `json:"difficulty"`
			Score      int      `json:"score"`
			Password   string   `json:"password"`
			Won        bool     `json:"won"`
			Captcha    string   `json:"captcha"`
			Flags      []string `json:"flags"`
			Time       int      `json:"time"`
			CharBanned []string `json:"charBanned"`
			Rule1      int      `json:"rule1"`
			Rule5      int      `json:"rule5"`
			Rule9      int      `json:"rule9"`
			Rule17     float32  `json:"rule17"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		if requestBody.Username == "" || requestBody.Difficulty == "" || requestBody.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username, difficulty, score, and password fields are required"})
			return
		}

		captchaImage, err := base64ToBytes(requestBody.Captcha)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CAPTCHA image"})
			return
		}

		if err := addGameHistory(requestBody.Username, requestBody.Difficulty, requestBody.Score, requestBody.Password, requestBody.Won, captchaImage, requestBody.Flags, requestBody.Time, requestBody.CharBanned, requestBody.Rule1, requestBody.Rule5, requestBody.Rule9, requestBody.Rule17); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Game history added successfully"})
	})

	// Get Highscore Endpoint
	r.GET("/highscore", func(c *gin.Context) {
		username := c.Query("username")
		difficulty := c.Query("difficulty")

		if username == "" || difficulty == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username and difficulty query parameters are required"})
			return
		}

		highscore, err := getHighscore(username, difficulty)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"highscore": highscore})
	})

	// Cheat Endpoint
	r.POST("/cheat", func(c *gin.Context) {
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
			Length      int      `json:"length"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			PrintlnRed("[Main] Cheat Request Failed, Invalid JSON")
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
		length := requestBody.Length

		if password == "" {
			PrintlnRed("[Main] Cheat Request Failed, Empty Password")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
			return
		}

		cheatedPassword, solveable, bannedChars := rules.CheatSolution(password, rule1Var, rule5Var, rule8Var, rule9Var, captcha, rule13Var, rule15Var, rule15Value, rule17Var, length)

		c.JSON(http.StatusOK, gin.H{
			"cheatedPassword": cheatedPassword,
			"solveable":       solveable,
			"rule15Value":     bannedChars,
		})
	})

	// Get all saves of a user
	r.GET("/getSaves", func(c *gin.Context) {
		username := c.Query("username")
		if username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username query parameter is required"})
			return
		}

		saves, err := getSaves(username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"saves": saves})
	})

	// Save Game Endpoint
	r.POST("/saveGame", func(c *gin.Context) {
		var requestBody struct {
			Username     string   `json:"username"`
			Difficulty   string   `json:"difficulty"`
			Password     string   `json:"password"`
			CaptchaImage string   `json:"captchaimg"`
			Captcha      string   `json:"captcha"`
			Flags        []string `json:"flags"`
			Time         int      `json:"time"`
			CharBanned   []string `json:"charBanned"`
			Rule1        int      `json:"rule1"`
			Rule5        int      `json:"rule5"`
			Rule9        int      `json:"rule9"`
			Rule17       float32  `json:"rule17"`
		}

		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		if requestBody.Username == "" || requestBody.Difficulty == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username, difficulty, password fields are required"})
			return
		}

		captchaImage, err := base64ToBytes(requestBody.CaptchaImage)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CAPTCHA image"})
			return
		}

		err = addGameSave(requestBody.Username, requestBody.Difficulty, requestBody.Password, captchaImage, requestBody.Captcha, requestBody.Flags, requestBody.Time, requestBody.CharBanned, requestBody.Rule1, requestBody.Rule5, requestBody.Rule9, requestBody.Rule17)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Game save added successfully"})
	})

	// Load Game Endpoint
	r.GET("/loadGame", func(c *gin.Context) {
		id := c.Query("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID query parameter is required"})
			return
		}

		gameSaveID, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		gameSave, err := loadGameSave(gameSaveID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"gameSave": gameSave})
	})

	// Delete Save Endpoint
	r.DELETE("/deleteSave", func(c *gin.Context) {
		id := c.Query("id")

		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID query parameter is required"})
			return
		}

		saveID, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		err = deleteSave(saveID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Game save deleted successfully"})
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
