import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";

const OnboardingTour = () => {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("hasSeenTour");
        
        console.log("Has seen tour:", hasSeenTour);

      if (!hasSeenTour) {
        const driverObj = driver({
          showProgress: true,
          allowClose: false,
          nextBtnText: "Next →",
          prevBtnText: "← Back",
          doneBtnText: "Finish",
          overlayColor: "rgba(0, 0, 0, 0.7)",
          steps: [
            {
              element: "#lab",
              popover: {
                title: "Create Your First Project",
                description: "Click here to start your first secure project.",
              },
            },
            {
              element: "#exercise",
              popover: {
                title: "Manage Your Secrets",
                description:
                  "This is where you can add and manage your environment secrets safely.",
              },
            },
            {
              element: ".invite-team-btn",
              popover: {
                title: "Invite Your Team",
                description:
                  "Invite your teammates to collaborate securely on this workspace.",
              },
            },
          ],
        });

        driverObj.drive();

        localStorage.setItem("hasSeenTour", "true");
      }
    }, []);

    return null;
};

export default OnboardingTour;
