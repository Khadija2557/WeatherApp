

document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'Enter your Api key here';

    //if you wish to fetch non weather related queries you will use gemini but i have not used gemini for non-weather related queries.
    //I have only implemented weather related queries.
    const geminiApiKey = 'Enter your gemini key here';  
    let originalData = []; 
    
 
      // JavaScript to set the current date and day
    const dateDisplay = document.getElementById('current-date');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = today.toLocaleDateString('en-US', options);

   const chatBox = document.getElementById('chatbot-messages');
   const userInput = document.getElementById('chat-input');


    // Listen for the "Enter" key press on the input field
    userInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            handleUserInput();
        }
});



function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    if (userMessage.toLowerCase() === 'clear') {
        clearChat(); 
        userInput.value = ''; 
        return; 
    }

    appendMessage(userMessage, 'user');
    userInput.value = '';


// Check if the query contains the word 'weather' or other relevant keywords

    if (userMessage.toLowerCase().includes('highest') || userMessage.toLowerCase().includes('lowest') || userMessage.toLowerCase().includes('average')) {
        calculateTemperatureStats(); 

    } else if(userMessage.toLowerCase().includes('today') || userMessage.toLowerCase().includes('tomorrow')){

        fetchWeather(userMessage);
    }

    else{
        appendMessage("Sorry, only able to answer weather related queries", 'bot');
    }
}

function clearChat() {
    chatBox.innerHTML = ''; // Clear all chat messages
}


function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${sender}-message`);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    
}

async function fetchWeather(query) {

    const cityRegex = /in\s([A-Za-z]+(?:\s[A-Za-z]+)*)(?=\s|$)/i;
    const cityMatch = query.match(cityRegex);
    let city= cityMatch ? cityMatch[1] : null;

   
    // Check if the user is asking for today's or tomorrow's weather
    const isToday = query.toLowerCase().includes('today');
    const isTomorrow = query.toLowerCase().includes('tomorrow');

   
    if (!city) {
        appendMessage("Please specify a valid city.", 'bot');
        return;
    }

    //API URL based on the query
   
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;


    try {
       
        const response = await fetch(apiUrl);
        const data = await response.json();
       

        if (!response.ok) {
            throw new Error("City not found");
        }

        if (isToday || (!isToday && !isTomorrow)) {

            const weatherDescription = `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
            appendMessage(weatherDescription, 'bot');

        } else if (isTomorrow) {

         
            apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
            const forecastResponse = await fetch(apiUrl);
            const forecastData = await forecastResponse.json();
           
            if (!forecastResponse.ok) {
                throw new Error("City not found in forecast");
            }
            
            const tomorrowData = forecastData.list.find(item => {
                const forecastTime = new Date(item.dt_txt);
                const now = new Date();
                return forecastTime.getDate() === now.getDate() + 1; // Check if forecast is for tomorrow
            });

            if (tomorrowData) {
                const weatherDescription = `The weather in ${data.name} tomorrow is ${tomorrowData.weather[0].description} with a temperature of ${tomorrowData.main.temp}°C.`;
                appendMessage(weatherDescription, 'bot');

            } else {
                appendMessage("Sorry, I couldn't get tomorrow's forecast.", 'bot');
            }
        }
    } catch (error) {
        appendMessage("Sorry, I couldn't find that location. Please try again.", 'bot');
        
    }
}






function displayWeatherData(weather, city) {
    document.getElementById('data-heading').textContent = `Weather in ${city}`;
    
    document.getElementById('temperature').textContent = weather.temp.toFixed(2);
    document.getElementById('humidity').textContent = weather.humidity;
    document.getElementById('weather-description').textContent = weather.condition;

    // Set weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl; 
    document.getElementById('weather-icon').alt = weather.condition; 

   
}


let currentPage=1;
const rowsPerPage=5;


function populateForecastTable(data, unit = 'C') {
    const tableBody = document.querySelector('#forecast-table tbody');
    tableBody.innerHTML = ''; 

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((entry, index) => {
        const row = document.createElement('tr');

        const iconUrl = `https://openweathermap.org/img/wn/${entry.icon}@2x.png`;
        let displayTemp = entry.temp; 
       

        // Format date
        const dateObj = new Date(entry.date);
        const day = dateObj.toLocaleString('en-US', { weekday: 'long' });
        const dayOfMonth = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const dateFormatted = `${dayOfMonth} ${month}`;  // '21 Oct'

        row.innerHTML = `
            <td><img src="${iconUrl}" alt="Weather Icon" style="vertical-align:middle;"></td>
            <td>${displayTemp.toFixed(2)}°${unit}</td>
            <td>${dateFormatted}</td>
            <td>${day}</td>
        `;
        
        tableBody.appendChild(row);

       //for horizontal line
        if (index < paginatedData.length - 1) {
            const separatorRow = document.createElement('tr');
            separatorRow.innerHTML = `
                <td colspan="4">
                    <div class="separator"></div> 
                </td>
            `;
            tableBody.appendChild(separatorRow);
        }
    });
}




