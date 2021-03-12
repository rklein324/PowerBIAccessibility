# Microsoft Power BI Accessibility Checker
This repository is for a capstone project at the University of Washington in partnership with Microsoft to make Power BI reports more accessible for people with disabilities.

The end result will be an accessibility checker that Power BI report creators can run to find issues in their report. Eventually, we hope that some of this will be integrated into the report creation process to make accessibility additions seamless and less of an afterthought

## What it will include:
* User interface that allows you to run the checker and receive a list of accessibility issues highlighted within the report
* Tests/Checks that will be run on the report (automatic and manual)
  - **Check for different markers for multiple series (line/area chart)**
  - Check that all charts have titles/axis titles
  - Check that everything has alt text and walk user through everything with alt-text
  - Show user what the current tab order is and explain what tab order is for/why it is important
  - Check for sliders and suggest drop-down menus instead
  - Check for stacked bar/column chart and suggest clustered instead
* Suggestions generated for the report creator by the checker and how to implement them
* Link to additional information or WCAG for particular accessibility issues when the checker is run
* Documentation

## What it may include:
* Check for how interactions may change report
* Check for data labels turned on and see how many data labels there are (create threshold for when they should be off)
* Specific groups of tests to run
* Documentation for Microsoft on how the checker can be integrated into the report creation process
* Documentation for Microsoft on changes they can make to default settings to make all reports more accessible and make the accessibility features more apparent to report creators
