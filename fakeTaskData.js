const tasks = [
    {
    "user": 12345,
    "school": "University of California: Berkeley",
    "datetimestamp": "2025-06-04T23:28:00Z",
    "description": "Task description goes here.",
    "title": "Help with tutoring in math.",
    "offer": 100,
    "address": "Barrow Ln, Berkeley, CA 94704",
    "coordinates": [-122.272781, 37.871666],
    "completed": false,
    "accepteduser": 12345,
    "rating": 5,
    "review": "Great experience completing this task!",
    "taskid": "a7595098-b99d-4a0b-bc1d-409e78851b35"
    },
     {
        "user": 12345,
        "datetimestamp": "2025-07-13T00:11:47.000Z",
        "offer": 25,
        "title": "I need a haircut!",
        "description": "Enter description here...",
        "address": "2650 Durant Ave, Berkeley Ca 92405 United States",
        "coordinates": [
            -122.2540339,
            37.8670322
        ],
        "completed": false,
        "school": "University of California: Berkeley",
        "taskid": "a7595098-b99d-4a0b-bc1d-409e78851b34"
    }
]
const userData = {
    "12345" :{
        "uid": "12345",
        "email": "defaultuser@berkeley.edu",
        "password": "$2b$12$EsyKr8v3.rgEZZ/pELvOY.2s/UXGL1dMl7koudy1AG3iQr988Y9.y",//Tasku2025!
        "realPassword": "Tasku2025!",
        "firstname": "Default",
        "lastname": "User",
        "school": "University of California: Berkeley",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsImVtYWlsIjoiZGVmYXVsdHVzZXJAYmVya2VsZXkuZWR1IiwiaWF0IjoxNzUyMzY1MzYxLCJleHAiOjE3NTIzNjg5NjF9.P8VtcoC_Bsgq6T6YYmYitsIq9BEw9XRbqV1NvpkrxjA"

    }
}
module.exports = {tasks, userData}