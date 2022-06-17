# Klutchh Backend Test

This readme file will help you to understand the structure and API calls. 

## Getting started
The backend is uploaded on internet server with environment variables. 
To test the functionality, open any testing tool such as postman and input the baseUrl as 
"http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/"

## About
- Movies are fetched from the api docs "https://developers.themoviedb.org/3/getting-started/introduction".
- A total of 22382 movies are currently stored in the database (the list is not exhaustive yet).

## APIs

### 1. GET http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/user/test
This is just a testing route.

### 2. POST http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/user/register
- This route registers a user by saving username and password in the database.
- Request body requires three parameters: username, password and password2. (password2 is confirm - password field)
- If a username already exists, it prompts to change the username. 
- Password must be atleast of length 6 and minimum one uppercase is required.

### 3. POST http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/user/login
- This route logins a user if it is already registered. It returns a JWT as login token active for 10 days.
- If user is not registered, it returns a message for the same.

### 4. GET http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/user/profile
- This is a protected route and requires a valid authorization JWT token in header.
- This route returns profile of a user, specifically returns username.

### 5. GET http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/movie/test
This is just a testing route for movie.

### 6. GET http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/movie/fetchMovies/:pageNum
- This route is open for all that fetches 20 movies at a time.
- Since the database contains huge amount of data, pagination technique is used to fetch.
- It requires "pageNum" (number >= 1) as request parameter and returns 20 movies. For example - If pageNum = 1, it fetches 1-20 movies. If pageNum = 2, it fetches 21-40 movies, and so on.

### 7. POST http://klutchh-env.eba-diqzeayt.ap-south-1.elasticbeanstalk.com/movie/rate/:movieId
- This is a protected route and requires a valid authorization JWT token in header.
- It requires "movieId" as request parameter and "rating" in request body. Then it fetches the movie with the id and update the rating taking the average.
- Rating can take the numbers between 1 and 5 only.