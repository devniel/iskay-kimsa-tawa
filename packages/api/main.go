package main

import (
	"net"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"

	"github.com/devniel/iskay-kimsa-tawa/packages/api/logging"
	"github.com/devniel/iskay-kimsa-tawa/packages/api/routes"
	"github.com/devniel/iskay-kimsa-tawa/packages/api/settings"
)

func main() {

	// Envs loading from file .env if available using dotenv
	godotenv.Load()

	// Setup logging
	logger := logging.GetLogger("main")
	defer logger.Cleanup()

	// Setup config
	config := settings.GetConfig()

	// Setup db
	// db.Init()

	// Setup the chi api router
	r := chi.NewRouter()

	// Setup routes
	routes.SetupRoutes(r)

	// Start server
	server := &http.Server{
		Addr:    ":" + config.Port,
		Handler: r,
	}

	listener, err := net.Listen("tcp", server.Addr)
	if err != nil {
		logger.Fatalf("Error binding to port %s: %v", config.Port, err)
	}

	logger.Info("🚀 Server is running on http://localhost:" + config.Port)

	err = server.Serve(listener)
	if err != nil && err != http.ErrServerClosed {
		logger.Fatalf("Error starting server: %v", err)
	}

}
