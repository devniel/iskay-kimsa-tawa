package controllers

import (
	"encoding/json"
	"net/http"
)

func Ping(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{"message": "Hello World"}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
