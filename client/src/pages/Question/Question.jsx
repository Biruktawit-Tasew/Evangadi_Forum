import React, { useState, useEffect, useRef } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import styles from "./question.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Question = () => {
  const title = useRef();
  const description = useRef();
  const navigate = useNavigate();
  // Handle question submission
  async function handleSubmit(e) {
    e.preventDefault();
    const titleValue = title.current.value;
    const descriptionValue = description.current.value;

    if (!titleValue || !descriptionValue) {
      alert("Please provide all required fields");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:2017/api/question/post-question",
        {
          title: titleValue,
          description: descriptionValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Question created successfully");
      title.current.value = "";
      description.current.value = "";
      navigate("/home");
    } catch (error) {
      console.error("❌ Error posting question:", error.message);
      alert(`❌ Failed to post question: ${error.message}`);
    }
  }

  return (
    <section className={styles.main_wrapper}>
      <h2>Steps To Write A Good Question</h2>
      <div className={styles.line}></div>
      <ul className={styles.list_container}>
        <li>
          <FaCircleArrowRight size={12} />
          Summarize your problem in a one-line title
        </li>
        <li>
          <FaCircleArrowRight size={12} />
          Describe your problem in more detail
        </li>
        <li>
          <FaCircleArrowRight size={12} />
          Describe what you tried and what you expected to happen
        </li>
        <li>
          <FaCircleArrowRight size={12} />
          Provide any relevant code or examples
        </li>
        <li>
          <FaCircleArrowRight size={12} />
          Review your question and post it here
        </li>
      </ul>
      <h2 className={styles.post}>Post Your Question</h2>

      <form onSubmit={handleSubmit} className={styles.form_container}>
        <input type="text" placeholder="Question title" ref={title} required />
        <textarea
          rows={7}
          placeholder="Question"
          ref={description}
          required
        ></textarea>
        <button type="submit">Post Question</button>
      </form>
    </section>
  );
};

export default Question;
