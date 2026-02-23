export default function SupportPage() {
  return (
    <main style={{ maxWidth: 600, margin: "80px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1>Cabbage Ride Support</h1>

      <p>
        If you are experiencing issues with Cabbage Ride, please contact our support team.
      </p>

      <p>
        📧 Email: rustamsoliev1981@gmail.com
      </p>

      <p>
        We typically respond within 24–48 hours.
      </p>

      <hr style={{ margin: "40px 0" }} />

      <p style={{ fontSize: 14, color: "gray" }}>
        © {new Date().getFullYear()} Cabbage Ride
      </p>
    </main>
  );
}