# Knit-VAR
### Tiktok TechJam 2025 Challenge - **5. Visualising Architecture with Knit**

A web-based tool to visualize and analyze dependencies in Kotlin Knit-based projects.  
The tool highlights potential issues, provides suggestions for improvement, and allows interactive exploration of project dependencies.

---

## Features

- **Interactive Dependency Graph**: Visualizes nodes (modules/services) and edges (dependencies) in an intuitive graph layout.
- **Issue Detection**:
  - Circular dependency detection
  - Unused dependency detection
  - Version conflict identification
- **Suggestions & Improvements**: Provides actionable recommendations for refactoring or performance enhancements.
- **Graph Enhancements**:
  - Node color coding based on severity (`default`, `warning`, `critical`)
  - Adjustable edge thickness
  - Zoom and pan interactions
  - Node and edge filtering
- **Export Options**: Export graph data in JSON or CSV formats, and export the visual graph as SVG.
- **Demo/Test Data**: Built-in sample data to showcase features without requiring a Knit project.

> **Screenshot Placeholder:**  
> ![Graph Screenshot](./assets/screenshot_graph.png)

---

## Problem Statement

Understanding and managing dependencies in large Kotlin projects can be challenging. Circular dependencies, unused modules, and transitive issues often reduce maintainability and increase the risk of bugs.  
This tool provides a clear, actionable visualization of dependency relationships, enabling developers to identify and resolve issues quickly.

> **Screenshot Placeholder:**  
> ![Issue Detection Example](./assets/screenshot_issues.png)

---

## Development Tools

- **Frontend**: React, TypeScript
- **Backend**: Node.js (file uploads and server-side analysis)
- **IDE**: IntelliJ
- **Version Control**: GitHub & SourceTree

---

## Libraries & APIs Used

- **React** – Frontend UI framework
- **TypeScript** – Type safety for the frontend
- **D3.js / SVG** – Interactive graph visualization
- **Fetch API** – File upload and backend communication
- **Knit Dependency Analysis** – Custom JS/TS module (`analyzeDependencies.ts`) for detecting cycles, unnecessary dependencies, and generating suggestions

---

## Assets

- Demo/test dataset (`demoDependencyData.ts`) for showcasing graph features
- Icons for warnings/circular dependencies (inline SVG/emoji used)
- No third-party copyrighted material included

---

## Usage

1. ** Setup **
    * Clone the repository and install dependencies using `npm install`.
    * Start the development server with `npm start`.
    * Open `http://localhost:3000` in your browser.
   
2. **Upload a Kotlin `.kt` file** (optional)

    * The tool parses dependencies and displays them in the graph.

3. **Interact with the Graph**

    * Click nodes to view details and suggestions in the sidebar.
    * Click edges to inspect dependencies and issues.
    * Use the search bar to filter nodes.
    * Zoom and pan for better visibility of large graphs.

4. **Export Options**

    * Export CSV/JSON of nodes and edges.
    * Export the graph visualization as SVG.

5. **Demo Data**

    * If no file is uploaded, the tool loads `demoDependencyData` to demonstrate features.

> **GIF Placeholder:**  
> ![Demo GIF](./assets/demo.gif)

---

## Repository
[GitHub Repository](https://github.com/your-username/knit-dependency-visualizer)

---

## Demonstration Video
Watch the project in action on YouTube:  
[![Knit Dependency Visualizer Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
* Duration: < 3 minutes
* Showcases interactive graph, issue detection, and export features

---

## License
MIT License

---

## Acknowledgements
* Inspired by challenges in dependency management for Kotlin Knit projects.
* Visualization ideas inspired by network graph tools.
