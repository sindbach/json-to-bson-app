package main

import (
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"github.com/sindbach/json-to-bson-go/options"
	"github.com/sindbach/json-to-bson-go/simplejson"
)

// BodyResponse is the returned result
type BodyResponse struct {
	Output string `json:"output"`
	Error  string `json:"error"`
}

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	opt := options.NewOptions()
	result, err := simplejson.Convert([]byte(request.Body), opt)
	response := BodyResponse{Output: result, Error: err.Error()}

	bodyresponse, err := json.Marshal(&response)
	if err != nil {
		return &events.APIGatewayProxyResponse{Body: err.Error(), StatusCode: 404}, nil
	}
	return &events.APIGatewayProxyResponse{
		StatusCode:      200,
		Headers:         map[string]string{"Content-Type": "application/json"},
		Body:            string(bodyresponse),
		IsBase64Encoded: false,
	}, nil
}

func main() {
	lambda.Start(handler)
}
