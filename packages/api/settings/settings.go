package settings

import (
	"fmt"
	"os"
	"sync"

	"github.com/devniel/iskay-kimsa-tawa/packages/api/logging"
)

type Config struct {
	UploadsDir string
	Port       string
}

var (
	config     *Config
	configOnce sync.Once
	logger     = logging.GetLogger("settings")
)

func GetConfig() *Config {
	configOnce.Do(func() {
		config = &Config{}
		initConfig()
	})
	return config
}

func initConfig() {

	// Uploads directory configuration
	uploadsDir := os.Getenv("BACKEND_UPLOADS_DIR")
	if uploadsDir == "" {
		uploadsDir = "./uploads"
	}
	logger.Info(fmt.Sprintf("🗂️ Uploads directory: %s", uploadsDir))

	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		if err := os.MkdirAll(uploadsDir, 0755); err != nil {
			logger.Fatalf("Could not create uploads directory: %v", err)
		}
	}

	config.UploadsDir = uploadsDir

	// Server port configuration
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	config.Port = port
}
