package main

import (
	"encoding/json"
	"fmt"
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
	doc := request.Body
	fmt.Println(doc)
	opt := options.NewOptions()
	result, err := simplejson.Convert([]byte(doc), opt)
	fmt.Println(result)
	errMsg := ""
	if err != nil {
		errMsg = err.Error()
	}
	response := BodyResponse{Output: result, Error: errMsg}
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
