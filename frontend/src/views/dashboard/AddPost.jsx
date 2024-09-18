import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";

function AddPost() {
    const [post, setCreatePost] = useState({
        image: "",
        title: "",
        description: "",
        category: parseInt(""),
        tags: "",
        status: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useUserData()?.user_id;
    const navigate = useNavigate();

    const fetchCategory = async () => {
        try {
            const response = await apiInstance.get(`post/category/list/`);

            setCategoryList(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleCreatePostChange = (event) => {
        setCreatePost({
            ...post,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        setCreatePost({
            ...post,
            image: {
                file: event.target.files[0],
                preview: reader.result,
            },
        });
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleCreatePost = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!post.title || !post.description || !post.image) {
            Toast("error", "All fields are required");
            setIsLoading(false);
            return;
        }
        const formData = new FormData();

        formData.append("user_id", userId);
        formData.append("title", post.title);
        formData.append("image", post.image.file);
        formData.append("description", post.description);
        formData.append("tags", post.tags);
        formData.append("category", post.category);
        formData.append("post_status", post.status);

        try {
            const response = await apiInstance.post(
                "author/dashboard/post-create/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.data);
            setIsLoading(false);
            Swal.fire({
                icon: "success",
                title: "Post created successfully",
            });
            navigate("/posts/");
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
                            <>
                                <section className="py-4 py-lg-6 bg-primary rounded-3">
                                    <div className="container">
                                        <div className="row">
                                            <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                                                <div className="d-lg-flex align-items-center justify-content-between">
                                                    <div className="mb-4 mb-lg-0">
                                                        <h1 className="text-white mb-1">
                                                            Create Blog Post
                                                        </h1>
                                                        <p className="mb-0 text-white lead">
                                                            Use the article
                                                            builder below to
                                                            write your article.
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            to="/instructor/posts/"
                                                            className="btn"
                                                            style={{
                                                                backgroundColor:
                                                                    "white",
                                                            }}
                                                        >
                                                            {" "}
                                                            <i className="fas fa-arrow-left"></i>{" "}
                                                            Back to Posts
                                                        </Link>
                                                        <a
                                                            href="instructor-posts.html"
                                                            className="btn btn-dark ms-2"
                                                        >
                                                            Save Changes{" "}
                                                            <i className="fas fa-check-circle"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <form
                                    onSubmit={handleCreatePost}
                                    className="pb-8 mt-5"
                                >
                                    <div className="card mb-3">
                                        {/* Basic Info Section */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h4 className="mb-0">
                                                Basic Information
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <label
                                                htmlFor="postTHumbnail"
                                                className="form-label"
                                            >
                                                Preview
                                            </label>
                                            <img
                                                style={{
                                                    width: "100%",
                                                    height: "330px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                                className="mb-4"
                                                src={
                                                    imagePreview ||
                                                    "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
                                                }
                                                alt=""
                                            />
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="postTHumbnail"
                                                    className="form-label"
                                                >
                                                    Thumbnail
                                                </label>
                                                <input
                                                    onChange={handleFileChange}
                                                    id="postTHumbnail"
                                                    name="file"
                                                    className="form-control"
                                                    type="file"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Title
                                                </label>
                                                <input
                                                    onChange={
                                                        handleCreatePostChange
                                                    }
                                                    className="form-control"
                                                    name="title"
                                                    type="text"
                                                    placeholder=""
                                                />
                                                <small>
                                                    Write a 60 character post
                                                    title.
                                                </small>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Posts category
                                                </label>
                                                <select
                                                    className="form-select"
                                                    onChange={
                                                        handleCreatePostChange
                                                    }
                                                    name="category"
                                                >
                                                    <option value="">
                                                        -------------
                                                    </option>
                                                    {categoryList?.map(
                                                        (c, index) => (
                                                            <option
                                                                key={index}
                                                                value={c?.id}
                                                            >
                                                                {c?.title}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <small>
                                                    Help people find your posts
                                                    by choosing categories that
                                                    represent your post.
                                                </small>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Post Description
                                                </label>
                                                <textarea
                                                    onChange={
                                                        handleCreatePostChange
                                                    }
                                                    name="description"
                                                    className="form-control"
                                                    id=""
                                                    cols="30"
                                                    rows="10"
                                                ></textarea>
                                                <small>
                                                    A brief summary of your
                                                    posts.
                                                </small>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor=""
                                                    className="form-label"
                                                >
                                                    Status
                                                </label>
                                                <select
                                                    className="form-select"
                                                    name="status"
                                                    onChange={
                                                        handleCreatePostChange
                                                    }
                                                    id=""
                                                >
                                                    <option value="Active">
                                                        Active
                                                    </option>
                                                    <option value="Draft">
                                                        Draft
                                                    </option>
                                                    <option value="Disabled">
                                                        Disabled
                                                    </option>
                                                </select>
                                            </div>
                                            <label className="form-label">
                                                Tag
                                            </label>
                                            <input
                                                onChange={
                                                    handleCreatePostChange
                                                }
                                                name="tags"
                                                className="form-control"
                                                type="text"
                                                placeholder="health, medicine, fitness"
                                            />
                                        </div>
                                    </div>
                                    {isLoading === true ? (
                                        <>
                                            {" "}
                                            <button
                                                disabled
                                                className="btn btn-lg btn-secondary w-100 mt-2"
                                                type="submit"
                                            >
                                                Creating Post...{" "}
                                                <i className="fas fa-spinner fa-spin"></i>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {" "}
                                            <button
                                                className="btn btn-lg btn-success w-100 mt-2"
                                                type="submit"
                                            >
                                                Create Post{" "}
                                                <i className="fas fa-check-circle"></i>
                                            </button>
                                        </>
                                    )}
                                </form>
                            </>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default AddPost;
