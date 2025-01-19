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
     npm install
     ```
  2. Install Dependencies Run the following command to install all the required dependencies listed in package.json:
