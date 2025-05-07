import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const JobDescription = () => {
  const navigate = useNavigate();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <Button
        variant="ghost"
        className="flex items-center gap-2 mb-4 text-gray-700 hover:text-black"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        Back
      </Button>
      {/* Job Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {singleJob?.title}
          </h1>
          <div className="flex flex-wrap gap-3 mt-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1 font-medium">
              {singleJob?.position} Positions
            </Badge>
            <Badge className="bg-red-100 text-red-800 px-3 py-1 font-medium">
              {singleJob?.jobType}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1 font-medium">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        {/* Apply Button */}
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`px-5 py-2 rounded-lg font-semibold transition-all ${
            isApplied
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      {/* Job Description */}
      <div className="bg-gray-100 p-5 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
          Job Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Role:</h3>
            <p className="text-gray-800">{singleJob?.title}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Location:</h3>
            <p className="text-gray-800">{singleJob?.location}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Experience Required:</h3>
            <p className="text-gray-800">{singleJob?.experienceLevel} yrs</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Salary:</h3>
            <p className="text-gray-800">{singleJob?.salary} LPA</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Total Applicants:</h3>
            <p className="text-gray-800">{singleJob?.applications?.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700">Posted Date:</h3>
            <p className="text-gray-800">
              {singleJob?.createdAt.split("T")[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
          Job Description
        </h2>
        <p className="mt-3 text-gray-700 leading-relaxed">
          {singleJob?.description}
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
