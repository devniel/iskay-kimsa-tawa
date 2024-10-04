package logging

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestLoggerPrintsToDefaultFile(t *testing.T) {
	// Arrange
	logger := GetLogger()
	defer logger.Cleanup()
	defer func() {
		os.Remove(logger.logFile.Name())
	}()

	// Act
	testMessage := "Test log message"
	logger.Println(testMessage)
	time.Sleep(100 * time.Millisecond)

	// Assert
	files, err := filepath.Glob(filepath.Join(".", "*.log"))
	if err != nil {
		t.Fatalf("Failed to list log files: %v", err)
	}

	if len(files) == 0 {
		t.Fatal("No log file was created")
	}

	content, err := os.ReadFile(files[0])
	if err != nil {
		t.Fatalf("Failed to read log file: %v", err)
	}

	if string(content) == "" {
		t.Fatal("Log file is empty")
	}

	if !strings.Contains(string(content), testMessage) {
		t.Errorf("Log file does not contain the test message. Content: %s", string(content))
	}

}

func TestLoggerPrintsToSpecifiedFile(t *testing.T) {
	// Arrange
	logFilePath := "./test.log"
	logger := GetLogger("", logFilePath)
	defer logger.Cleanup()
	defer func() {
		os.Remove(logFilePath)
	}()

	// Act
	testMessage := "Test log message"
	logger.Println(testMessage)
	time.Sleep(100 * time.Millisecond)

	// Assert
	content, err := os.ReadFile(logFilePath)
	if err != nil {
		t.Fatalf("Failed to read log file: %v", err)
	}

	if string(content) == "" {
		t.Fatal("Log file is empty")
	}

	if !strings.Contains(string(content), testMessage) {
		t.Errorf("Log file does not contain the test message. Content: %s", string(content))
	}
}
