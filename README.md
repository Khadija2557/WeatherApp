
WEATHER CHATBOOT APPLICATION

DESCRIPTION
This project is a weather chatbot built using HTML, CSS, and JavaScript. The bot fetches weather data for a specified city 
and provides responses related to current weather conditions, temperature forecasts, and more. The chatbot can handle 
queries like "What is the weather today in [city]?" or "Show me the highest temperature this week." Additionally, it displays 
forecast data in a table, shows charts for temperatures, and allows filtering and sorting of weather conditions.

FEATURES
•	Real-time Weather Data: Fetches live weather data using the OpenWeatherMap API.
•	City-based Search: Enter a city name to get weather data for that location.
•	Weather Queries: Handles questions about today's or tomorrow's weather, along with temperature statistics (highest, lowest, average).
•	Forecast Table: Displays a 5-day weather forecast with icons, temperature, date, and day of the week.
•	Filtering: Sort forecast data by ascending or descending temperature, filter for rainy days, or show the day with the highest temperature.
•	Clear Chat: Users can type "clear" to clear the chat history.
•	Charts: Includes bar, doughnut, and line charts to display weather trends.

SETUP INSTRUCTIONS
•	A web browser
•	An active API key from OpenWeatherMap (replace apiKey in the script)
•	Internet connection for API requests

HOW TO RUN THE PROJECT
1.	Clone the repository or download the files to your local machine.
2.	Open the index.html file in your browser.
3.	The chatbot and forecast table will load.
4.	Enter a city name or weather query into the input field or search bar to start using the app.

API KEYS
•	OpenWeatherMap API Key: This key is used to fetch weather data. You need to replace the existing apiKey in the JavaScript code with your own key from OpenWeatherMap.
•	Gemini API Key: This key is defined but not used in the current implementation.

API ENDPOINTS USED
1.	Current Weather: https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric
2.	5-day Forecast: https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={apiKey}&units=metric

KEY FUNCTIONALITIES
•	User Input Handling: Listens for the 'Enter' key press to send the message to the chatbot.
•	Weather Fetching: Depending on the query, the bot fetches either current weather or forecast data.
•	Temperature Statistics: Calculates and displays the highest, lowest, and average temperatures for the week.
•	Charts: Utilizes the Chart.js library to generate visualizations for temperature trends and weather conditions.
•	Pagination: Forecast table displays 5 entries at a time, with pagination to show more.
•	Filter and Sort Options: Includes features for filtering data by temperature, weather condition, or showing specific statistics (e.g., highest temperature day).

HOW TO USE CHATBOT
•	Get Current Weather: Type a query such as "What is the weather today in London?" to get the current weather.
•	Get Tomorrow’s Forecast: Type "What is the weather tomorrow in New York?" to get the weather for tomorrow.
•	Get Temperature Statistics: Type "What was the highest temperature this week?" to see the highest temperature.
•	Clear Chat: Type "clear" to remove all messages from the chat.

CHART DESCRIPTIONS
•	Bar Chart: Displays daily temperatures.
•	Doughnut Chart: Shows the distribution of weather conditions (e.g., Clear, Rainy, Cloudy).
•	Line Chart: Visualizes the temperature changes over several days.

CODE STRUCTURE
•	index.html: The main HTML file containing the structure of the page.
•	styles.css: Contains styling for the chatbot and weather table.
•	scripts.js: The core JavaScript file that handles fetching weather data, user input, table population, and chart generation.

TECHNOLOGIES USED:
•	HTML, CSS, JavaScript
•	OpenWeatherMap API: For fetching weather data.
•	Chart.js: For creating weather-related charts.
