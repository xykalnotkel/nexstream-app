package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

var apiInstances = []string{
	"https://vid.puffyan.us/api/v1",
	"https://invidious.jing.rocks/api/v1",
	"https://inv.tux.pizza/api/v1",
}

var mockData = `[
	{"videoId": "jfKfPfyJRdk", "title": "lofi hip hop radio - beats to relax/study to", "author": "Lofi Girl", "viewCount": 15000000},
	{"videoId": "5qap5aO4i9A", "title": "lofi hip hop radio - beats to sleep/chill to", "author": "Lofi Girl", "viewCount": 8000000},
	{"videoId": "4xDzrJKXOOY", "title": "synthwave radio - beats to chill/game to", "author": "Lofi Girl", "viewCount": 3000000},
	{"videoId": "7NOSDKb0HlU", "title": "chill study beats jazz & lofi", "author": "Chillhop Music", "viewCount": 1200000}
]`

// Handler is the entry point for Vercel Serverless Function
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	query := r.URL.Query().Get("q")
	if query == "" {
		query = "lofi"
	}

	endpoint := fmt.Sprintf("/search?q=%s", url.QueryEscape(query))
	success := false

	for _, baseURL := range apiInstances {
		client := http.Client{Timeout: 4 * time.Second}
		resp, err := client.Get(baseURL + endpoint)
		
		if err == nil && resp.StatusCode == 200 {
			body, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			
			var check []interface{}
			if json.Unmarshal(body, &check) == nil {
				w.Write(body)
				success = true
				break
			}
		}
		if err == nil {
			resp.Body.Close()
		}
	}

	if !success {
		w.Write([]byte(mockData))
	}
}
