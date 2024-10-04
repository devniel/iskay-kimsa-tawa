package logging

import (
	"fmt"
	"log"
	"os"
	"time"
)

// CustomLogger embeds the standard logger and adds a Cleanup method
type CustomLogger struct {
	*log.Logger
	logFile *os.File
	tag     string
}

// Cleanup closes the log file
func (l *CustomLogger) Cleanup() {
	if l.logFile != nil {
		l.logFile.Close()
	}
}

// SetTag sets the tag for the logger
func (l *CustomLogger) SetTag(tag string) {
	l.tag = tag
}

func (l *CustomLogger) formatLog(level, message string) string {
	timestamp := time.Now().Format("2006/01/02 15:04:05")
	if l.tag != "" {
		return fmt.Sprintf("%s %s [%s] %s", timestamp, level, l.tag, message)
	}
	return fmt.Sprintf("%s %s %s", timestamp, level, message)
}

func (l *CustomLogger) Info(message string) {
	if err := l.Output(2, l.formatLog("INFO", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Infof(format string, v ...interface{}) {
	message := fmt.Sprintf(format, v...)
	if err := l.Output(2, l.formatLog("INFO", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Debug(message string) {
	if err := l.Output(2, l.formatLog("DEBUG", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Debugf(format string, v ...interface{}) {
	message := fmt.Sprintf(format, v...)
	if err := l.Output(2, l.formatLog("DEBUG", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Warn(message string) {
	if err := l.Output(2, l.formatLog("WARN", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Warnf(format string, v ...interface{}) {
	message := fmt.Sprintf(format, v...)
	if err := l.Output(2, l.formatLog("WARN", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Error(message string) {
	if err := l.Output(2, l.formatLog("ERROR", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Errorf(format string, v ...interface{}) {
	message := fmt.Sprintf(format, v...)
	if err := l.Output(2, l.formatLog("ERROR", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
}

func (l *CustomLogger) Fatalf(format string, v ...interface{}) {
	message := fmt.Sprintf(format, v...)
	if err := l.Output(2, l.formatLog("FATAL", message)); err != nil {
		fmt.Fprintf(os.Stderr, "Error logging message: %v\n", err)
	}
	os.Exit(1)
}
