package main

import (
	"backend/rules"
	"log"
	"net/http"
	"os"
	"os/signal"
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

		// Check for bad query
		if password == "" {
			PrintlnRed("[Main] Request Failed, Empty Query")
			c.JSON(http.StatusInternalServerError, "")

		} else {
			// Main Logic
			result, accepted := rules.TestPassword(password)

			c.JSON(http.StatusOK, gin.H{
				"results":  result,
				"accepted": accepted,
			})
		}
	})

	// Start server in a goroutine
	go func() {
		PrintlnGreen("[Main] Listening on port " + port)
		if err := r.Run("0.0.0.0:" + port); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Block until a signal is received
	<-quit

	// Perform cleanup
	PrintlnRed("[Main] Shutting down server...")
}
