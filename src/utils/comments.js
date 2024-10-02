const updateAnswers = (currentAnswers, question, questionType, answer) => {
  const answerExists = currentAnswers.find((stateAnswer) => stateAnswer.question === question);
  let updatedAnswer;
  if (answerExists && typeof answerExists !== 'undefined') {
    updatedAnswer = currentAnswers.map((allAnswers) => {
      if (allAnswers.question === question) {
        if (questionType === 'single-choice') {
          return { ...allAnswers, answers: [answer] };
        }
        const isDeselecting = allAnswers.answers.includes(answer);
        return {
          ...allAnswers,
          answers: isDeselecting
            ? allAnswers.answers.filter((sortAnswers) => sortAnswers !== answer)
            : [...allAnswers.answers, answer],
        };
      }
      return allAnswers;
    });
  } else {
    updatedAnswer = [...currentAnswers, { question, answers: [answer], type: questionType }];
  }
  return updatedAnswer;
};

export default updateAnswers