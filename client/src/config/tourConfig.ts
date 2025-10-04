import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startTour = () => {
     const driverObj = driver({
       showProgress: true,
       allowClose: true,
       nextBtnText: "Next →",
       prevBtnText: "← Back",
       doneBtnText: "End tour",
       overlayColor: "rgba(0, 0, 0, 0.7)",
       animate: true,
       steps: [
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
           element: "#code-editor",
           popover: {
             title: "Code Editor",
             description:
               "This is your code editor where you can write and test your code.",
             side: "bottom",
             align: "center",
           },
         },
         {
           element: "#packages-json-editor",
           popover: {
             title: "Packages JSON Editor",
             description:
               "This is your packages.json editor where you can manage your project dependencies.",
             side: "bottom",
             align: "center",
           },
         },
       ],
     });

  driverObj.drive();
};
