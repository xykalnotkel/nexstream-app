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
	"https://invidious.flokinet.to/api/v1",
}

var mockData = `[
	{"videoId": "0e3GPea1Tyg", "title": "MrBeast Squid Game Dalam Kehidupan Nyata!", "author": "MrBeast", "viewCount": 540000000, "lengthSeconds": 1542},
	{"videoId": "84_O4G9F2d8", "title": "Beli PS5 Pro Seharga Rp 10 Juta!", "author": "GadgetIn", "viewCount": 2100000, "lengthSeconds": 750},
	{"videoId": "f62Z8Mmms2g", "title": "Tutorial Next.js & React 2026 Lengkap", "author": "Programming Indo", "viewCount": 1500000, "lengthSeconds": 3600},
	{"videoId": "qZq5F8N-Ggc", "title": "Genshin Impact - Main Sampai Pagi!", "author": "Windah Basudara", "viewCount": 3500000, "lengthSeconds": 10800},
	{"videoId": "1-xGerv5FOk", "title": "10 Penemuan Teknologi Paling Gila di 2026!", "author": "Calon Ilmuwan", "viewCount": 8500000, "lengthSeconds": 650},
	{"videoId": "jfKfPfyJRdk", "title": "lofi hip hop radio - beats to relax/study to", "author": "Lofi Girl", "viewCount": 15000000, "lengthSeconds": 0}
]`

// Handler is the entry point for Vercel Serverless Function
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	query := r.URL.Query().Get("q")
	
	endpoint := ""
	if query == "" || query == "trending" {
		endpoint = "/popular"
	} else {
		endpoint = fmt.Sprintf("/search?q=%s", url.QueryEscape(query))
	}

	success := false

	for _, baseURL := range apiInstances {
		client := http.Client{Timeout: 3 * time.Second}
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
