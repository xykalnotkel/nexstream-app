package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

var apiInstancesForVideo = []string{
	"https://vid.puffyan.us/api/v1",
	"https://invidious.jing.rocks/api/v1",
	"https://inv.tux.pizza/api/v1",
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, `{"error": "id is required"}`, 400)
		return
	}

	endpoint := fmt.Sprintf("/videos/%s", id)
	success := false

	for _, baseURL := range apiInstancesForVideo {
		client := http.Client{Timeout: 5 * time.Second}
		resp, err := client.Get(baseURL + endpoint)
		
		if err == nil && resp.StatusCode == 200 {
			body, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			
			var check map[string]interface{}
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
		mock := fmt.Sprintf(`{"videoId": "%s", "title": "Video tidak dapat dimuat", "author": "Error Fallback", "descriptionHtml": "Semua API upstream gagal merespon.", "viewCount": 0}`, id)
		w.Write([]byte(mock))
	}
}