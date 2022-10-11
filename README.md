# homerus-api

This is the API for Homerus, a website focused on sharing original fictional stories. You can create stories and add chapters to them and also 
create a user / authenticate, etc. I am using typescript, express and prisma in this version. Currently the database i am using for development is SQLITE.  

Once you download de code above, you need to create a .env file on the root of the project containing the following variables

ACCESS_TOKEN_SECRET - jwt secret for access token validation
REFRESH_TOKEN_SECRET - jwt secret for refresh token validation 
DEV_CLIENT_URL - URL of the client that will consume the API 
SECRET_KEY - the secret key for signing jwts

DATABASE_URL - URL of the database -> you can just use the standard value ("file:./dev.db")
PORT -  the port where the api listens on your computer


Once that is done, just run npm install. After that you can run the app using npm run dev.


