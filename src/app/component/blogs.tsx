"use client";

import { useState } from "react";
import "./blog.css";

export default function AllBlogs() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="blog-card-container">
      <div className="card card-side bg-base-100 shadow-xl blog-card">
        <div className="card-body p-4 blog-card-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "10px",
              flexDirection: "row",
              fontWeight: "bold",
            }}
            className="blog-card-username"
          >
            <div className="avatar">
              <div className="w-7 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <p>Ubaid Nadeem</p>
          </div>
          <h2 className="card-title ">New movie is released!</h2>

          <div
            className="bg-primary"
            style={{
              margin: "5px 0",
              border: "1px sloid black",
              padding: "5px 15px",
              width: "fit-content",
              fontSize: "13px",
              borderRadius: "20px",
              color: "#e5e7eb",
            }}
          >
            Google
          </div>
          <p>
            {" "}
            Free Blog on Family Topics — Visit our website to discover resources
            to parent well. Get our blog post and podcast. Victorious Family has
            the tools to strengthen your fam and help it to flourish. Free
            newsletter.
          </p>

          <div
            className="card-actions"
            style={{
              justifyContent: "end",
            }}
          >
            <button
              className="btn"
              onClick={() => {
                setIsFavorite(!isFavorite);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  fill: isFavorite ? "red" : "",
                  stroke: isFavorite ? "red" : "black",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="btn btn-primary read-blog-btn">
              Read Blog &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
