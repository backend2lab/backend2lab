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
             title: "Create Your First Project",
             description: "Click here to start your first secure project.",
             side: "bottom",
             align: "center",
           },
         },
         {
           element: "#tab-exercise",
           popover: {
             title: "Manage Your Secrets",
             description:
               "This is where you can add and manage your environment secrets safely.",
             side: "bottom",
             align: "center",
           },
         },
         {
           element: ".invite-team-btn",
           popover: {
             title: "Invite Your Team",
             description:
               "Invite your teammates to collaborate securely on this workspace.",
             side: "left",
             align: "start",
           },
         },
       ],
     });

  driverObj.drive();
};
