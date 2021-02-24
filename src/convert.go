package main

import (
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"

	"github.com/sindbach/json-to-bson-go/extjson"
	"github.com/sindbach/json-to-bson-go/options"
	"github.com/sindbach/json-to-bson-go/simplejson"
)

// BodyResponse is the returned result
type BodyResponse struct {
	Output string `json:"output"`
	Error  string `json:"error"`
}

// BodyInput is the input
type BodyInput struct {
	Content map[string]interface{} `json:"content"`
	ExtJSON bool                   `json:"extjson"`
	TopName string                 `json:"topname"`
}

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	doc := []byte(request.Body)
	fmt.Println(string(doc))
	var bodyInput BodyInput
	err := json.Unmarshal(doc, &bodyInput)
	if err != nil {
		fmt.Println(fmt.Sprintf("Could not unmarshal JSON string: [%s]", err.Error()))
		return &events.APIGatewayProxyResponse{Body: err.Error(), StatusCode: 404}, nil
	}
	contentString, err := json.Marshal(bodyInput.Content)
	if err != nil {
		fmt.Println(fmt.Sprintf("Could not marshal JSON : [%s]", err.Error()))
		return &events.APIGatewayProxyResponse{Body: err.Error(), StatusCode: 404}, nil
	}
	fmt.Println(string(contentString))
	var result string
	opt := options.NewOptions()
	if bodyInput.ExtJSON == true {
		fmt.Println("extended")
		result, err = extjson.Convert(contentString, true)
	} else {
		fmt.Println("standard")
		result, err = simplejson.Convert(contentString, opt)
	}
	fmt.Println(result)

	errMsg := ""
	if err != nil {
		errMsg = err.Error()
	}
	fmt.Println(errMsg)

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
