Hosted front-end:

https://clinquant-medovik-161e95.netlify.app/

*Since the project utilizes free services, the server, frontend or database may not be active if they have not been used for a few days

If you want to run the project locally: 

<p style="font-size: large"> For the purpose of this example I have picked port 3000 for my server and 5173 for my front-end,
but you can choose whichever port suits you. </p>

## 1. Create a Google account so that you can use their api services. For this project we need their calendar api.
### 1.1 Creating your project.
- After creating the account you need to go to https://console.cloud.google.com
There, on the top left side you will see a button 'Select a project' -> 'New project' <br>
  <img height="50" width="250" src="./img.png" style="padding: 10px"/>
- After giving it a name go to 'Select a project' again and click on your newly created project
- From 'Quick access' go to 'APIs and services'
This will lead you to a page that has this menu <br>
  <img height="200" width="300" src="./img_2.png" style="padding: 10px"/>
- Go to 'OAuth consent screen'
- Give your app a name, enter your email
- Mark 'External'
- Enter your desired email again and finish

### 1.2 Configuring settings.
#### 1.2.1 Audience.
- Now that you've set up your OAuth you will get a new menu, go to 'Audience' <br>
  <img height="240" width="300" src="./img_1.png" style="padding: 10px"/>
- Add as many test users as you like so that you may test the app's ability to add events to the Google calendar
#### 1.2.2 Clients.
- From the same menu go to 'Clients' and then 'Create client'
- For 'Application type' pick 'Web application'
- 'Authorized JavaScript origins' can be left empty since logins are handled by better-auth on the server-side
- On 'Authorized redirect URIs' add 'http://localhost:7000/api/auth/callback/google'
- Add the client secret and client ID to the .env file located at back/config/.env
#### 1.2.3 Data Access.
- From the same menu go to 'Data Access' and then 'Add or remove scopes'
- This will open a new menu, click on the 'Google API Library' link
- Search for 'calendar' and then click on 'Google Calendar API' -> 'Enable' 
- Now go back to the same menu from the first step by clicking 'OAuth consent screen' -> 'Data access' -> 'Add or remove scopes'
- Search and add 'calendar.events'