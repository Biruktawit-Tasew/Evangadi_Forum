import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { CiShoppingTag } from "react-icons/ci";
import { IoMdPerson } from "react-icons/io";
import styles from "./home.module.css"; 
import axios from "../../Api/axios";
import { AppState } from "../../App";
import ScaleLoader from "react-spinners/ScaleLoader";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import FetchAnswer from "../../components/FetchAnswer/FetchAnswer";


const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const questionsPerPage = 5; 

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppState);
  const [likedQuestions, setLikedQuestions] = useState([]);
  const [dislikedQuestions, setDislikedQuestions] = useState([]);
  const token = localStorage.getItem("token");
 useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch questions
        const questionsRes = await axios.get("/question/all-questions", {
          headers: { Authorization: `Bearer ${token} `},
        });

        const questions = questionsRes.data.questions;
        setQuestions(questions);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Questions based on the user search input(Query)
  const filteredQuestions = searchQuery
    ? questions?.filter((q) => {
        const queryWords = searchQuery.toLowerCase().split(" ").filter(Boolean); 
        const tags = q.tag?.toLowerCase().split(",") || []; 

        // Check if any query word matches any tag
        return queryWords.some((word) =>
          tags.some((tag) => tag.trim().includes(word))
        );
      })
    : questions;
  // Calculate the subset of questions to display
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  // Handle search input changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredQuestions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const createdDate = new Date(timestamp);
    const timeDifference = now - createdDate; 

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else {
      return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
    }
  };
// Function to handle likes
  const handleLike = async (questionId) => {
    if (likedQuestions.includes(questionId)) {
      return; // Exit if already liked
    }
    try {
      console.log(token);
      await axios.patch(
        `/question/like/${questionId}`,
        {},
        {
          headers: {
            Authorization:` Bearer ${token}`,
          },
        }
      );
      // Update the like count in the UI
      setLikedQuestions((prev) => [...prev, questionId]);
      setDislikedQuestions([]);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.question_id === questionId
            ? question.dislike > 0
              ? {
                  ...question,
                  likes: question.likes + 1,
                  dislike: question.dislike - 1,
                }
              : {
                  ...question,
                  likes: question.likes + 1,
                  dislike: 0,
                }
            : question
        )
      );
    } catch (error) {
      console.error("Error liking question:", error);
    }
  };

  // Function to handle dislikes
  const handleDislike = async (questionId) => {
    if (dislikedQuestions.includes(questionId)) {
      return; // Exit if already liked
    }
    try {
      await axios.patch(
        `/question/dislike/${questionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDislikedQuestions((prev) => [...prev, questionId]);
      setLikedQuestions([]);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.question_id === questionId
            ? question.likes > 0
              ? {
                  ...question,
                  dislike: question.dislike + 1,
                  likes: question.likes - 1,
                }
              : {
                  ...question,
                  dislike: question.dislike + 1,
                  likes: 0,
                }
            : question
        )
      );
    } catch (error) {
      console.error("Error disliking question:", error);
    }
  };
  return (
    <div className={styles.container}>
      {/* Welcome User (Top Right) */}
      <div className={styles.welcomeUser}>
        <h5>
          <>Welcome:</>
          <IoMdPerson className={styles.avatar} size={38} />
          <strong>{user.username}</strong>
        </h5>
      </div>

      {/* Ask Question Button */}
      <div className={styles.askQuestionContainer}>
        <Link to="/question" className={styles.askQuestionButton}>
          Ask Question
        </Link>

        <br />
        <input
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          placeholder="Search questions"
          className={styles.searchInput}
        />
      </div>

      <h4 className={styles.questionsHeading}>Questions</h4>

      <div className={styles.listGroup}>
        {loading ? (
          
<p className={styles.loadingText}>
            <ScaleLoader />
</p>

        ) : currentQuestions.length > 0 ? (
          currentQuestions.map((q) => {
            return (
              <Link
                to={`/answer/${q.question_id}`}
                key={q.question_id}
                className={styles.listItem}
              >
                {/* Profile Image & Username */}
                <div className={styles.profileSection}>
                  <IoPersonCircleOutline size={80} />
                  <div className={styles.username}>{q.user_name}</div>
                </div>

                {/* Question Text */}
                <div className={styles.questionText}>
                  <p className={styles.questionTitle}>{q.title}</p>
                  <p className={styles.questionDescription}>{q.description}</p>
                  <div className={styles.questionMeta}>
                    <p>
                      <MdOutlineDateRange size={20} />
                      {getTimeAgo(q.created_at)}
                    </p>
                    <FetchAnswer key={q.question_id} question={q} />
                    <div className={styles.tagAndLike_container}>
                      <p>
                        <CiShoppingTag size={20} />
                        {q.tag.split(",").map((t) => (
                          <span
                            style={{
                              marginRight: "1rem",
                              outline: "0.5px solid lightgray",
                              padding: "0.1rem 0.3rem",
                              borderRadius: "0.3rem",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </p>
                      <div className={styles.like_container}>
                        <span
                          className={
                            likedQuestions.includes(q.question_id)
                              ? styles.liked
                              : ""
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event from reaching parent Link
                            e.preventDefault(); // Extra safety measure
                            handleLike(q.question_id);
                          }}
                        >
                          <SlLike className={styles.likedIcon} />
                        </span>
                        <span className={styles.likeText}>{q.likes}</span>
                        <span
                          className={
                            dislikedQuestions.includes(q.question_id)
                              ? styles.disliked
                              : ""
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event from reaching parent Link
                            e.preventDefault(); // Extra safety measure
                            handleDislike(q.question_id);
                          }}
                        >
                          <SlDislike className={styles.disLikedIcon} />
                        </span>
                        <span>{q.dislike}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* More (Arrow Icon) */}
                <IoIosArrowForward size={37} className={styles.arrowIcon} />
              </Link>
            );
          })
        ) : (
          <p className={styles.noQuestionsText}>
            {searchQuery
              ? "No matching questions found."
              : "No questions yet..."}
          </p>
        )}

        {/* Pagination Navigation */}
        <div className={styles.pagination}>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            <span className={styles.previous}>Previous</span>
            <span className={styles.previousIcon}>
              <IoIosArrowBack size={23} />
            </span>
          </button>
          <button
            onClick={goToNextPage}
            disabled={
              currentPage ===
              Math.ceil(filteredQuestions.length / questionsPerPage)
            }
            className={styles.paginationButton}
          >
            <span className={styles.next}>Next</span>
            <span className={styles.nextIcon}>
              <IoIosArrowForward size={23} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
