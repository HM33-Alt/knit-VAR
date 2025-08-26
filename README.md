# Knit-VAR - 5. Visualising Architecture with Knit

## Problem Statement
Develop a visualization tool for TikTok's open-source dependency injection framework, Knit, that helps developers better understand, analyze, and optimize their projects' dependency structures. This tool should offer clear, intuitive visual representations of dependency graphs, highlight potential issues such as circular or unnecessary dependencies, and provide suggestions for performance or structural improvements.
Knit delivers excellent performance through its unique bytecode manipulation approach. Without visibility, issues may go undetected, leading to tightly coupled code, inefficiencies, and slower onboarding for new contributors. 
By building a dedicated visualization tool, this track aims to make dependency relationships in Knit-based projects more transparent and actionable, ultimately improving code quality, maintainability, and developer productivity.
We welcome you to leverage AI to help you to understand the DI definition or the principle of the Knit framework and build your visualization tools (e.g. build with Trae)

---

## Suggested visualization methods
1. A web page with a user-friendly interface and good user experience.
2. A terminal UI that can display dependencies and interact with user input
3. An IDE plugin that can interact with real production code.
4. Any other creative & effective methods :)

---

## Background
Dependency injection (DI) is a crucial design pattern in modern software development, especially for large-scale applications. It promotes loose coupling, testability, and maintainability by providing objects with their dependencies rather than having them create or find dependencies themselves. As applications grow, managing these dependencies becomes increasingly complex and difficult to track.
Knit is TikTok's open-source dependency injection framework for JVM platforms, including Android. Unlike other DI frameworks such as Dagger or Koin, Knit uses a unique approach by directly modifying bytecode to inject dependencies without generating intermediate proxy. This results in better performance and cleaner code, with dependency injection that performs comparably to hand-written code.
As Knit continues to evolve and support more complex use cases, there's a growing need for tooling that supports deeper visibility into how dependencies are wired and interact, especially for large or rapidly changing projects.

---

## Task Requirements
Participants should have:
- Basic software engineering knowledge and experience with Java or Kotlin development
- Familiarity with IDE usage (experience with IntelliJ IDEA is preferred)

The following knowledge would be beneficial but is not mandatory:
- Understanding of dependency injection concepts
- Experience with visualization libraries or frameworks
- Knowledge of JVM bytecode and ASM (Java bytecode manipulation and analysis framework)

---

## Deliverables
1. Provide the source code of the visualization tool with documentation
2. Include a text description that should explain the features and functionality of the project, and also include:
  - Development tools used to build the project
  - APIs used in the project
  - Assets used in the project
  - Libraries used in the project
  - The relevant problem statement 
  - Explanation of how to use the tool's feature
3. Include a link to the team's public Github repository with Readme
4. Include a demonstration video of the project. The video portion of the submission:
  - should be less than three (3) minutes
  - should include footage that shows the project functioning on the device for which it was built
  - must be uploaded to and made publicly visible on YouTube, and a link to the video must be provided in the text description; and
  - must not include third party trademarks, or copyrighted music or other material unless the Entrant has permission to use such material.

---

## Optional UI Challenge: Building UI for the AI Era with Lynx
While optional, participants are invited to use Lynx for building the user interface (UI) of your project. 
Lynx is a family of cross-platform technologies which allows developers to build native UIs for iOS, Android, and Web all from a single codebase using familiar Web technologies like markups, CSS and React-style declarative JavaScript, offering not only productivity gains, but also an ideal foundation for AI systems to generate, interpret and interact with.
Doing so would mean that you are competing in 2 tracks; the core problem statement here and the UI challenge. You will also be evaluated by 2 sets of judges. It's double the challenge and double the opportunity to be picked as a finalist in the TechJam!

---

## Definitions
- Dependency Injection: A programming technique in which an object or function receives other objects or functions that it requires, as opposed to creating them internally. A youtube video is recommended for that https://youtu.be/J1f5b4vcxCQ
- JVM Bytecode: Java or other JVM platform code is usually stored in bytecode format and executed through the JRE (Java Runtime Environment). ASM is a Java bytecode manipulation and analysis framework, and it is used for analyzing bytecode and generating the Knit modified bytecode.

---

## Resources
- Knit GitHub repository: https://github.com/tiktok/knit (Documentation and examples are included in this repository.)
- IntelliJ Platform Plugin SDK if you want to create any Intellij plugins as a visual form https://plugins.jetbrains.com/docs/intellij/welcome.html
