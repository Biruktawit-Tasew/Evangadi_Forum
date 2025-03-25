import React from "react";
import styles from "./howItWorks.module.css";
import {
  FaUsers,
  FaQuestionCircle,
  FaHandsHelping,
  FaBullhorn,
  FaVideo,
  FaGlobe,
  FaList,
  FaDumbbell,
} from "react-icons/fa"; // Import icons

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Join the Community",
      description:
        "Sign up for the Evangadi Forum using your Evangadi Networks Bootcamp credentials or create a new account. Connect with fellow bootcamp participants and alumni.",
      icon: <FaUsers color={"#344767"} />, // Changed color to a more professional tone
    },
    {
      number: 2,
      title: "Ask Questions & Share Knowledge",
      description:
        "Post your questions, share your insights, and engage in discussions related to your bootcamp projects, coding challenges, and career development.",
      icon: <FaQuestionCircle color={"#344767"} />,
    },
    {
      number: 3,
      title: "Get Help & Provide Support",
      description:
        "Receive assistance from experienced mentors and peers when you face coding roadblocks. Offer your expertise to help others and build your reputation.",
      icon: <FaHandsHelping color={"#344767"} />,
    },
  ];

  const steps2 = [
    { icon: <FaVideo />, text: "Start by watching the lecture videos" },
    { icon: <FaGlobe />, text: "Attend the live discussion sessions" },
    { icon: <FaList />, text: "Complete the checklist items of the week" },
    { icon: <FaDumbbell />, text: "Work on the weekly exercises" },
    { icon: <FaUsers />, text: "Attend the group discussion sessions" },
  ];

  return (
    <div className={styles.howItWorksContainer}>
      <h2 className={styles.sectionTitle}>How Evangadi Forum Works</h2>
      <div className={styles.stepsGrid}>
        {steps.map((step) => (
          <div key={step.number} className={styles.stepContainer}>
            <div className={styles.stepIconWrapper}>{step.icon}</div>
            <div className={styles.stepContent}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.InfoContainer}>
        <div className={styles.infoSection}>
          <h3>How It Works Introduction</h3>
          <p>
            Welcome to EVANGADI FORUM, a dynamic platform where technology
            enthusiasts from all backgrounds come together to connect, share
            ideas, and solve problems collaboratively. Whether you're a beginner
            exploring the world of tech or an experienced professional looking
            to exchange insights, our forum provides the perfect space for
            meaningful discussions. Our goal is to make it easier for you to
            find solutions, seek guidance, and learn from a community of
            like-minded individuals who are passionate about technology. Here,
            you can ask questions, share your expertise, and contribute to
            discussions that help others grow in their tech journey. By
            participating in EVANGADI FORUM, you become part of a supportive
            network where knowledge is freely exchanged, ideas are refined, and
            innovation thrives. No matter where you are in your tech journey,
            this is the place to engage, learn, and collaborate with fellow
            enthusiasts who share your interests.
          </p>
        </div>
        <div className={styles.infoSection}>
          <h3>Creating an Account</h3>
          <p>
            Joining our community is simple and takes just a few moments. To
            become a member of EVANGADI FORUM, start by clicking the 'Sign Up'
            button located at the top right corner of the page. From there,
            you'll be guided through a quick and easy registration process.
            Begin by entering your email address, choosing a unique username,
            and setting a secure password. Once you've completed these steps,
            we’ll send a confirmation email to the address you provided. Simply
            click on the link in the email to verify your account and activate
            your membership. Once your account is activated, you’ll gain full
            access to the forum, allowing you to ask questions, participate in
            discussions, and connect with other tech enthusiasts. Becoming a
            member opens the door to a world of knowledge-sharing,
            problem-solving, and networking with like-minded individuals who
            share your passion for technology.
          </p>
        </div>
      </div>

      {/* This section remains untouched as per your instructions */}
      <div className={styles.outerContainer}>
        <div className={styles.container}>
          <h2 className={styles.title}>Topics that we cover includes</h2>
          <p className={styles.description}>
            These five steps have been refined and perfected across numerous
            cohorts to accelerate students' journey to proficiency.
          </p>
          <div className={styles.steps2}>
            {steps2.map((step, index) => (
              <div key={index} className={styles.step}>
                <span className={styles.icon}>{step.icon}</span>
                <span className={styles.text}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.Rightcontainer}>
          <img src="https://algorithmman.com/wp-content/uploads/2024/04/programming-languages.jpg" />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;