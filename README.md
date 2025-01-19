# NFT and Collections Tracker ( Automation )
NFT and Collections Tracker is a backend system designed to track and manage NFT collections with advanced automation. Built with Node.js and powered by Blockspan and Alchemy APIs, it provides robust features for ranking collections, retrieving details like volume, last price, and smart contract data, and storing them in a MongoDB database. 

Key Features:
- Comprehensive Tracking: Tracks rankings, prices, volumes, images, and details of NFT collections and their assets.
- Smart Automation: Automatically identifies and fetches data for top-ranked NFTs and collections not present in the database.
- Dynamic APIs: Offers APIs for top collection rankings, collection details by category, collection searches, and NFT details.
- Integration with Marketplaces: Searches OpenSea and Alchemy to fetch and store missing data dynamically.
- Scheduled Updates: Utilizes cron jobs to update prices and rankings of top and categorized collections.

With over 100+ collections and 1000+ NFTs tracked, this project streamlines NFT data management, enabling seamless updates and real-time insights for users.

## Installation and Starting Instructions 
### Prerequisites
Ensure you have the following installed on your system:
  1. Node.js
  2. npm or yarn


### Installation
  1. Clone the Repository
     ```bash
     git clone git@github.com:humaidhusain98/NFT-AND-COLLECTIONS-TRACKER.git
     cd NFT-AND-COLLECTIONS-TRACKER
     ```
     
  2. Install Dependencies Run the following command to install all the required dependencies listed in package.json:
      ```bash
       npm install
     ```

### Configuration
  1. Environment Variables Create a .env file in the root directory of the project and add the necessary environment variables. A sample .env.example file might be available in the repository for reference
     ```bash
      cp .env.example .env
     ```
  2. Edit the .env File Update the file with your configurations

### Starting the Application
  1. Development Mode To start the app in development mode with hot reloading
     ```bash
     npm run dev
     ```
  2. Production Mode
     ```bash
      npm start
     ```
### Verifying Installation
  1. Open your browser and navigate to :
    ```bash
      http://localhost:<PORT>
    ```
  2. You should see the application running!
