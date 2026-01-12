import {
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { BASE_URL, BASE_URL_IMG } from "../../utils/constants";
import { useDeleteItemFromList } from "../../Hooks/ui/useDeleteItemFromList";
import { customErrorLog } from "../../utils/customErrorLog";
import { useFAQ } from "../../Hooks/adminDashBoard/setting/useFAQ";
import { Loader2, Trash } from "lucide-react";
import { deleteFAQ } from "../../api/admin/setting/deleteFAQ";
import { useQueryClient } from "@tanstack/react-query";

const initialData = [{ faq: "FAQ 1" }];

export const FAQ = forwardRef((props, ref) => {
  const [data, setData] = useState(initialData);
  const [faqs, setFaqs] = useState([
    { question: "", answer: "", questionAr: "", answerAr: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  const addFaq = () => {
    setFaqs([
      ...faqs,
      { question: "", answer: "", questionAr: "", answerAr: "" },
    ]);
    const newFaq = { faq: `FAQ ${data.length + 1}` };
    setData([...data, newFaq]);
  };

  const handleInputChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };
  const queryClient = useQueryClient();
  const handleSave = async () => {
    setIsLoading(true);

    // Filter out empty FAQs
    const validFaqs = faqs.filter(
      (faq) =>
        faq.question.trim() !== "" &&
        faq.answer.trim() !== "" &&
        faq.questionAr.trim() !== "" &&
        faq.answerAr.trim() !== ""
    );

    if (validFaqs.length === 0) {
      toast.error(t("plAtleastOneFAQ"));
      setIsLoading(false);
      return;
    }

    try {
      // Send each FAQ as a separate API request
      for (const faq of validFaqs) {
        const formattedData = {
          question: [faq.question, faq.questionAr],
          answer: [faq.answer, faq.answerAr],
        };
        // console.log(formattedData);

        const response = await fetch(`${BASE_URL}settings/faq`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify(formattedData),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }
      }

      // Clear inputs after successful submission
      setFaqs([{ question: "", answer: "", questionAr: "", answerAr: "" }]);
      setData([{ faq: "FAQ 1" }]);
      toast.success(t("FAQAddSucc"));
      queryClient.invalidateQueries(['website-FAQ']);
    } catch (error) {
      console.error("Error saving faqs:", error);
      toast.error(t("FAQAddErr"));
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    saveFaq: handleSave,
  }));

  return (
    <>
      <Paper sx={{ padding: "20px 50px", borderRadius: "20px" }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            backgroundColor={"transparent"}
          >
            {" "}
            <CircularProgress sx={{ color: "#ef7c00" }} />
          </Box>
        ) : (
          <>
            {data.map((item, index) => (
              <Box key={index}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "10px",
                    color: theme.palette.text.gray,
                    marginBottom: "5px",
                  }}
                >
                  {item.faq}
                </Typography>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                      <TextField
                        placeholder={t("questions")}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={faqs[index]?.question || ""}
                        onChange={(e) =>
                          handleInputChange(index, "question", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "10px",
                            height: "25px",
                            borderRadius: "10px",
                            backgroundColor:
                              theme.palette.bodyColor.secandaryInput,
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        placeholder={t("answer")}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={faqs[index]?.answer || ""}
                        onChange={(e) =>
                          handleInputChange(index, "answer", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "10px",
                            height: "40px",
                            borderRadius: "10px",
                            backgroundColor:
                              theme.palette.bodyColor.secandaryInput,
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        placeholder={t("questionsAr")}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={faqs[index]?.questionAr || ""}
                        onChange={(e) =>
                          handleInputChange(index, "questionAr", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "10px",
                            height: "25px",
                            borderRadius: "10px",
                            backgroundColor:
                              theme.palette.bodyColor.secandaryInput,
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        placeholder={t("answerAr")}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={faqs[index]?.answerAr || ""}
                        onChange={(e) =>
                          handleInputChange(index, "answerAr", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "10px",
                            height: "40px",
                            borderRadius: "10px",
                            backgroundColor:
                              theme.palette.bodyColor.secandaryInput,
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ margin: "15px" }} />
              </Box>
            ))}
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton
                onClick={addFaq}
                sx={{ textAlign: "center" }}
                disabled={isLoading}
              >
                <AddIcon fontSize="large" sx={{ color: "grey" }} />
              </IconButton>
            </Box>
          </>
        )}
      </Paper>
      <FAQList />
    </>
  );
});

const FAQList = () => {
  const { data } = useFAQ()
  const { i18n } = useTranslation();
  const theme = useTheme();
  const { handleDeleteItem, isItemDeleting } = useDeleteItemFromList({ queryName: "website-FAQ", deleteApiFn: deleteFAQ })
  // question
  // answer white_lightBlack
  return (
    <div>
      {
        data?.data?.map(item => {
          let question = null
          let answer = null
          try {
            question = JSON.parse(item.question)
            answer = JSON.parse(item.answer)
            customErrorLog({ fileName: "hh", error: question })
            customErrorLog({ fileName: "hh", error: answer })
            if (i18n.language === 'ar') {
              question = question[1]
              answer = answer[1]
            } else {
              question = question[0]
              answer = answer[0]
            }
          } catch (error) {
            console.log(error)
          }

          return (
            <div
            style={{ backgroundColor: theme.palette.bodyColor.secandary , color:theme.palette.text.black_white }} 
            className={`text-black my-4 px-4 py-2  rounded-lg flex justify-between`} >
              <div>
                <p>{question}</p>
                <p>{answer}</p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                disabled={isItemDeleting(item.id)}
              >
                {
                  isItemDeleting(item.id)
                    ? <Loader2 className="animate-spin text-gray-500" size={24} />
                    : <Trash size={24} color="red" />
                }
              </button>
            </div>
          )
        })
      }
    </div>
  )
}