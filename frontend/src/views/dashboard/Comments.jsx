import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Moment from "../../plugin/Moment";
import apiInstance from "../../utils/axios";
import moment from "moment";

function Comments() {
    const [comments, setComments] = useState([]);
    const [reply, setReply] = useState("");
    const userId = useUserData()?.user_id;

    const fetchComments = async () => {
        const comment_res = await apiInstance.get(
            `author/dashboard/comment-list/${userId}/`
        );
        setComments(comment_res.data);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleSubmitReply = async (commentId) => {
        try {
            const response = await apiInstance.post(
                `author/dashboard/reply-comment/`,
                {
                    comment_id: commentId,
                    reply: reply,
                }
            );
            console.log(response.data);
            fetchComments();
            Toast("success", "Reply Sent");
            setReply("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            {/* Card */}
                            <div className="card mb-4">
                                {/* Card header */}
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Comments</h3>
                                        <span>
                                            You have full control to manage your
                                            own comments.
                                        </span>
                                    </div>
                                </div>
                                {/* Card body */}
                                <div className="card-body">
                                    {/* List group */}
                                    <ul className="list-group list-group-flush">
                                        {/* List group item */}
                                        {comments?.map((c, index) => (
                                            <li
                                                key={c.id}
                                                className="list-group-item p-4 shadow rounded-3 mb-4"
                                            >
                                                <div className="d-flex">
                                                    <div className="ms-3 mt-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h4 className="mb-0">
                                                                    {c.name}
                                                                </h4>
                                                                <span>
                                                                    {Moment(
                                                                        c.date
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    Comment{" "}
                                                                    <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                {c.comment}
                                                            </p>
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    Response{" "}
                                                                    <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                {c.reply ||
                                                                    "No reply"}
                                                            </p>
                                                            <p>
                                                                <button
                                                                    className="btn btn-outline-secondary"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#collapseExample${c.id.toString()}`}
                                                                    aria-expanded="false"
                                                                    aria-controls={`collapseExample${c.id.toString()}`}
                                                                >
                                                                    Send
                                                                    Response
                                                                </button>
                                                            </p>
                                                            <div
                                                                className="collapse"
                                                                id={`collapseExample${c.id.toString()}`}
                                                            >
                                                                <div className="card card-body">
                                                                    <div>
                                                                        <div className="mb-3">
                                                                            <label
                                                                                htmlFor={`responseTextarea${c.id}`}
                                                                                className="form-label"
                                                                            >
                                                                                Write
                                                                                Response
                                                                            </label>
                                                                            <textarea
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setReply(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                value={
                                                                                    reply
                                                                                }
                                                                                id={`responseTextarea${c.id}`}
                                                                                cols="30"
                                                                                className="form-control"
                                                                                rows="4"
                                                                            ></textarea>
                                                                        </div>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleSubmitReply(
                                                                                    c.id
                                                                                )
                                                                            }
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                        >
                                                                            Send
                                                                            Response{" "}
                                                                            <i className="fas fa-paper-plane">
                                                                                {" "}
                                                                            </i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Comments;
