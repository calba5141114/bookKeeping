# pulling down node.js version 10 image I believe it's built on Debian
from node:10
# setting up working directory
WORKDIR /app/src/
# Copying package dependencies list 
COPY package.json .
COPY package-lock.json .
# installing package dependencies from NPM 
RUN npm install
# deciding which ports this application will communicate through at runtime.
EXPOSE 3000
# A command which will run at runtime this references npm start script in package.json
CMD [ "npm", "start" ]