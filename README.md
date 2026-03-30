# CheckUp - NBA Player Comparison Application

## Overview
CheckUp is a full-stack web application that allows users to search, view, and compare NBA player statistics for the current season. The application pulls live data from the BallDontLie API, persists it to a PostgreSQL database, and exposes it through a RESTful API built with Spring Boot. The frontend is built with React and features a clean, dark-themed UI.

## Features
- **Player Search** — Search for any active NBA player by name with debounced real-time results
- **Player Comparison** — Select up to two players to compare their season averages side by side with green/red highlighting to indicate which player leads each statistical category
- **Season Averages** — View a full table of all player season averages with sortable columns and filters by name, team, and position
- **League Leaders** — A live leaderboard showing the top 5 players in key statistical categories including Points, Assists, Rebounds, Steals, Blocks, FG%, and 3P%
- **Recent Game Stats** — View a player's most recent game performance alongside their season averages
- **Automated Data Sync** — Scheduled tasks automatically update games, player rosters, and stats nightly to keep the database current

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3** — REST API, dependency injection, scheduling
- **Spring Data JPA / Hibernate** — ORM and database interaction
- **PostgreSQL** — Relational database
- **ModelMapper** — DTO mapping
- **Maven** — Dependency management

### Frontend
- **React 18** — Component-based UI
- **Axios** — HTTP client for API calls
- **Bootstrap 5** — Base styling utilities
- **Custom CSS** — Dark theme and component-level styling
- **React Router** — Client-side routing

### External API
- **BallDontLie API v1** — Source of NBA player, game, and statistics data
