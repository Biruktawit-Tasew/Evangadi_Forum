import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../../Api/axios";
import styles from "./answer.module.css";
import { useRef } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaCircleArrowRight } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
const getAnswer = () => {
  const { question_id } = useParams();
  const token = localStorage.getItem("token");
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const answersPerPage = 5; // Number of questions per page
  const description = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const descriptionValue = description.current.value;

    if (!descriptionValue) {
      alert("Please provide all required fields");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/answers/post-answers/${question_id}`,
        {
          answer: descriptionValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Answer posted successfully");
      description.current.value = "";
      await axios
        .get(`/answers/${question_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAnswer(response.data.Answers);
        });
    } catch (error) {
      console.error("❌ Error posting answer:", error.message);
      alert(`❌ Failed to post answer: ${error.message}`);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`/question/${question_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setQuestion(response.data.question);
          });
        await axios
          .get(`/answers/${question_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setAnswer(response.data.Answers);
          });
      } catch (err) {
        console.log(err);
        setError(
          err.response?.data?.message ||
            "No Answer Found for the asked Question! Be the First to Answer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [question_id, token]);

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  // Calculate the subset of questions to display
  const indexOfLastAnswers = currentPage * answersPerPage;
  const indexOfFirstAnswers = indexOfLastAnswers - answersPerPage;
  const currentAnswers = answer.slice(indexOfFirstAnswers, indexOfLastAnswers);
  // Handle search input changes
  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   setCurrentPage(1); // Reset to the first page when searching
  // };

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < Math.ceil(answer.length / answersPerPage)) {
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
    const timeDifference = now - createdDate; // Difference in milliseconds

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

  return (
    <div className={styles.container}>
      <div className={styles.questionSection}>
        <h1 className={styles.questionHeading}>QUESTION</h1>
        <h3 className={styles.questionTitle}>
          <FaCircleArrowRight size={17} color={"#0b5ed7"} /> {question.title}
        </h3>
        <div className={styles.line}></div>
        <h4 className={styles.questionDescription}>{question.content}</h4>
      </div>
      {answer.length > 0 ? (
        <div className={styles.answerSection}>
          <h2 className={styles.answerCommunity}>Answer From The Community</h2>
          {currentAnswers?.map((singleAnswer) => (
            <div key={singleAnswer.answer_id} className={styles.singleAnswer}>
              <div className={styles.avatar}>
                <IoPersonCircleOutline size={55} />
                <p>
{singleAnswer.user_name}
                </p>
              </div>
              <div className={styles.answerWrapper}>
                <div className={styles.answerContentMeta}>
                  <p className={styles.answerContent}>{singleAnswer.content}</p>
                </div>
                <div className={styles.answerMeta}>
                  <p>
                    <MdOutlineDateRange size={20} />
                    {getTimeAgo(singleAnswer.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {/* Pagination Navigation */}
          {answer.length > 6 && (
            <div className={styles.pagination}>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={
                  currentPage === Math.ceil(answer.length / answersPerPage)
                }
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className={styles.answerNotFound}>
            No Answers Yet! Be the First to Answer !!!
          </p>
        </div>
      )}
      <div>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={7}
            placeholder="Your Answer . . ."
            ref={description}
            required
          ></textarea>
          <button type="submit" className={styles.submitButton}>
            Post Answer
          </button>
        </form>
      </div>
    </div>
  );
};
export default getAnswer;
