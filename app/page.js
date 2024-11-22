"use client";

import React, { useEffect, useState } from "react";
import { getData } from "./actions/data";
import chat, { createPlan, updatePlanField } from "./api/chat/route";
import Image from "next/image";
import generatePDF from "./actions/downloadPdf";
import { BsDownload } from "react-icons/bs";
import { IoMdCheckmark } from "react-icons/io";

import { TbRecycle } from "react-icons/tb";



const FrontPage = () => {
  // State variables for dropdowns
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [keypoints, setKeypoints] = useState(null);
  const [plan, setPlan] = useState(null);
  const [pdf, Setpdf] = useState(false)

  const [data, setData] = useState([]); // For storing fetched data

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData();
        setData(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = selectedClass
      ? [
          ...new Set(
            data
              .filter((item) => item.class === Number(selectedClass))
              .map((item) => item.subject)
          ),
        ]
      : [];

    setFilteredSubjects(filtered);
    console.log(
      `for the selected class: ${selectedClass}, filtered is: ${filtered} also data is ${data}`
    );
  }, [selectedClass]);

  useEffect(() => {
    const filtered =
      selectedClass && selectedSubject
        ? data
            .filter(
              (item) =>
                item.class === Number(selectedClass) &&
                item.subject === selectedSubject
            )
            .map((item) => ({
              chapter: item.chapter,
              content: item.content, // Assuming `link` is the chapter title or reference
            }))
        : [];
    console.log(filtered);
    setFilteredChapters(filtered);
    console.log(
      `for the selected subject: ${selectedSubject}, filtered is: ${filtered} also data is ${data}`
    );
  }, [selectedSubject]);

  // Extract unique values for class dropdown
  const uniqueClasses = [...new Set(data.map((item) => item.class))];

  // Handlers for dropdown changes
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSubject(""); // Reset subject and chapter when class changes
    setSelectedChapter("");
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedChapter(""); // Reset chapter when subject changes
  };

  const handleChapterChange = (e) => {
    setSelectedChapter(e.target.value);
  };

  const handleConfirm = async () => {
    if (!selectedClass || !selectedSubject || !selectedChapter) {
      alert("Please select a class, subject, and chapter.");
      return;
    }

    try {
      // Find the selected chapter's title
      const chapterData = filteredChapters.find(
        (chapter) => chapter.chapter === Number(selectedChapter)
      );

      if (!chapterData) {
        alert("Could not find the selected chapter details.");
        return;
      }

      const chapterContent = chapterData.content; // Assuming 'title' contains the chapter text or summary

      // Call the chat function with the chapter content
      const response = await chat(chapterContent);

      // Update the keypoints state with the response
      setKeypoints(response);
      console.log("Keypoints generated:", response);
    } catch (error) {
      console.error("Error generating keypoints:", error);
      alert("An error occurred while generating keypoints. Please try again.");
    }
  };

  async function handleGenerate() {
    let data = await createPlan(6, keypoints);
    setPlan(data);
  }

  async function handlePlanField(ff, sf, tf, context, tn) {
    let updatedData = await updatePlanField(ff, sf, tf, context, tn);

    if (tn == "Class Activities") {
      setPlan((prevPlan) => ({
        ...prevPlan, // Retain other fields like introduction, mainContent
        classActivities: updatedData, // Update classActivities with the new data
      }));
    } else if (tn == "Introduction") {
      setPlan((prevPlan) => ({
        ...prevPlan, // Retain other fields like introduction, mainContent
        introduction: updatedData, // Update classActivities with the new data
      }));
    } else {
      setPlan((prevPlan) => ({
        ...prevPlan, // Retain other fields like introduction, mainContent
        mainContent: updatedData, // Update classActivities with the new data
      }));
    }
  }

  // Filter subjects based on selected class (CORRECTED)

  // Filter chapters based on selected class and subject

  return (
    <>
      {/*NAVBAR*/}
    
      <div className="flex  w-full mx-auto justify-between  px-24 p-4 fixed top-0">
        <Image src="/jaipuria_school_logo.jpg" width={500} height={520} alt="" className="w-[100px] h-[40px]"/>

        <button className="bg-white text-black rounded-full items-center text-center px-6 py-3 font-bold border">Previously Generated</button>
      </div>



     

      <div className="max-w-full mx-auto ">

         {/*HOME*/}
        <div className="flex max-h-screen items-center">
          <div className="w-1/2 px-24">
          <p className="mb-6">Generate your Lesson Plan</p>
          <h1 className="text-5xl font-bold mb-8">
          Enter Details
        </h1>

        {/* Dropdown for Class */}
        <div className="mb-2 text-black">
          <select
            id="class"
            value={selectedClass}
            onChange={handleClassChange}
            className="block w-full px-6 py-4 border rounded-[999px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="rounded-full">Choose Class</option>
            {uniqueClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Subject */}
        <div className="mb-2 text-black">
          <select
            id="subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="block w-full px-6 py-4 border rounded-[999px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

            disabled={!selectedClass}
          >
            <option value="">Choose Subject</option>
            {filteredSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Chapter */}
        <div className="mb-6 text-black">
          <select
            id="chapter"
            value={selectedChapter}
            onChange={handleChapterChange}
            className="block w-full px-6 py-4 border rounded-[999px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

            disabled={!selectedSubject}
          >
            <option value="">Choose Chapter</option>
            {filteredChapters.map((chapter) => (
              <option key={chapter.chapter} value={chapter.chapter}>
                {chapter.chapter}
              </option>
            ))}
          </select>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="bg-black flex items-center gap-2 text-white p-4 px-8 mt-2 rounded-[999px]"
        >
          
          🤖 Generate Keypoints
        </button>
        </div>
            <div className="w-1/2"> 
            <Image src="/hero.jpg" width={4000} height={4000} alt="" className="max-h-screen object-cover"/>
            </div>
            
          </div>
        
      

        {keypoints && (
          <div className="mt-24 rounded-lg  items-center p-2 gap-4 max-w-[1080px] mx-auto">
            <h2 className="text-sm font-semibold mb-4 text-black">
                Here are your key concepts for class {selectedClass}, Chapter {selectedChapter} of the {selectedSubject} book
              </h2>
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Review:
              </h2>
            <div className="border  max-w-[1080px] mx-auto rounded p-2">
              <pre className="text-black max-w-[1080px] text-wrap text-sm">
                {keypoints}
              </pre>
            </div>
            <div className=" text-black flex mx-auto items-center justify-center w-full">
              <button className="bg-black flex items-center gap-2 rounded-[999px] text-white px-8 py-3 m-2 " onClick={handleGenerate}>
              <IoMdCheckmark/> Confirm
              </button>
              <button className="bg-white rounded-[9999px] border border-black flex items-center gap-2 px-8 py-3 m-2" onClick={handleConfirm}> <TbRecycle width={40}/>
               Regenerate</button>
            </div>
          </div>
        )}
      <hr className="max-w-[1080px] mx-auto mt-12"/>
        {plan && (
          <div className="mt-8 rounded-lg flex flex-col gap-6 max-w-[1080px] justify-center mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Lesson Plan
            </h2>

            <div className=" items-center gap-4">
              {/* Introduction Section */}

              {plan.introduction && (
                <div className="mb-4 rounded p-4">
                  <h3 className="text-xl font-medium mb-4 text-black">
                    Introduction:
                  </h3>
                      <p className="text-black border p-4 rounded ">{plan.introduction}</p>

                </div>
              )}
              <button
               className="bg-white gap-2 items-center  rounded-[9999px] border flex   px-8 py-3 mx-auto justify-center border-black" 

                onClick={() => {
                  handlePlanField(
                    plan.introduction,
                    plan.mainContent,
                    plan.classActivities,
                    keypoints,
                    "Introduction"
                  );
                }}
              >
                <TbRecycle width={40}/> Regenerate
              </button>

              <div></div>
            </div>

            <div className=" items-center gap-4">
              {plan.mainContent && (
                <div className="mb-4   rounded p-4">
                  <h3 className="text-xl mb-4 font-medium text-black">
                    Main Content:
                  </h3>
                  <p className="text-black border p-4 rounded ">{plan.mainContent}</p>
                </div>
              )}
              <button
               className="bg-white rounded-[9999px] border flex gap-2 items-center  px-8 py-3 mx-auto justify-center border-black" 
                onClick={() => {
                  handlePlanField(
                    plan.introduction,
                    plan.mainContent,
                    plan.classActivities,
                    keypoints,
                    "Main Body"
                  );
                }}
              >
                <TbRecycle width={40}/> Regenerate
              </button>
            </div>
            {/* Main Content Section */}

            {/* Class Activities Section */}
            <div className=" items-center gap-4">
              {plan.classActivities && (
                <div className="mb-4 rounded p-4">
                  <h3 className="text-xl mb-4 font-medium text-black">
                    Class Activities:
                  </h3>
                  <p className="text-black border  p-4 rounded">{plan.classActivities}</p>
                </div>
              )}
             

              <button
                          className="bg-white gap-2 items-center rounded-[9999px] border flex   px-8 py-3 mx-auto justify-center border-black" 

                onClick={() => {
                  handlePlanField(
                    plan.introduction,
                    plan.mainContent,
                    plan.classActivities,
                    keypoints,
                    "Class Activities"
                  );
                }}
              >
                <TbRecycle width={40}/> Regenerate
              </button>
      <hr className="max-w-[1080px] mx-auto mt-12"/>

              <button
        onClick={() => generatePDF(plan, selectedClass, selectedSubject, selectedChapter)}
          className="bg-black text-white  items-center mx-auto justify-center flex rounded-[999px] mt-12 mb-20 px-8 py-3 "
      >
        <BsDownload className="w-7"/>
         Download PDF
      </button>
              
            </div>
          </div>
        )}

       
      </div>
    </>
  );
};

export default FrontPage;
