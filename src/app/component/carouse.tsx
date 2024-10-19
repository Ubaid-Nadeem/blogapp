import "./carousel.css";

export default function Carousel() {
  return (
    <div>
      <div className="carousel carousel-center rounded-box">
        <div
          className="carousel-item p-2 carousel-card-shadow"
          style={{
            position: "relative",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "220px",
              height: "320px",
              borderRadius: "10px",
            }}
            src="https://cdn.pixabay.com/photo/2012/09/15/02/22/forest-56930_640.jpg"
            alt="Pizza"
          />

          <div
            style={{
              position: "absolute",
              color: "white",
              padding: "15px",
              bottom: "10px",
              borderRadius: "10px",
              width: "220px",
              fontSize: "14px",
            }}
          >
            <p> Inspiration For New Project Can Be Found</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#baced0",
                gap: "5px",
                marginTop: "10px",
                fontSize: "12px",
              }}
            >
              <div className="avatar">
                <div className="w-6 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <p>Ubaid</p>
            </div>
          </div>
        </div>
        <div
          className="carousel-item p-2 carousel-card-shadow"
          style={{
            position: "relative",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "220px",
              height: "320px",
              borderRadius: "10px",
            }}
            src="https://images.pexels.com/photos/2444429/pexels-photo-2444429.jpeg?cs=srgb&dl=pexels-chris-czermak-1280625-2444429.jpg&fm=jpg"
            alt="Pizza"
          />

          <div
            style={{
              position: "absolute",
              color: "white",
              padding: "15px",
              bottom: "10px",
              borderRadius: "10px",
              width: "220px",
              fontSize: "14px",
            }}
          >
            <p> Inspiration For New Project Can Be Found</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#baced0",
                gap: "5px",
                marginTop: "10px",
                fontSize: "12px",
              }}
            >
              <div className="avatar">
                <div className="w-6 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <p>Ubaid</p>
            </div>
          </div>
        </div>
        <div
          className="carousel-item p-2 carousel-card-shadow"
          style={{
            position: "relative",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "220px",
              height: "320px",
              borderRadius: "10px",
            }}
            src="https://media.istockphoto.com/id/108313184/photo/dark-angel.jpg?s=612x612&w=0&k=20&c=s4pZ6Avs9SINqt1IzCNQjXZluXyajkQlHV0aIqOeWYM="
            alt="Pizza"
          />

          <div
            style={{
              position: "absolute",
              color: "white",
              padding: "15px",
              bottom: "10px",
              borderRadius: "10px",
              width: "220px",
              fontSize: "14px",
            }}
          >
            <p> Inspiration For New Project Can Be Found</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#baced0",
                gap: "5px",
                marginTop: "10px",
                fontSize: "12px",
              }}
            >
              <div className="avatar">
                <div className="w-6 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <p>Ubaid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
