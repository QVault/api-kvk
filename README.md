# Documentation for Business and Trade Register API

This API is designed to interact with a business and trade registration system for the API of Arubas KVK Registry, providing functionalities to search for businesses and retrieve detailed registration information. The following outlines the key components, endpoints, and functionalities of the API. All it really does it take two api endpoints and merges them into one. KVK has announced that they are putting the api behind a paywall, I dont know if that also means the API will change. Anyways this is my attempt at a wrapper that provides the data is a cleaner format, still some redundancy, but works for me. AI Generated Documentation.

API Workflow/Pipeline

1. Perform a search with a given `searchTerm` and other optional parameters to filter the results.
2. The API will return a list of `Dossier` objects based on the search criteria.
3. For each `Dossier`, the API will then fetch detailed information from the trade register.
4. The `transformBusinessData` utility will merge the detailed trade register data with the business register data into a comprehensive `Business` object.
5. The API returns the transformed `Business` objects in the response.

## Responses

Responses are returned as JSON objects, with `Content-Type: application/json`. Each `Business` object in the response contains combined information from both the business register and the trade register, providing a full picture of each business's registration details.

This documentation provides an overview of the API's capabilities, data models, endpoints, utility functions, and general usage pattern. It is intended to help developers understand how to integrate with and utilize the API in their applications.# api-kvk

## Models
### Dossier
A `Dossier` object represents a business registration dossier, which contains:

- `dossiernummer`: The unique registration and branch number of the business.
- `dossiernummerString`: A string representation of the dossier number.
- `bedrijfsnaam`: The official name of the business.
- `handelsnaam`: Any alternate trade name the business may use.
- `rechtsvorm`: The legal form of the business.
- `isActief`: Indicates whether the business is currently active.
- `vestigingAdres`: The address of the business.

### HandelRegisterResponse
A `HandelRegisterResponse` object contains detailed information from the trade register about a particular business, including:

- `hoofdbranch`: The main branch of the business.
- `bestuur`: A list of managers and their details.
- `kapitaalGestort`: The amount of capital invested in the business.
- `kapitaalValutaId`: The currency ID of the invested capital.
- `doelstellingNL`: The objective of the business in Dutch.
- `status`: The current status of the business.
- `productenBeschikbaar`: Indicates whether products are available from the business.
- `id`: The unique identifier of the business in the trade register.

## Utils

### transformBusinessData
`transformBusinessData` function is used to merge data from the `Dossier` and `HandelRegisterResponse` models into a unified `Business` object, which provides a comprehensive view of a business's registration details.

## Endpoints

### Fetch Details for Businesses
Endpoint: `/api/v1/bedrijf/public/HANDELSREGISTER/{coreCode}/{branchId}`
Method: `GET`

Fetches detailed information for businesses based on their core registration number and branch ID. The response is an array of `HandelRegisterResponse` objects.

### Fetch Businesses with Search Term
Endpoint: `/api/v1/bedrijf/public/search`
Method: `GET`

Allows searching for businesses using a search term and filters for active/inactive status. Pagination is supported via `skip` and `take` parameters.

## Functions

### fetchDetailsForBusinesses
Accepts an array of `Dossier` objects and returns detailed information for each business by making parallel calls to the detailed information endpoint.

### fetch
Handles an incoming request to the API, parsing query parameters to conduct a search, and then fetches detailed information for each result using `fetchDetailsForBusinesses`. The merged results are returned as a JSON response.
