package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gopkg.in/mgo.v2/bson"
)

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s\n", r.RemoteAddr, r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}

func getIndex(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"msg": "JSON To BSON"})
}

func transformProcess(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var doc bson.M
	err := decoder.Decode(&doc)
	if err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bson.M{"items": []bson.M{bson.M{"k": "COLLSCAN", "v": "TODO"}}})
}

func main() {
	apiURL := "/api/v1"
	port := ":8080"
	router := mux.NewRouter()

	api := router.PathPrefix(apiURL).Subrouter()
	api.HandleFunc("/transform", transformProcess).Methods("POST")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("../ui/dist/")))
	router.Use(logRequest)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:1234"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(router)

	srv := &http.Server{
		Handler:      handler,
		Addr:         port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Printf("Waiting for requests at %s ...", port)
	log.Fatal(srv.ListenAndServe())
}
