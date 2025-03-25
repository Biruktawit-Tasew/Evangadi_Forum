import { useState, useEffect } from "react";
import axios from "../../Api/axios";
import { FaRegMessage } from "react-icons/fa6";
// Create a separate component for each question
const FetchAnswer = ({ question }) => {
  const [answerCount, setAnswerCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAnswerCount = async () => {
      try {
        const response = await axios.get(`/answers/${question.question_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.Answers.length);
        // Check different possible response structures
        const count = response.data.Answers.length;

        setAnswerCount(count);
      } catch (err) {
        setAnswerCount(0);
      }
    };

    fetchAnswerCount();
  }, [question.question_id]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span>
        <FaRegMessage />
      </span>
      <p> Answers: {answerCount}</p>
    </div>
  );
};
export default FetchAnswer;