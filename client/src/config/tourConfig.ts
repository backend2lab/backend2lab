import { driver } from "driver.js";
import "driver.js/dist/driver.css";


export const startTour = (theme?: "dark" | "light") => {
  const popoverClass =
    theme === "dark"
      ? "dark bg-theme-background text-theme-primary"
      : "light bg-theme-background text-theme-primary";
  const driverObj = driver({
    showProgress: true,
    allowClose: true,
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "End tour",
    overlayColor: "rgba(0, 0, 0, 0.7)",
    popoverClass: popoverClass,
    animate: true,
    steps: [
      {
        element: "#moduleTitle",
        popover: {
          title: "Module Title and Difficulty",
          description:
            "This displays the current module's title and its difficulty level.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#moduleSelector",
        popover: {
          title: "Modules",
          description:
            "This shows all available modules and lets you choose one to work on.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#tab-lab",
        popover: {
          title: "Labs",
          description:
            "This is where you can find interactive labs to practice your skills.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#tab-exercise",
        popover: {
          title: "Check Out Exercises",
          description:
            "This is where you can find exercises to practice what you've learned in the labs.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#serverjs",
        popover: {
          title: "Code Editor",
          description:
            "This is your code editor where you can write and test your code.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#packagejson",
        popover: {
          title: "package.json Editor",
          description:
            "This is your packages.json editor where you can manage your project dependencies.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#console",
        popover: {
          title: "Console",
          description:
            "This is your console where you can see the output of your code.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#runButton",
        popover: {
          title: "Run Code",
          description:
            "Click here to run your code and see the output in the console.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#submitButton",
        popover: {
          title: "Submit Code",
          description:
            "Click here to submit your code and see the output in the console.",
          side: "bottom",
          align: "center",
        },
      },
    ],
  });

  const selectors = [
    "#moduleTitle",
    "#moduleSelector",
    "#tab-lab",
    "#tab-exercise",
    "#serverjs",
    "#packagejson",
    "#console",
    "#runButton",
    "#submitButton",
  ];

  const missing = selectors.filter((sel) => !document.querySelector(sel));

  if (missing.length > 0) {
    console.warn(`Missing selectors: ${missing.join(", ")}. Skipping tour.`);
    return;
  }

  driverObj.drive();
};
