package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//Event Struct for mongodb Database
type event struct {
	ID          string `json:"ID"`
	Title       string `json:"Title"`
	Description string `json:"Description"`
}

func homeLink(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome home!")
}

// Client is exported Mongo Database client
var Client *mongo.Client

// Collection object
var Collection *mongo.Collection

// ConnectDatabase is used to connect the MongoDB database
func ConnectDatabase() {
	log.Println("Database connecting...")
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	Client = client
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = Client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
	collection := Client.Database("mydb").Collection("events")
	Collection = collection
	log.Println("Database Connected.")
}

func main() {
	ConnectDatabase()
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", homeLink)
	router.HandleFunc("/event", createEvent).Methods("POST")
	router.HandleFunc("/events", getAllEvents).Methods("GET")
	router.HandleFunc("/events/{id}", getOneEvent).Methods("GET")
	router.HandleFunc("/events/{id}", updateEvent).Methods("POST")
	router.HandleFunc("/events/delete/{id}", deleteEvent).Methods("GET")
	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func createEvent(w http.ResponseWriter, r *http.Request) {
	var newEvent event
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Kindly enter data with the event title and description only in order to update")
	}

	json.Unmarshal(reqBody, &newEvent)
	insertResult, err := Collection.InsertOne(context.TODO(), newEvent)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Added an Event: ", insertResult.InsertedID)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newEvent)
}

func getOneEvent(w http.ResponseWriter, r *http.Request) {
	eventID := mux.Vars(r)["id"]
	if eventID == "" {
		fmt.Fprintf(w, "Add an ID")
	}
	filter := bson.M{"id": eventID}
	var result event
	err := Collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(result)
}

func getAllEvents(w http.ResponseWriter, r *http.Request) {
	filter := bson.M{}
	var results []*event
	var cur *mongo.Cursor
	cur, err := Collection.Find(context.TODO(), filter)
	if err != nil {
		log.Fatal(err)
	}
	for cur.Next(context.TODO()) {
		var elem event
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, &elem)
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(results)
}

func updateEvent(w http.ResponseWriter, r *http.Request) {
	eventID := mux.Vars(r)["id"]
	var updatedEvent event

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Kindly enter data with the event title and description only in order to update")
	}
	json.Unmarshal(reqBody, &updatedEvent)
	filter := bson.M{"id": eventID}
	update := bson.D{
		{"$set", bson.D{
			{"id", updatedEvent.ID},
			{"title", updatedEvent.Title},
			{"description", updatedEvent.Description},
		}},
	}

	updateResult, err := Collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(updateResult)
}

func deleteEvent(w http.ResponseWriter, r *http.Request) {
	eventID := mux.Vars(r)["id"]
	if eventID == "" {
		fmt.Fprintf(w, "Add an ID")
	}
	deleteResult, err := Collection.DeleteOne(context.TODO(), bson.M{"id": eventID})
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(deleteResult)
}
