import "./blog.css";

export default function AllBlogs() {
  return (
    <div className="blog-card-container">
      <div className="card card-side bg-base-100 shadow-xl blog-card">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            alt="Movie"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">New movie is released!</h2>
          <p>Click the button to watch on Jetflix app.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Read Blog</button>
          </div>
        </div>
      </div>
      <div className="card card-side bg-base-100 shadow-xl blog-card">
        <figure>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaqXE2-35lpePkzxINgvEC-szzzie038K8dapmDvxAx_PSx2poCug5bAumsgK_3PTAkYs&usqp=CAU"
            alt="Movie"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">New movie is released!</h2>
          <p>Click the button to watch on Jetflix app.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Read Blog</button>
          </div>
        </div>
      </div>
    </div>
  );
}
