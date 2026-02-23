export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 700, margin: "80px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1>Privacy Policy</h1>

      <p>Effective Date: February 2026</p>

      <h2>Information We Collect</h2>
      <p>
        Cabbage Ride collects information necessary to provide transportation services, including:
      </p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Profile photo (optional)</li>
        <li>Precise location data while using the app</li>
        <li>Ride history and trip details</li>
      </ul>

      <h2>How We Use Information</h2>
      <p>
        We use collected information to:
      </p>
      <ul>
        <li>Create and manage user accounts</li>
        <li>Facilitate ride requests and navigation</li>
        <li>Communicate ride updates</li>
        <li>Provide customer support</li>
        <li>Improve app performance and reliability</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Payments are processed securely through Stripe. We do not store full payment card details on our servers.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We do not sell personal information. Data is shared only as necessary to provide ride services (e.g., between passenger and driver).
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related questions, contact: rustamsoliev1981@gmail.com
      </p>

      <hr style={{ margin: "40px 0" }} />

      <p style={{ fontSize: 14, color: "gray" }}>
        © {new Date().getFullYear()} Cabbage Ride
      </p>
    </main>
  );
}