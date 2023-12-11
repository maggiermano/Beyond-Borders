# CS171-Farm Force
### Team Members: Roy Onyando, Ivy Tirok, and Maggie Mano

## Project Description
Moving and choosing a new place to live, whether for work or long-term, can be both exciting and stressful. "Beyond Borders" is an interactive tool crafted to assist international students and newcomers in navigating this significant life decision. It offers a personalized experience where users answer questions to get state recommendations aligning with their preferences. Additionally, the tool provides detailed visualizations and state comparisons, emphasizing demographics, crime rates, housing costs, and climate.

## URL to Website: https://codangels.github.io/Beyond-Borders/

## URL to Video: https://drive.google.com/file/d/1O_epPNFzzsnH4zZhn-WqrL2KLnUmPeb8/view?usp=drive_link

## Project Structure

- **css/**: Contains the library CSS file (fullpage.js) and our custom style.css.
- **data/**: Stores processed data files in .csv and .json formats for all visualizations.
- **img/**: Includes images for backgrounds and state attractions.
- **index.html/**: Main HTML file for our website.
- **js/**: 
  - **bubble.js/**: Visualizes cost of living and housing prices, categorized by low, medium, and high.
  - **climate.js/**: Displays various climate elements like rainfall, temperature, humidity, and snow for the matched state.
  - **compareStateVis.js/**: A bar graph allowing users to guess and view their matched state's ranking based on various factors.
  - **congrats.js/**: A US map visualization highlighting the selected state and announcing the matched state.
  - **fullpage.extensions.min.js/**: Imported library for implementing multiple website pages.
  - **fullpage.js/**: Complements the above library for multiple pages implementation.
  - **heatMap.js/**: US map visualization showing factors like healthcare costs, average temperature, air quality index, and happiness score across states.
  - **heatMapButtons.js/**: Implements buttons for toggling visualizations in the heatmap.
  - **main.js/**: Central JS file storing instances of different classes on our website.
  - **mapVis.js/**: Visualizes US states, highlighting those matched based on user preferences.
  - **peopleVis.js/**: Shows demographics of the matched state and allows comparison with other states.
  - **question.js/**: Collects user preferences on political affiliation, legality of abortion, climate, and racial diversity.
  - **treemapVis.js/**: Visualizes industries in the matched state, their national ranking, and top employers.
