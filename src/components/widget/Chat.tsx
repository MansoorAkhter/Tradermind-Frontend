import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FiMessageCircle } from "react-icons/fi";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { IoIosClose, IoIosSend } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../shared/Loader";
import { BASE_URL } from "@/utils/page";
import { resolutionConvertor } from "@/trading_view/helpers";

const Chat = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [sessionId, setSessionId] = useState(""); // State to hold the session ID
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeak, setIsSpeak] = useState(null);
  const [researcherMsgs, setResearcherMsgs] = useState<Array<any>>([
    {
      content:
        "Hey , I am your Researcher Buddy , You can call me buddy. So buddy what are we looking at?",
      role: "user",
    },
  ]);
  const [senseiMsgs, setSenseiMsgs] = useState<Array<any>>([
    {
      content:
        "Hey , I am your Trader Sensei welcome to my class, lets refine your trading skills. Are you ready?",
      role: "user",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [activetab, setActivetab] = useState("researcher");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsSpeak(null);
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = {
        role: "user",
        content: inputText,
      };
      {
        activetab === "researcher"
          ? setResearcherMsgs((prev) => [...prev, newMessage])
          : setSenseiMsgs((prev) => [...prev, newMessage]);
      }
      setInputText("");
      setIsLoading(true);

      const url_test = `${BASE_URL}/users/chat`;

      try {
        const response = await fetch(url_test, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: sessionId,
            user_query: inputText,
            type: activetab,
          }),
        });

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        if (response.ok) {
          const threadId = response.headers.get("x-thread-id");
          if (threadId && sessionId === "") {
            localStorage.setItem("tid", threadId);
            setSessionId(threadId);
          }
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let botResponseContent = "";

          while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;
            const chunk = decoder.decode(value, { stream: !done });
            setIsLoading(false);

            // Each chunk contains data with "data:" prefix, parse it as JSON
            chunk.split("\n").forEach((data) => {
              if (data.trim().startsWith("data:")) {
                const jsonData = JSON.parse(data.replace("data: ", "").trim());
                const messageValue = jsonData.text.value; // Get the value field
                botResponseContent += messageValue;

                // Update the most recent assistant message progressively
                setResearcherMsgs((prev) => {
                  // Create a shallow copy of the array
                  const updatedMessages = [...prev];
                  if (
                    updatedMessages[updatedMessages?.length - 1].role ===
                    "assistant"
                  ) {
                    // Append the new content to the last assistant message
                    updatedMessages[updatedMessages?.length - 1].content =
                      botResponseContent;
                    return updatedMessages;
                  } else {
                    const newMsg = {
                      role: "assistant",
                      content: botResponseContent,
                    };
                    updatedMessages.push(newMsg);
                    return updatedMessages;
                  }
                });
              }
            });
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch the text response:", response.status);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error:", error);
      }
    }
  };

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("You said: ", transcript);
      setIsRecording(false);
      setIsLoading(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const url_test =
        "https://vocal-national-basilisk.ngrok-free.app/api/process";

      try {
        const response = await fetch(url_test, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "speech",
            speech_text: transcript,
            session_id: sessionId,
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          console.log("Blob type:", blob.type); // Log the blob type to inspect it
          setAudioUrl(audioUrl);
          if (audioRef.current) {
            const sourceElement =
              audioRef.current.querySelector("source") ||
              document.createElement("source");
            sourceElement.src = audioUrl;
            sourceElement.type = blob.type;

            //=========>>
            if (!audioRef.current.querySelector("source")) {
              audioRef.current.appendChild(sourceElement);
            }
            audioRef.current.load();
            //<<=========

            audioRef.current.play();
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch the audio file:", response.status);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error:", error);
      }
    };
  } else {
    setIsRecording(false);
    window.alert("Speech recognition not supported in this browser.");
  }

  const handleRecordClick = () => {
    if (recognition && !isLoading) {
      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        recognition.start();
        setIsRecording(true);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault(); // Prevent form submission or any default behavior
      sendMessage();
    }
  };

  const GetHistory = async (SID: any) => {
    const url_test = `${BASE_URL}/users/conversations/${SID}/messages`;

    try {
      const response = await fetch(url_test, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const history = await response.json();
      const AllMessages = history?.messages?.reverse()?.map((msg: any) => {
        const { content, role } = msg;
        return { content: content[0]?.text?.value, role };
      });
      setResearcherMsgs(AllMessages);
      {
        activetab === "researcher"
          ? setResearcherMsgs(AllMessages)
          : setSenseiMsgs(AllMessages);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    const TID = localStorage.getItem("tid");
    if (TID) {
      setSessionId(TID);
      GetHistory(TID);
    }
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setIsRecording(false);
      audioRef.current.play();
    }
  }, [audioUrl]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [researcherMsgs]);

  return (
    <Draggable
      handle=".chat-header"
      bounds="parent"
      defaultClassName="transition-none"
      // grid={[1, 1]}
      // scale={0.9}
    >
      <div
        className="fixed bottom-4 right-4 text-white touch-none Chat_Container"
        style={{ touchAction: "none" }}>
        {!isChatOpen && (
          <button
            onClick={toggleChat}
            className={`
          relative overflow-hidden p-3 text-lg font-semibold text-white
          bg-blue-600 rounded-full transition-all duration-300 ease-in-out
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
          ${isHovered ? "animate-none" : "glow"}
        `}
            aria-label="Open chat"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <FiMessageCircle size={24} />
            <span
              className={`
            absolute inset-0 overflow-hidden rounded-full
            ${isHovered ? "animate-ripple" : ""}
          `}
            />
          </button>
        )}
        {isChatOpen && (
          <div className="bg-gray-900 rounded-lg shadow-xl w-86 h-[600px] md:w-96 md:h-[800px] flex flex-col">
            <div className="chat-header bg-gray-800 py-3 px-4 rounded-t-lg flex justify-center items-center">
              {/* Animated Tab bar >>*/}
              <div
                className={`relative border border-slate-600 rounded-lg *:cursor-pointer h-9 w-[80%] flex justify-around items-center text-[13px] *:w-1/2`}>
                <button
                  onClick={() => setActivetab("researcher")}
                  className={`${
                    activetab === `researcher` ? `text-white` : `text-slate-500`
                  } transition-colors duration-300 z-10 uppercase`}>
                  Researcher
                </button>
                <button
                  onClick={() => setActivetab("sensei")}
                  className={`${
                    activetab === `sensei` ? `text-white` : `text-slate-500`
                  } transition-colors duration-300 z-10 uppercase`}>
                  Sensei
                </button>
                <div
                  className={`${
                    activetab === `researcher`
                      ? `-translate-x-[52px] md:-translate-x-[66px]`
                      : `translate-x-[52px] md:translate-x-[66px]`
                  } bg-primary absolute rounded-md z-0 h-[80%] transition-all duration-500`}
                />
              </div>
              {/*<< Animated Tab bar */}
              <button
                onClick={toggleChat}
                onTouchStart={toggleChat}
                className="text-gray-300 hover:text-white absolute right-2"
                aria-label="Close chat">
                <IoIosClose size={25} />
              </button>
            </div>
            {isLoading && isSpeak === true && (
              <div className="flex flex-col items-center gap-3 justify-center h-full">
                <Loader />
              </div>
            )}
            {/* {!isLoading && isSpeak === null && (
            <div className="flex flex-col items-center gap-3 justify-center h-full">
              <button
                className="bg-white text-black rounded-full p-2 hover:bg-gray-300 flex gap-3 items-center justify-center text-sm min-w-60"
                onClick={() => setIsSpeak(true)}
              >
                <FaMicrophone /> <span>Speak</span>
              </button>
              <button
                className="bg-white text-black rounded-full p-2 hover:bg-gray-300 flex gap-3 items-center justify-center text-sm min-w-60 "
                onClick={() => setIsSpeak(false)}
              >
                <FaKeyboard /> <span>Type</span>
              </button>
            </div>
          )} */}
            {/* {!isLoading && isSpeak === true && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
                {audioUrl && <WaveSurferVisualizer audioSrc={audioUrl} />}
                <div className="relative">
                  <button
                    className={`w-16 h-16 rounded-full flex items-center justify-center bg-[#548BF2] transition-all duration-300 ${
                      isRecording ? "scale-110" : "scale-100"
                    }`}
                    onClick={() => handleRecordClick()}
                  >
                    <FaMicrophone
                      className={`w-8 h-8 text-primary-foreground ${
                        isRecording ? "animate-pulse" : ""
                      }`}
                    />
                  </button>
                  {isRecording && (
                    <div className="-left-1 -top-2 absolute w-20 h-20 rounded-full bg-primary/20 animate-ping">
                      <div className="-left-0 -top-1 absolute w-20 h-20 rounded-full bg-primary/30 animate-ping"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )} */}
            {/* {isSpeak === false && ( */}
            <div className="flex-1 overflow-hidden overflow-y-auto space-y-4 flex flex-col justify-end">
              <div className="overflow-y-auto p-4" ref={chatContainerRef}>
                {(activetab === "researcher" ? researcherMsgs : senseiMsgs).map(
                  (message, index) => (
                    <div
                      key={index}
                      className={`mb-4 flex w-full ${
                        message?.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}>
                      <div
                        className={`mb-2 flex max-w-[85%] ${
                          message?.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}>
                        {message?.role === "assistant" && (
                          <HiChatBubbleBottomCenterText className="text-gray-500 text-xl mr-2 mt-2" />
                        )}
                        <div
                          className={`rounded-lg p-2  w-full ${
                            message?.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-gray-200"
                          }`}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            children={message?.content}
                          />
                          {/* <div
                          dangerouslySetInnerHTML={{ __html: marked(message?.content) }}
                        /> */}
                          {/* <p>{message?.content}</p> */}
                          {/* <ReactMarkdown>{message?.content}</ReactMarkdown> */}
                        </div>
                      </div>
                    </div>
                  )
                )}
                {isLoading && (
                  <div className={`flex justify-start`}>
                    <Loader />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 px-4 pb-4">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown} // Add this line
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-full px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-500"
                  aria-label="Send message">
                  <IoIosSend size={20} />
                </button>
              </div>
            </div>
            {/* )} */}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default Chat;
