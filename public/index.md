# FreeCodeCamp Microservices

## Timestamp service

User stories:

1. I can pass a string as a parameter, and it will check to see whether that string contains either a unix timestamp or a natural language date (example: January 1, 2016)
2. If it does, it returns both the Unix timestamp and the natural language form of that date.
3. If it does not contain a date or Unix timestamp, it returns null for those properties.

Example usage:

- <https://szib-fcc-microservices.herokuapp.com/timestamp/253636>
- <https://szib-fcc-microservices.herokuapp.com/timestamp/December%2015,2016>

Example response:<br>
`{"unix":1481760000,"natural":"December 15,2016"}`

--------------------------------------------------------------------------------

## Header parser service

User Story: I can get the IP address, language and operating system for my browser.

Example usage:<br>
<https://szib-fcc-microservices.herokuapp.com/header_parser>

Example response:<br>
`{"ipaddress":"xxx.xxx.xxx.xxx","software":"Windows NT 10.0; Win64; x64","language":"en-GB"}`

--------------------------------------------------------------------------------

## URL shortener service

User Stories:

- I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
- If I pass an invalid URL that doesn't follow the valid <http://www.example.com> format, the JSON response will contain an error instead.
- When I visit that shortened URL, it will redirect me to my original link.

Example creation usage:<br>
<https://szib-fcc-microservices.herokuapp.com/tinyurl/new/http://www.google.com>

Example creation response:<br>
`{"url":"<http://www.google.com","id":"ed646a3334ca891fd3467db131372140","_id":"5881f8751313b5001155e01b"}>`

Example usage:<br>
<https://szib-fcc-microservices.herokuapp.com/tinyurl/ed646a3334ca891fd3467db131372140> will redirect to <http://www.google.com>

--------------------------------------------------------------------------------

## Image Search Abstraction Layer

User Stories:

- I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
- I can paginate through the responses by adding a ?offset=2 parameter to the URL.
- I can get a list of the most recently submitted search strings.

Endpoints:

- <https://szib-fcc-microservices.herokuapp.com/imagesearch/lolcat>
- <https://szib-fcc-microservices.herokuapp.com/imagesearch/lolcat/offset/10>
- <https://szib-fcc-microservices.herokuapp.com/imagesearch_history>
