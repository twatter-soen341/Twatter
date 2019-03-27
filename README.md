# Twatter

## Team Members (name, email, github)
| Name                | ID       | E-Mail                     | GitHub Username    |
| ------------------- | -------- | -------------------------- | ------------------ |
| Etienne Berube      | 40052212 | tiennebrb@gmail.com        | EtienneBerube      |
| tarek ait hamouda   | 40044119 | tarekaithamouda@gmail.com  | tarekait1996       |
| Nichita Hariton     | 40052663 | nichitahariton@hotmail.com | Nichita-Hariton    |
| Joanna Lin          | 40055253 | l.joanna19@hotmail.com     | jayohanna          |
| Paul Musat          | 40052092 | pmusat7@gmail.com          | paulMoose          |
| Dean Chong San      | 40061194 | deancs1997@gmail.com       | superDeano         |
| Alexandria Paggabao | 40052084 | a.paggabao@hotmail.com     | a-paggabao         |
| Viveka Anban        | 40063308 | viveka98@hotmail.ca        | viveanban          |
| Abhijit Gupta       | 40066502 | abhijit.gupta1122@gmail.com| imabhijit          |
| Ethel Narra Pangan  |40061530  | narra_pangan@hotmail.com  | narrapangan        |   

## Description
A social platform for ranting about society. Users will see the most triggering posts around in order to get angry and have a bad rest of the day

## Essential Definitions
* **Twatter** : Similar to Twitter in our project. Platform used to post _twats_.
* **Twat**: Similar to tweets/posts. It is a text post that others can comment on or like.
* **Twatline**: This is the page that displays the twats from your followers in latest order.
* **Profile**: Each user has a profile with information about their time on this platform.
* **TwatAge**: The time since the creation of the account (in seconds, days, months or years).
* **TwatScore**: The number of cumulative likes on your twats.

## Core features:
### 1. Like a tweet
   The system should allow an existing user to like a post from another user. The user will click a button and it will change the color to indicate that the user liked the post. The user should be able to like the posts from all Twatter community.
   
### 2. Posting a tweet
   User will be able to post content in the Website. More precisely they will be able to post a 140 character tweet that can be read and liked by other profiles. All the users share on the same main twatter page.

### 3. Follow a User
   The system should allow an existing user to follow another user. User A will click a button "follow" in the profile page of user B. User A will then be able to see all posts from user B in his timeline.

## Optional features:
### 1. Comment a post
   The system should allow an existing user to comment a post from another user. The user will click a button "comment "and it will allow him to write a text expressing his reaction/feelings to the post. This comment should be viewed by everyone that has access to the specific post.
   
### 2. Profile page
   The system should allow an existing user to have a profile page. This page would contain his tweets, name and username. The user should be able to update self-profile and check other users' profile.
   
## Objectives: 
* Learn how to work within a team in an agile environment.
* Learn how to use the MEAN stack.
* Provide the opportunity for everyone to explore new technologies.
* Learn how to effectively separate tasks based on knowledge, expertise, time and interest.

## Encountered Challenges:
* Trouble in clearly defining a user story. It was hard to assign tasks to a poorly written story.
* Coming soon...

## Stack: MEAN  👹

* [MongoDB - NoSql Database](https://docs.mongodb.com/manual/tutorial/getting-started/)
* [Express - framework for NodeJS to sweet things up](https://expressjs.com/en/guide/routing.html)
* [Angular - for the UI ](https://material.angular.io/)
* [Node.js](https://nodejs.org/api/)
### Testing
* [TravisCI](https://travis-ci.org/)

## How to start the app
1. Have [MongoDB](https://www.mongodb.com/download-center/community), [Node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) installed
2. Clone the project
   ```
   git clone https://github.com/twatter-soen341/Twatter
   cd Twatter
   ```
3. Create your branch 
   ```
   git checkout -b 'name-of-your-branch'
   ```
4. In the main directory, install all the dependencies that are listed in the package.json
   ```
   npm install
   ```
5. Set a .env with the contents of pinned file on discord/general. Add this file in the root directory of project
6. In the main directory, start the server
   ```
   node server
   ```
7. In the main directory, start the MongoDB process 
   ```
   mongod
   ```
8. There are three way to start the project
  * To start
   ```
   cd twatter-ui
   npm start 
   ```
  * To run development
   ```
   cd twatter-ui
   npm run dev
   ```
  * To run production
   ```
   cd twatter-ui
   npm run prod
   ```
   
   ## Block Diagram
   ![Block Diagram](block_diagram.png)
