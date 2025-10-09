# ATMOS Lab Website

This repository contains the source code for the ATMOS Lab website, a static site generated with [Hugo](https://gohugo.io/).

## Outline

The website is designed to showcase the research, people, and publications of the ATMOS Lab. It serves as a central hub for information about the lab's activities and achievements.

## Scope and Functions

The primary functions of this website are:

*   **Information Dissemination:** To provide detailed information about the lab's research areas, ongoing projects, and findings.
*   **Team Showcase:** To introduce the members of the ATMOS Lab, including their roles, expertise, and contact information.
*   **Publication Archive:** To maintain a comprehensive list of all publications from the lab, including journal articles, conference papers, and other scholarly work.
*   **Media and News:** To highlight the lab's presence in the media and share recent news and announcements.
*   **Contact and Collaboration:** To provide a point of contact for potential collaborators, students, and other interested parties.

## Build Process and Data Flow

This website is built using the Hugo static site generator. The process and data flow are as follows:

1.  **Content Management:** All content for the site is written in Markdown files, which are located in the `content/` directory. This includes pages for team members, publications, and general information.
2.  **Data Files:** Structured data, such as lists of publications or announcements, is stored in YAML (`.yaml`) files within the `data/` directory. This separates the data from the presentation layer, making it easier to manage.
3.  **Templates and Layouts:** The HTML structure of the website is defined by templates located in the `layouts/` directory. Hugo uses these templates to render the content into HTML pages.
4.  **Static Site Generation:** When the `hugo` command is run, the Hugo engine reads the content and data files, processes them through the corresponding templates, and generates a complete, static version of the website.
5.  **Output:** The final output is a set of static HTML, CSS, and JavaScript files, which are placed in the `public/` directory. This directory can then be deployed to any web server for hosting.

This workflow ensures that the website is fast, secure, and easy to maintain, as there is no database or server-side processing required.

## Sitemap

The website has the following structure:

*   `/` (Home): The main landing page with an overview of the lab.
*   `/people/`: A directory of all lab members.
    *   `/people/{member-name}/`: Individual profile pages for each member. <-- 'WIP' -->
*   `/about/`: Information about the lab's mission, vision, and history.
*   `/media/`: A collection of media features, news articles, and press releases.  <-- WIP -->
*   `/publications/`: A central page for all publications.
    *   `/publications/journal/`: A dedicated section for journal articles.