// Listen for the 'Enter' keypress in the search bar
document.getElementById('search-bar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const city = document.getElementById('search-bar').value;
        const spinner = document.getElementById('loading-spinner'); 

        if (city === "") {
            alert("Please enter a city name.");
            return;
        }
    
        // Show spinner while fetching data
        spinner.style.display = 'block';
    
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {

                // Hide spinner after data is loaded
                spinner.style.display = 'none';  
    
                // Extract and process weather data
                const forecast = data.list;
                const dailyData = [];
                const labels = [];
                const temperatureData = [];
                const weatherConditions = {};
    
                for (let i = 0; i < forecast.length; i += 8) {  // Skipping 8 intervals (24 hours)
                    const date = new Date(forecast[i].dt_txt).toLocaleDateString();
                    const temp = forecast[i].main.temp;
                    const humidity = forecast[i].main.humidity;
                    const condition = forecast[i].weather[0].main;
                    const icon = forecast[i].weather[0].icon;
    
                    if (weatherConditions[condition]) {
                        weatherConditions[condition]++;
                    } else {
                        weatherConditions[condition] = 1;
                    }
    
                    dailyData.push({ date, temp, humidity, condition, icon });
                    labels.push(date);
                    temperatureData.push(temp);
                }
    
                originalData = dailyData;
                displayWeatherData(dailyData[0], city);
                generateCharts(labels, temperatureData, weatherConditions);
                populateForecastTable(dailyData);
                document.getElementById('search-bar').value = '';
            })
            .catch(error => {
                spinner.style.display = 'none';  
                alert(error.message);
            });
    }
});





// Variable to hold the chart instances
let weatherChartInstance = null;
let temperatureLineChartInstance = null;
let weatherConditionChartInstance = null;

function generateCharts(labels, temperatureData, weatherConditions) {

    // Destroy existing charts if they exist
    if (weatherChartInstance) {
        weatherChartInstance.destroy();
    }
    if (temperatureLineChartInstance) {
        temperatureLineChartInstance.destroy();
    }
    if (weatherConditionChartInstance) {
        weatherConditionChartInstance.destroy();
    }

    // Bar Chart
    const ctxBar = document.getElementById('weatherChart').getContext('2d');
    weatherChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureData,
                backgroundColor:['rgba(75, 192, 192, 0.2)',
                '#3498db'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white' 
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false 
                    },
                    ticks: {
                        display: false, 
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false 
                    },
                    beginAtZero: true,
                    ticks: {
                        display: false, 
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });


    // Doughnut Chart
    const ctxDoughnut = document.getElementById('weatherConditionChart').getContext('2d');
    weatherConditionChartInstance = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: Object.keys(weatherConditions),
            datasets: [{
                label: 'Weather Conditions',
                data: Object.values(weatherConditions),
                backgroundColor: [
                    '#FF8157',  //clear
                    '#5f7787',  //cloud
                    '#1D6FF2'   //rain
                ],
            
                borderColor: 'transparent', 
            borderWidth: 0  
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white' 
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false 
                    },
                    ticks: {
                        display: false,
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false 
                    },
                    beginAtZero: true,
                    ticks: {
                        display: false,
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });

 
    // Line Chart
    const ctxLine = document.getElementById('temperatureLineChart').getContext('2d');

    // Create a horizontal gradient
    const gradient = ctxLine.createLinearGradient(0, 0, 400, 0); 
    gradient.addColorStop(0, '#FF8157'); // Start color
    gradient.addColorStop(0.5, '#3ECDE0'); // Middle color
    gradient.addColorStop(1, '#1D6FF2'); // End color

    temperatureLineChartInstance = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureData,
                fill: false,
                borderColor: gradient, 
                tension: 0.1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white' 
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false 
                    },
                    ticks: {
                        display: false,
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false 
                    },
                    beginAtZero: true,
                    ticks: {
                        display: false, 
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });


}



const filterIconBtn = document.getElementById('filter-icon-btn');
const filterDropdown = document.getElementById('filter-dropdown');
const filterSelectDropdown = document.getElementById('filter-select-dropdown');

// Toggle dropdown visibility when filter icon is clicked
filterIconBtn.addEventListener('click', function() {
    filterDropdown.classList.toggle('show'); 
});

// Filter data
filterSelectDropdown.addEventListener('change', function () {
    const filterValue = filterSelectDropdown.value;
    let filteredData = [...originalData];  

    // Apply filters based on selected option
    switch (filterValue) {
        case 'ascending':
            filteredData.sort((a, b) => a.temp - b.temp);  
            break;

        case 'descending':
            filteredData.sort((a, b) => b.temp - a.temp);  
            break;

        case 'rain':
            filteredData = filteredData.filter(entry => entry.condition.toLowerCase().includes('rain'));  
            break;

        case 'highest':
            const highestTempDay = filteredData.reduce((max, entry) => (entry.temp > max.temp ? entry : max));
            filteredData = [highestTempDay]; 
            break;

        default:
            filteredData = originalData;  
            break;
    }

    

    // Update the forecast table with filtered data
    populateForecastTable(filteredData); 

    // Hide the dropdown after the selection
    filterDropdown.classList.remove('show');  
});

   

function calculateTemperatureStats() {
    
    const temperatures = originalData.map(entry => entry.temp);

    if (temperatures.length === 0) {
        appendMessage("No weather data available for analysis.", 'bot');
        return;
    }

    const highestTemp = Math.max(...temperatures);
    const lowestTemp = Math.min(...temperatures);
    const averageTemp = (temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length).toFixed(2);

    const message = `This week's highest temperature was ${highestTemp.toFixed(2)}°C, the lowest was ${lowestTemp.toFixed(2)}°C, and the average was ${averageTemp}°C.`;
    appendMessage(message, 'bot');
}




   
});


