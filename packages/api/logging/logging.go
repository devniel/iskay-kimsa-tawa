package logging

import (
	"io"
	"log"
	"os"
)

var DefaultLogFilePath = func() string {
	if path := os.Getenv("BACKEND_LOGS_FILE"); path != "" {
		return path
	}
	return "./backend.log"
}()

type GetLoggerParams struct {
	Tag         string
	LogFilePath string
}

// Creates a new logger that prints to console
// and the provided log file or `backend.log“ by default
func GetLogger(params ...string) *CustomLogger {
	var logTag string
	var logFilePath string

	if len(params) > 0 {
		logTag = params[0]
		if len(params) > 1 {
			logFilePath = params[1]
		}
	}

	if logFilePath == "" {
		logFilePath = DefaultLogFilePath
	}

	log.Println("Logs will be printed to file:", logFilePath)

	logFile, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Error opening log file: %v", err)
	}

	multiWriter := io.MultiWriter(os.Stdout, logFile)
	stdLogger := log.New(multiWriter, "", 0)

	logger := &CustomLogger{
		Logger:  stdLogger,
		logFile: logFile,
		tag:     logTag,
	}

	return logger
}
