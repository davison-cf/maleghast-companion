# Maleghast Planner

A React application for building, saving, and managing Mass compositions for the tabletop game Maleghast by Tom Bloom.

## Overview

Maleghast Planner is a utility tool designed to help players create, optimize, and manage their Mass compositions (teams of units) for Maleghast. The application automatically handles point calculations, House (faction) restrictions, and unit limitations based on game rules.

## Features

- **Mass Builder**: Create and customize your Mass compositions with units from various Houses
- **Automatic Point Calculation**: Real-time updates of point totals as you build your Mass
- **Rules Enforcement**: Automatic validation of House-based and count-based unit restrictions
- **Save/Load**: Export your Mass compositions to files and load them later
- **Unit Browser**: Browse available units across all Houses with filtering options

## Project Structure

```
maleghast-planner/
├── public/
│   ├── images/
│   └── svgs/
├── src/
│   ├── app.tsx             # Application routes definition
│   ├── data/               # Game data stored in JSON files
│   │   └── units/          # Unit data organized by House
│   │       ├── abhorers-units.json
│   │       ├── carcass-units.json
│   │       ├── deadsouls-units.json
│   │       ├── gargamox-units.json
│   │       ├── goregrinders-units.json
│   │       ├── igorri-units.json
│   │       ├── houses.json          # House/faction definitions
│   │       ├── malaceLevels.json    # Malace level data
│   │       └── unitTypes.json       # Unit type definitions
│   ├── models/             # TypeScript models/classes for game entities
│   ├── services/           # Services for data retrieval and manipulation
│   └── components/         # React components
└── ...
```

## Technical Details

- Built with React and TypeScript (TSX)
- Data is stored in JSON files in the application
- Responsive design for desktop and mobile use

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Start the development server
   ```
   npm start
   ```

## Usage

1. Select a House (faction) to build your Mass around
2. Add units to your Mass composition
3. Apply upgrades and customize units as needed
4. Save your Mass composition to a file for later use

## Development Status

Currently in active development, approaching MVP completion.

## License

[Include license information here]

## Acknowledgements

Maleghast is a tabletop game created by Tom Bloom. This application is an unofficial fan project.