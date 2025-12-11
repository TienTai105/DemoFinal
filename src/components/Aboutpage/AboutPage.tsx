import "./AboutPage.scss";

const teamMembers = [
    { role: "Tai Leader", img: '/images/p_img37.png' },
    { role: "Hau Design", img: "/images/star_icon.png" },
    { role: "Bao Development", img: "/public/images/logo.png" },
    { role: "Hoang Test", img: "/public/images/team/dev.jpg" },
    { role: "Minh Marketing", img: "/public/images/team/marketing.jpg" },
];

export default function About() {
    return (
        <div className="about-page">

            {/* Hero Section */}
            <section className="hero">
                <h1 className="hero-title">About Us</h1>
                <p className="hero-text">
                    Welcome to <span className="bold">drop.code</span>, where fashion meets creativity.
                    We bring modern, minimal, and high-quality designs inspired by lifestyle and technology.
                </p>
            </section>

            {/* Mission + Vision Section */}
            <div className="info-grid">
                <div className="info-card">
                    <h2 className="card-title">Our Mission</h2>
                    <p className="card-text">
                        We aim to deliver stylish, comfortable, and premium outfits that allow individuals to
                        express themselves with confidence.
                    </p>
                </div>

                <div className="info-card">
                    <h2 className="card-title">Our Vision</h2>
                    <p className="card-text">
                        To become a trusted brand blending modern identity, sustainable production, and
                        a customer-first experience.
                    </p>
                </div>
            </div>

            {/* Team Section */}
            <div className="team-section">
                <h2 className="team-title">Meet Our Team</h2>

                <div className="team-grid">
                    {teamMembers.map((member, i) => (
                        <div key={i} className="team-card">
                            <div
                                className="avatar"
                                style={{ backgroundImage: `url(${member.img})` }}
                            ></div>
                            <h3 className="team-role">{member.role}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quote */}
            <p className="quote">
                "Fashion is not just clothing — it's a lifestyle, an attitude, and the way we tell our story."
            </p>

        </div>
    );
}
